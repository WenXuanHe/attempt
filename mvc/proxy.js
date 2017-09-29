var proxy = function(func, thisObject){
    //o只是一个中转站而已
    var o = function(){};
    o.prototype = func.prototype;
    var bound = function(){
        return func.apply(this instanceof o ? this : thisObject, arguments);
    };
    bound.prototype = new o;

    return bound;
}