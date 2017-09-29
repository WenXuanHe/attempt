var proxy = require('./proxy');
var _Class = function(parent){
    var klass = function(){
        this.init.apply(this, arguments);
    }
  
    if(parent){
        klass.prototype = new parent();
    }

    klass.prototype.init = function(){};
    klass.fn = klass.prototype;
    klass.proxy = proxy;
    klass._super = klass.__proto__;    
    klass.fn.parent = klass;
    
    klass.extend = function(obj){
        var extended = obj.extended;
        Object.keys(obj).forEach(function(prop){
            klass[prop] = obj[prop];
        });
        if(extended) extended(klass);
    }

    klass.include = function(obj){
        var included = obj.included;
        Object.keys(obj).forEach(function(prop){
            klass.fn[prop] = obj[prop];
        });
        if(included) included(klass);
    }

    return klass;
}

var Person = new _Class();
//子类重写init方法，类似于多态
Person.prototype.init = {};

Person.extend({
    find: (id) => {},
    exists: (id) => {}
});

Person.include({
    save:()=>{},
    destroy: () => {}
});
var person = new Person();

//
var Animal = new _Class();
Animal.include({
breath: function(){
console.log('breath');
}
});
var Cat = new _Class(Animal)
// 用法
var tommy = new Cat;
tommy.breath();
