# attempt
### 记录一些有趣的事情

获取一个随机的5位字符串
```
    /**
     * [function 获取一个随机的5位字符串]
     * @param  {[type]} prefix [description]
     * @return {[type]}        [description]
     */
    util.getName = function(prefix) {
        return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };
```

```
 /**
     * [function 在页面中注入js脚本]
     * @param  {[type]} url     [description]
     * @param  {[type]} charset [description]
     * @return {[type]}         [description]
     */
    util.createScript = function(url, charset) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        charset && script.setAttribute('charset', charset);
        script.setAttribute('src', url);
        script.async = true;
        return script;
    };
    

```

```

    /**
     * [function jsonp]
     * @param  {[type]} url      [description]
     * @param  {[type]} onsucess [description]
     * @param  {[type]} onerror  [description]
     * @param  {[type]} charset  [description]
     * @return {[type]}          [description]
     */
    util.jsonp = function(url, onsuccess, onerror, charset) {
        var callbackName = util.getName('tt_player');
        window[callbackName] = function() {
            if (onsuccess && util.isFunction(onsuccess)) {
                onsuccess(arguments[0])
            };
        }
        var script = util.createScript(url + '&callback=' + callbackName, charset);
        script.onload = script.onreadystatechange = function() {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                // 移除该script的 DOM 对象
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                // 删除函数或变量
                window[callbackName] = null;
            }
        }
        script.onerror = function() {
            if (onerror && util.isFunction(onerror)) {
                onerror()
            };
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    };
```

nodejs 获取IP地址
```
// 获取执行环境的ip地址
const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

```

