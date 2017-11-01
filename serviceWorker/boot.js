(function () {

        var config = window.globalConfig || {};
        var assetsHost = config.assetsHost;
        var scope = '/';
        var controller;

        // 动态加载的资源列表
        var RESOURCES = [
            'https://' + assetsHost + '/ticket-system-rebuild/assets/vendor.css' + '?v=' + config.version,
            'https://' + assetsHost + '/ticket-system-rebuild/assets/kf5-ticket-system.css' + '?v=' + config.version,
            'https://' + assetsHost + '/ticket-system-rebuild/assets/vendor.js' + '?v=' + config.version,
            'https://' + assetsHost + '/ticket-system-rebuild/assets/kf5-ticket-system.js' + '?v=' + config.version,
            'https://www.yuntongxun.com/js/voip/swfobject.js',
            'https://www.yuntongxun.com/js/voip/Cloopen_https.js'
        ];

        var cacheSetting = {
            doNotCache: [
                'boot\\.js'
            ],
            resources: [
                '^https?:[^?]+\\.js',
                '^https?:[^?]+\\.css',
                '^https?:[^?]+/ticket-system-rebuild/fonts/',
                '^https?:[^?]+/ticket-system-rebuild/images/'
            ]
        };

        // ////////////////////////////////////////////////////////////////////////

        // 动态加载脚本方法
        var scripts = {};
        var styles = {};

        function loadScript (url, callback, onerror) {

            var el = scripts[url];

            if (el === 1) {
                callback(1);

                return;
            }
            else if (!el) {
                el = scripts[url] = document.createElement('script');
                document.getElementsByTagName('head')[0].appendChild(el);
            }

            el.src = url;

            el.onload = function () {

                scripts[url] = 1;
                callback(1);
            };
            el.onerror = function (error) {

                scripts[url] = el;
                onerror(error);
            };
        }

        // 动态加载style
        function loadStyle (url, callback, onerror) {

            var el = styles[url];

            if (el === 1) {
                callback(1);

                return;
            }
            else if (!el) {
                el = styles[url] = document.createElement('link');
                el.rel = 'stylesheet';
                el.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(el);
            }

            el.href = url;

            el.onload = function () {

                styles[url] = 1;
                callback(1);
            };
            el.onerror = function (error) {

                styles[url] = el;
                onerror(error);
            };
        }

        function isIE () {

            return navigator.userAgent.indexOf('MSIE') > 0;
        }

        function showIEWarning () {

            var style = '<style type="text/css">html {font-size: 62.5%; } body {font-size: 14px; font-family: "Open Sans",Arial,"Hiragino Sans GB","Microsoft YaHei","微软雅黑",STHeiti,"WenQuanYi Micro Hei",SimSun,sans-serif; color: #374051; background-color: #eff4f5; word-wrap: break-word; word-break: normal; } .ie-warning {position: relative; top: 150px; margin: 0 auto; width: 500px; font-size: 14px; padding: 10px 20px; line-height: 24px; background: #C00; color: #fff; z-index: 1000; } a {cursor: pointer; text-decoration: none; } .ie-warning a {color: #fff; }</style>';
            var html = '<div class="ie-warning">什么？您还在使用 Internet Explorer (IE) 浏览器？ 很遗憾，逸创云客服已不再支持IE浏览器。事实上，升级到以下支持HTML5的浏览器将获得更牛逼的操作体验： <br><a href="http://www.mozillaonline.com/">Firefox</a> / <a href="http://www.google.com/chrome/?hl=zh-CN">Chrome</a> / <a href="http://www.apple.com.cn/safari/">Safari</a> / <a href="http://www.operachina.com/">Opera</a><br> 怎么样？ 还在犹豫？还在彷徨？赶紧升级浏览器，让操作效率提升80%-120%！ </div>';

            // 必须先插入HTML再插入style，否则 IE下样式不生效
            document.body.innerHTML = html;
            document.body.innerHTML += style;
        }
        // 加载静态资源的入口
        function loadResources (resources, onfinished, onerror, index) {

            var url;

            index = index || 0;

            function callback () {
                loadResources(resources, onfinished, onerror, index + 1);
            }

            if (resources[index]) {
                url = resources[index];

                if (url.indexOf('.css') !== -1) {
                    loadStyle(url, callback, onerror);
                }
                else if (url.indexOf('.js') !== -1) {
                    loadScript(url, callback, onerror);
                }
                else {
                    console.error('Unsupported resource type.', url);
                    callback();
                }
            }
            else if (typeof onfinished === 'function') {
                onfinished();
            }
        }

        function supportWorker () {

            return 'serviceWorker' in navigator && location.protocol === 'https:';
        }

        function isDevelopment () {

            return location.host === 'im2beta.kf5.com';
        }

        function activeWorker () {

            if (supportWorker() && !localStorage.getItem('noWorker')) {

                if (isDevelopment()) {

                    return Boolean(localStorage.getItem('serviceWorker'));
                }
                else {
                    // 支持service worker  并且localStorage没有noWorker字段才生效
                    return true;
                }
            }

            return false;
        }

        function errorHandler (error) {

            throw error;
        }

        // 注册 ServiceWorker
        function registerServiceWorker () {

            return navigator.serviceWorker.register('/service-worker.js', {scope: scope})
                .then(function (worker) {

                    console.log('ServiceWorker registration succeeded, Scope is ' + worker.scope);

                    return worker;
                });
        }

        function start (activeController) {

            controller = activeController;

            controller.postMessage('sw:' + JSON.stringify({version: config.version}));
            controller.postMessage('sw:' + JSON.stringify(cacheSetting));

            loadResources(RESOURCES, null, errorHandler);
        }

        function workerReady (registration) {

            if (registration.active.state === 'activated') {
                start(registration.active);
            }
            else {
                registration.active.onstatechange = function (e) {

                    if (e.target.state === 'activated') {
                        start(registration.active);
                    }
                };
            }
        }

        // ////////////////////////////////////////////////////////////////////////

        if (isIE()) {
            window.onload = function () {
                showIEWarning();
            };
        }
        else if (window.addEventListener) {
            window.addEventListener('DOMContentLoaded', function () {
                // dom结构加载完成之后
                if (config.version) {
                    localStorage.setItem('agentVersion', config.version);
                }

                if (activeWorker()) {

                    // 清理多余的service worker
                    navigator.serviceWorker.getRegistrations().then(function (regs) {

                        for (var i = 0; i < regs.length; ++i) {

                            if (['/agent', '/kchat'].indexOf(regs[i].scope.slice(-6)) === -1) {
                                regs[i].unregister(); // 现阶段只有两个worker，有多余的就清理一遍
                            }
                        }
                    });
                    // ready之后start， 加载资源
                    navigator.serviceWorker.ready.then(workerReady);

                    if (!controller) {
                        // 开始注册service worker
                        registerServiceWorker().then(null, function (e) {

                            console.error('ServiceWorker register fail', e);
                            loadResources(RESOURCES, null, errorHandler);
                        });
                    }
                }
                else {
                    //不支持service worker 销毁掉service worker
                    if (supportWorker() && !activeWorker()) {
                        navigator.serviceWorker.getRegistration(scope).then(function (registration) {

                            if (registration) {
                                registration.unregister().then(function () {

                                    console.log('ServiceWorker unregister');
                                });
                            }
                        });
                    }

                    loadResources(RESOURCES, null, errorHandler);
                }
            }, false);
        }
        else {

            console.error('Browser may not support');
            loadResources(RESOURCES, null, errorHandler);
        }
    }());

