(function() {
    var root = this;

    //保存一堆变量  这是pointfree啊
    var ArrayProto = Array.prototype;
    var ObjProto = Object.prototype;
    var FuncProto = Function.prototype;

    var push = ArrayProto.push;
    var slice = ArrayProto.slice;
    var toString = ObjProto.toString;
    var hasOwnProperty = ObjProto.hasOwnProperty;

    var nativeIsArray = Array.isArray;
    var nativeKeys = Object.keys;
    var nativeBind = FuncProto.bind;
    var nativeCreate = Object.create;
    // body...
    ////创造一个安全的underscore函数
    var _ = function(obj) {
            if (obj instanceof _) {
                return obj;
            }
            if (!(obj instanceof _)) {
                return new _(obj);
            }
        }
        ////考虑与模块化结合的问题
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined') {
            exports = module.exports = _;
        } else {
            exports = _;
        }
    } else {
        root._ = _;
    }

    var property = function(key) {
        return function(obj) {
            return (typeof obj === 'object' && obj !== null) && obj[key];
        }
    }

    ////
    var cb = function(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(func, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    }

    var optimizeCb = function(func, context, argCount) {
            if (context === void 0) return func;
            switch (argCount || 3) {
                case 1:
                    return function(value) {
                        return func.call(context, value);
                    };
                case 2:
                    return function(value, other) {
                        return func.call(context, value, other);
                    };
                case 3:
                    return function(value, index, collection) {
                        return func.call(context, value, index, collection);
                    };
                case 4:
                    return function(accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection);
                    }
            }
            return func.apply(context, arguments);
        }
        /**
        	keysFunc:_.allKeys() 把所有的属性都加上， 包括原型链上的可枚举属性，
        	 _.Keys()  只加上自哟有属性
        	 undefinedOnly:true, 为true，相同属性不覆盖
        */
    var createAssigner = function(keysFunc, undefinedOnly) {

        return function(obj) {
            var length = arguments.length;
            if (length < 2) return obj;
            for (var key = 1; key < length; key++) {
                var source = arguments[key];
                var keys = keysFunc(source);
                var keyLength = keys.length;
                for (var i = 0; i < keyLength; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) {
                        obj[key] = source[key];
                    }
                }
            }
        }
    }

    ////js中的精确整数的最大值
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(obj) {
        ////一般有length属性的就可以称为类似数组了
        ////Array.apply(null, {length:5}) 转化
        var length = getLength(obj);
        return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }

    _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }
    _.has = function(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    }
    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);

        var keys = [];
        for (var i in obj) {
            if (_.has(obj, i)) {
                keys.push(i);
            }
        }
        return keys;
    }
    _.values = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var i = 0;
        var values = [];
        for (; i < length; i++) {
            values.push(obj[keys[i]]);
        }
        return values;
    }

    _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var i in obj) {
            keys.push(i);
        }
        return keys;
    }
    _.each = _.forEach = function(obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj);
        var length = (keys || obj).length;

        for (var i = 0; i < length; i++) {
            var currentKey = keys ? keys[i] : i;
            iteratee(obj[currentKey], currentKey, obj);
        }
        return obj;
    }
    _.map = _.collect = function(obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        ////拿到对象所有的key
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);

        for (var i = 0; i < length; i++) {
            ////拿到单个key
            var currentKey = keys ? keys[i] : i;
            results[i] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    }

    ////很强势
    function createReduce(dir) {

        var iterator = function(obj, itetatee, memo, keys, index, length) {
            var currentKey;
            ////凭dir的不同，同时完成正向和逆向， 妙若豪颠
            for (; index >= 0 && index < length; index += dir) {
                currentKey = keys ? obj[keys[index]] : obj[index]; ////拿到下一位的key
                memo = itetatee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        };

        return function(obj, itetatee, memo, context) {
            itetatee = optimizeCb(iteratee, context);

            var keys = !isArrayLike(obj) && _.keys(obj);
            var length = (keys || obj).length;
            var index = dir > 0 ? 0 : length - 1; ////dir > 0 正向， < 0 逆向

            ////没传初始值， 默认为第一个
            if (arguments.length < 3) {
                memo = obj[keys ? keys[index] : index];
                index += dir; ////无论是正向还是反向都到下一位
            }
            return iterator(obj, itetatee, memo, keys, index, length);
        }
    }

    function createPredicateIndexFinder(dir) {
        return function(arr, itetatee, context) {
            itetatee = cb(itetatee, context);
            var length = getLength(arr);
            var index = dir > 0 ? 0 : (length - 1);
            for (; index < length && index >= 0; index += dir) {
                var key = arr[index];
                if (_.isUndefined(key)) continue;
                if (itetatee(key, index, arr)) return index;
            }
            return -1;
        }
    }

    _.reduce = createReduce(1);
    _.reduceRight = createReduce(-1);

    _.extend = createAssigner(_.allKeys);
    _.assign = _.extendOwn = createAssigner(_.Keys);
    _.defaults = createAssigner(_.allKeys, true);

    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    _.findKey = function(obj, itetatee, context) {
        itetatee = cb(itetatee, context);
        var keys = _.keys(obj);
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (itetatee(obj[key], key, obj)) {
                return key;
            }
        }
        return -1;
    }

    _.find = _.detect = function(obj, itetatee, context) {
        var index = -1;
        var funcStr = isArrayLike(obj) ? 'findIndex' : 'findKey';
        index = _[funcStr](obj, itetatee, context);
        if (index != void 0 && index !== -1) return obj[i];
    }

    _.filter = function(arr, itetatee, context) {
        itetatee = cb(itetatee, context);
        var results = [];
        var length = getLength(arr);
        _.each(arr, function(item, index, list) {
            if (itetatee(item, index, list)) results.push(item);
        });
        return results;
    }

    _.negate = function(itetatee) {
        return function() {
            return !itetatee.apply(this, arguments);
        }
    }

    _.reject = function(arr, itetatee, context) {
        return _.filter(arr, _.negate(itetatee), context);
    }

    var isEveryOrSome = function(dicideBy) {
        dicideBy = dicideBy || false;
        return function(obj, itetatee, context) {
            itetatee = cb(itetatee, context);
            var keys = !isArrayLike(obj) && _.keys(obj);
            var length = (keys || obj).length;
            for (var i = 0; i < length; i++) {
                var key = keys ? keys[i] : i;
                var result = itetatee(key, i, obj);
                result = dicideBy ? !result : result;
                if (result) return dicideBy;
            }
            return !dicideBy;
        }
    }
    _.every = _.all = isEveryOrSome(false);
    _.some = _.any = isEveryOrSome(true);

    /***判断obj是否匹配attr本身的所有属性**/
    _.isMatch = function(obj, attr) {
        var keys = _.keys(attr);
        var length = attr.length
        if (obj == null) {
            return !length;
        }
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (obj[key] !== attr[key] || !obj[key]) {
                return false;
            }
        }
        return true;
    }

    _.matcher = _.matches = function(attr) {
        attr = _.extendOwn({}, attr);
        return function(obj) {
            return _.isMatch(obj, attr);
        }
    }

    _.contains = _.includes = function(obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj); ////是对象就查找所有的值
        if (typeof fromIndex !== 'number' && guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;

    }

    _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        });
    }

    ////牛逼
    _.pluck = function(arr, key) {
        return _.map(arr, _.property(key));
    }

    ////牛逼
    _.where = function(arr, attrs) {
            return _.filter(arr, _.matcher(attrs));
        }
        ////牛逼
    _.findWhere = function(arr, attrs) {
        _.find(arr, _.matcher(attrs));
    }

    function buildMaxAndMin(dir) {
        dir = dir > 0 ? true : false;
        return function(obj, iteratee, context) {
            var result = -Infinity,
                lastComputed = -Infinity,
                value, computed, direct;
            if (iteratee == null && obj != null) {
                ////没有指定方法，直接返回数组大小，或对象值得大小
                obj = isArrayLike(obj) ? obj : _.values(obj);
                for (var i = 0, length = obj.length; i < length; i++) {
                    direct = obj[i] > result;
                    direct = dir ? direct : !direct;
                    if (direct) {
                        result = obj[i];
                    }
                }
            } else {
                iteratee = cb(iteratee, context);
                _.each(function(item, i, arr) {
                    ////指定了方法，则比较依次执行指定方法后的值，返回最大的哪条数据
                    computed = iteratee(item, i, arr);
                    direct = computed > lastComputed;
                    direct = dir ? direct : !direct;
                    if (direct) {
                        lastComputed = computed;
                        result = item;
                    }
                });
            }
            return result;
        }
    }
    _.max = buildMaxAndMin(1);
    _.min = buildMaxAndMin(-1);

    ////使用二分查找法确定value在list中的位置
    _.sortedIndex = function(arr, obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var value = iteratee(obj);
        var low = 0,
            high = getLength(arr);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            iteratee(mid) > value ? high = mid : low = mid + 1;
        }
        return low;
    }

    ////写的什么玩意
    function createIndexFinder(dir, predicateFind) {
        return function(arr, item, idx) {
            var i = 0,
                length = getLength(arr);
            if (_.isNumber(idx)) {
                if (dir > 0) {
                    ////idx小于0，则加上length，如果还小于0，则取0
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.max(idx + 1, length) : idx + length + 1;
                }
            }
            ////处理NaN
            if (item !== item) {
                idx = predicateFind(slice.call(arr), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }

            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item) return idx;
            }
            return -1;
        }
    }

    _.indexOf = createIndexFinder(1, _.findIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    _.range = function(start, stop, step) {
        if (stop == null) {
            stop = start || 0;
            start = 0;
        }
        step = step || 1;
        var range = [];
        ////不能处理负数
        // for(; start < stop; start += step){
        // 	range.push(start);
        // }
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        for (var i = 0; i < length; i++, start += step) {
            range[i] = start;
        }
        return range;
    }

    function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
        if (!callingContext instanceof boundFunc) return sourceFunc.apply(context, args);
        var _self = nativeCreate(sourceFunc.prototype);
        return sourceFunc.apply(_self, args);
    }

    _.bind = function(func, context) {
        var args = [].slice.call(arguments, 2);
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, context, args);

        var bound = function() {

            return executeBound(func, bound, context, this, args.concat([].slice.call(arguments)));
        }
    }

    _.partial = function(func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function() {
            var position = 0,
                length = boundArgs.length;
            var args = [];
            for (var i = 0; i < length; i++) {
                //这个arguments是bound传入的参数， 处理有_的情况
                args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
            }
            //处理没有_的情况
            while (position < arguments.length) args.push(arguments[position++]);
            return executeBound(func, bound, this, this, args);
        }
    }

    _.memoize = function(func, hasher) {
        var memoize = function(key) {
            var cache = memoize.cache;
            ////如果有hasher就以hasher的返回结果作为func返回值的key， 没有hasher则传入一key
            var address = hasher ? hasher.apply(this, arguments) : key;
            if (!cache[address]) {
                cache[address] = func.apply(this, arguments);
            }
            return cache[address];
        }
        memoize.cache = {};
        return memoize;
    }

    _.delay = function(func, delay) {
        var args = slice.call(arguments, 2);
        return setTimeout(function() {
            func.apply(null, args);
        }, delay);
    }

    //延迟调用function直到当前调用栈清空为
    _.defer = _.partial(_.delay, _, 1);

    _.now = function() {
        return new Date().getTime();
    }

    _.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (options == null) options = {};
        var later = function() {
            previous = option.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        }
        return function() {
            var now = _.now();
            if (!previous && option.leading === false) previous = now;
            var remind = wait - (now - previous);
            args = arguments;
            if (remind <= 0 || remind > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(this, args);

            }
        }
    }

    _.wrap = function(func, wrap) {
        return _.partial(wrap, func);
    }

    //函数组合
    _.compose = function() {
        var args = arguments;
        var start = args.length - 1;
        return function() {
            var i = start;
            result = args[i].apply(this, arguments);
            while (i--) {
                result = args[i].apply(this, arguments);
            }
            return result;
        }
    }

    _.after = function(time, func) {
        return function() {
            if (--time < 1) {
                func.apply(this, arguments)
            }
        }

    }

    _.before = function(times, func) {
        var memo;
        return function() {
            if (--time > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) {
                func = null;
            }
            return memo;
        }
    }

    _.once = _.partial(_.before, 2);

    _.mapObject = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj);
        var length = keys.length;
        for (var index = 0; index < length; index++) {
            iteratee(obj[keys[index]], keys[index], obj);
        }
    };

    _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var result = [];
        for (var i = 0; i < length; i++) {
            var currentKey = keys[i];
            result[i] = [currentKey, obj[currentKey]];
        }
        return result;
    }

    _.invert = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var result = {};
        for (var i = 0; i < length; i++) {
            var currentKey = keys[i];
            result[obj[currentKey]] = currentKey;
        }
        return result;
    }

    _.functions = _.methods = function(obj) {
        //??搞什么
        var keys = _.keys(obj);
        var names = [];
        for (var i = 0; i < keys.length; i++) {
            if (_.isFunction(obj[keys[i]])) {
                names.push(keys[i]);
            }
        }
        return names.sort();
    }

    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, strict, startIndex) {
        var output = [],
            idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                //flatten current level of array or arguments object
                if (!shallow) value = flatten(value, shallow, strict);
                var j = 0,
                    len = value.length;
                output.length += len;
                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };

    _.pick = function(obj, oiteratee) {
        var result = {},
            keys;
        if (_.isFunction(oiteratee)) {
            keys = _.allKeys(obj);
            context = slice.call(arguments, 2, 3);
            oiteratee = optimizeCb(iteratee, context);
        } else {
            keys = slice.call(arguments, 1);
            oiteratee = function(value, key, object) {
                return key in object;
            }

        }
        for (var i = 0; i < keys.length; i++) {
            var currentKey = keys[i];
            var currentValue = obj[currentKey];
            if (oiteratee(currentValue, currentKey, obj)) result[currentKey] = currentValue;
        }
        return result;
    };

    _.omit = function(obj, iteratee, context) {

        if (_.isFunction(iteratee)) {
            iteratee = _.negate(iteratee);
        } else {
            keys = slice.call(arguments, 1);
            iteratee = function(value, key, keys) {
                return !_.contains(keys, key);
            };
        }

        return _.pick(obj, iteratee, context);
    }

    _.default = createAssigner(_.allKeys, true);

    var baseCreate = function(prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };
    _.create = function(prototype, props) {

        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
    }

    _.clone = function(obj) {

        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    }

    var eq = function(a, b, aStack, bStack) {
        if (a === b) return a !== 0 || 1 / a === 1 / b; //todo：厉害，判断+0和-0
        if (a == null || b == null) return a === b; //unll === undefined

        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return '' + a === '' + b;
            case '[object Number]':
                if (+a !== +a) return +b !== +b; //todo：完美，谁想出来的
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }
        var areArray = className === '[object Array]';
        if (!areArray) {
            if (typeof a != 'object' || typeof b != 'object') return false;
            var aCtor = a.constructor,
                bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                    _.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }

        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            //{} == {} //false，只能递归判断基本类型
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);
        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = _.keys(a),
                key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (_.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    }

    _.isEqual = function(a, b) {
        return eq(a, b);
    }

    _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
    }

    _.random = function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + MAth.floor(Math.random() * (max - min + 1));
    }

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    var createEscaper = function(map) {

        var source = '(?:' + _.keys(map).join('|') + ' )';
        var testReg = new RegExp(source);
        var replaceReg = new RegExp(source, 'g');
        return function(str) {
            return testReg.test(str) ? str.replace(replaceReg, function(match) {
                return map[match];
            }) : str;
        }
    }

    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/,
        interpolate: /<%=([\s\S]+?)%>/,
        escape: /<%-([\s\S]+?)%>/
    };

    //绝对不匹配
    var noMatch = /(.)^/;
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function(match) {
        return '\\' + escapes[match];
    }
    _.trim = function(str) {
        return str && str.replace(/\s+/g, '');
    }
    _.template = function(text, settings, oldSettings) {

            if (!settings && oldSettings) settings = oldSettings;
            //可以通过setting改变模板读取方式
            settings = _.defaults({}, settings, _.templateSettings);
            // 构造最终的正则
            var matcher = /<%(?=[^=-])([\s\S]+?)%>|<%=([\s\S]+?)%>|<%-([\s\S]+?)%>|$/g;
            return function(obj) {
                return text.replace(matcher, function(match, evaluate, interpolate, escape) {
                    var result = '';
                    if (_.trim(escape)) {
                        //result = _.escape(obj[escape]);
                        result = 'escape:' + obj[_.trim(escape)];
                    } else if (_.trim(interpolate)) {
                        result = obj[_.trim(interpolate)];
                    } else if (_.trim(evaluate)) {
                        result = obj[_.trim(interpolate)];
                    }
                    return result;
                });
            }
        }
        //////类型判断
    _.each(['Function', 'Arguments', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array', 'Boolean'], function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        }
    });

    ////判断ie9下， 没有arguments， 所以要改写isArguments方法
    if (!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
            return _.has(obj, 'collee');
        }
    }

    _.isNaN = function(obj) {
        return _.isNumber(obj) && obj !== obj;
    }

    _.isNull = function(obj) {
        return obj === null;
    }

    _.isUndefined = function(obj) {
        return obj === void 0;
    }
    _.identity = function(value) {
        return value;
    }
    window._ = _;
})();
