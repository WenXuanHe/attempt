//最外层是一个自启动函数，传入window，factory
// 处理模块化方式加载和普通加载方式
(function (global, factory) {
    //模块化方式加载AMD
    if(typeof define === 'function' && define.amd){
        define(function () {
            return factory(global)
        })
    }else{
        factory(global)
    }
})(this, function (window) {
    // body...
});
