var VERSION = 'v1';

var staticResources = [
    '/ticket-system-rebuild/assets/vendor\\.css',
    '/ticket-system-rebuild/assets/kf5-ticket-system\\.css',
    '/ticket-system-rebuild/assets/vendor\\.js',
    '/ticket-system-rebuild/assets/kf5-ticket-system\\.js'
];

var noCacheResources = [];

// 当浏览器发起请求时，会触发 fetch 事件。
this.addEventListener('fetch', onFetch);

// 脚本被安装时，会触发 install 事件
this.addEventListener('install', onInstall);

// 当安装完成后并进入激活状态，会触发 activate 事件 通过监听 activate 事件你可以做一些预处理
this.addEventListener('activate', onActivate);

// 通过 postMessage API，可以实现service worker和当前页面之间的消息传递
this.addEventListener('message', onMessage);

function updateResources (resources) {

    staticResources = resources;
}

function updateNoCachable (resources) {

    noCacheResources = resources;
}

// 对消息处理
function handleMessage (message, e) {
    // 版本号不一致，清理缓存
    if (message.version && message.version !== VERSION) {
        clearCache();
        VERSION = message.version;
    }

    if (message.doNotCache) {
        updateNoCachable(message.doNotCache);
    }

    if (message.resources) {
        updateResources(message.resources);
    }
}

function onMessage (e) {
    // 接收的postMessage的消息
    if (e.data.slice(0, 3) === 'sw:') {

        var json = e.data.slice(3);

        try {
            json = JSON.parse(json);
        }
        catch (e) {
            console.log('sw: message error', e);
            json = null;
        }

        if (json) {
            handleMessage(json, e);
        }
    }
}

function onActivate (activateEvent) {
    // 清除之前的所有缓存
    activateEvent.waitUntil(Promise.all([
        clearCache(),
        this.clients.claim()
    ]));
}

function onInstall (installEvent) {
     // event.waitUtil 用于在安装成功之前执行一些预装逻辑
    installEvent.waitUntil(this.skipWaiting());
}

function onFetch (fetchEvent) {
    // 是否满足缓存条件
    if (isCachable(fetchEvent.request)) {
        // 存在则从cache返回， 否则fetch新数据
        fetchEvent.respondWith(tryLoadFromCache(fetchEvent.request));
    }
}

// 判断url是否是需要满足需要缓存的格式
function isStaticResource (url) {

    return staticResources.find(function (resource) {

        return new RegExp(resource).test(url);
    });
}

function isNotCachable (url) {
    // agent-cache-service-worker.js文件不缓存， noCacheResources里的资源不缓存
    return (-1 !== url.indexOf('agent-cache-service-worker.js')) || noCacheResources.find(function (resource) {

        return new RegExp(resource).test(url);
    });
}

/**
 * 1.必须get
 * 2.url 不是 不需要缓存清单的文件
 * 3. 满足需要缓存的格式
 * @type {[type]}
 */
function isCachable (request) {

    return request.method === 'GET' && !isNotCachable(request.url) && isStaticResource(request.url);
}

// 从缓存中找是否存在cache
function tryLoadFromCache (request) {

    return caches.match(request).then(function (response) {
        // 存在则从cache返回， 否则fetch新数据
        return response || fetchAndCache(request);
    });
}

// 拉取请求，并将请求的数据缓存
function fetchAndCache (request) {

    return fetch(request).then(function (response) {

        return caches.open(VERSION).then(function (cache) {

            cache.put(request, response.clone());

            return response;
        });
    });
}

function clearCache () {

    return caches.keys().then(function (keys) {

        return Promise.all(keys.map(function (key) {

            return caches.delete(key);
        }));
    });
}
