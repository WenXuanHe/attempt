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
