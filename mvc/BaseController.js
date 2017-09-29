// var Controller={};
// //控制器并不依赖类库或框架
// (Controller.user = function($){
//     var nameClick = function(){

//     }

//     $(function(){
//         $('#view .name').click(nameClick);
//     });
// })(jquery);


var exports = this;

(function ($) {
    var mod = {};
    mod.create = function (includes) {
        var result = function () {
            this.init.apply(this, arguments);
        }

        result.fn = result.prototype;
        result.fn.init = function () { };
        result.proxy = result.fn.proxy = function (func) {
            return $.proxy(func, this);
        }
        result.fn.load = function (func) {
            this.proxy(func);
        }
        result.include = function (ob) { $.extend(this.fn, ob); };
        result.extend = function (ob) { $.extend(this, ob); };
        if (includes) result.include(includes);
        return result;
    }

    exports.Controller = mod;
})(jquery);



