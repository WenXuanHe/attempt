(function(global, factory) {
    //模块化方式加载AMD
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(global)
        })
    } else {
        factory(global)
    }
})(this, function(window) {

        var Zepto = (function() {
                var undefined, key, $, classList, emptyArray = [],
                    concat = emptyArray.concat,
                    filter = emptyArray.filter,
                    slice = emptyArray.slice,
                    document = window.document,
                    elementDisplay = {},
                    classCache = {},
                    cssNumber = {
                        'column-count': 1,
                        'columns': 1,
                        'font-weight': 1,
                        'line-height': 1,
                        'opaticy': 1,
                        'z-index': 1,
                        'zoom': 1
                    },
                    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
                    // 匹配单个tag标签$('<div>')或者$('<div></div>')
                    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                    // 匹配除这些标签之外的area|br|col|embed|hr|img|input|link|meta|param
                    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
                    //匹配body或者html
                    rootNodeRE = /^(?:body|html)$/i,
                    //  匹配A-Z
                    capitalRE = /([A-Z])/g,
                    // 基础方法属性
                    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
                    // 相邻操作
                    adjacencyOperators = ['after', 'prepend', 'before', 'append'],
                    table = document.createElement('table'),
                    tableRow = document.createElement('tr'),
                    containers = {
                        'tr': document.createElement('tbody'),
                        'tbody': table,
                        'thead': table,
                        'tfoot': table,
                        'td': tableRow,
                        'th': tableRow,
                        '*': document.createElement('div')
                    },
                    readyRE = /complete|loaded|interactive/,
                    simpleSelectorRE = /^[\w-]*$/,
                    class2type = {},
                    //object 的tostring方法
                    toString = class2type.toString,
                    zepto = {},
                    camelize, uniq,
                    tempParent = document.createElement('div'),
                    // 把一些属性转化为react props
                    propMap = {
                        'tabindex': 'tabIndex',
                        'readonly': 'readOnly',
                        'for': 'htmlFor',
                        'class': 'className',
                        'maxlength': 'maxLength',
                        'cellspacing': 'cellSpacing',
                        'cellpadding': 'cellPadding',
                        'rowspan': 'rowSpan',
                        'colspan': 'colSpan',
                        'usemap': 'useMap',
                        'frameborder': 'frameBorder',
                        'contenteditable': 'contentEditable'
                    },
                    zepto.matches = function(element, selector) {
                        if (!selector || !element || element.nodeType !== 1) return false;
                        //matches 方法可以匹配元素的属性，是Dom2 新增的方法
                        var matchesSelector = element.matches || element.webkitMatchesSelector ||
                            element.mozMatchesSelector || element.oMatchesSelector ||
                            element.matchesSelector;
                        // 返回匹配结果
                        if (matchesSelector) return matchesSelector.call(element, selector);
                        var match, parent = element.parentNode,
                            temp = !parent;
                        if (temp) {
                            //如果element的父元素不存在
                            (parent = tempParent).appendChild(element);
                        }
                        //调用qsa方式查找元素 是否包含的方式来模拟matches方法， ~n = -(n+1)
                        match = ~zepto.qsa(parent, selector).indexOf(element)
                        temp && tempParent.removeChild(element)
                        return match
                    }

                /**
                 * 实现querySelectorAll方法相似的功能
                 * @param  {[type]} element  [description]
                 * @param  {[type]} selector [description]
                 * @return {[type]}          [description]
                 */
                zepto.qsa = function(element, selector) {
                    var found,
                        maybeId = selector[0] === '#',
                        maybeClass = !maybeId && selector[0] === '.',
                        nameOnly = (maybeId || maybeClass) ? selector.slice(1) : selector,
                        isSimple = simpleSelectorRE.test(nameOnly);
                    /**
                     * 1.getElementById存在且是"#xxx"格式，用getElementById存在且是查询
                     * 2. isSimple && !maybeId &&  element.getElementsByClassName 为true
                     * 判断maybeClass存在与否   用getElementsByClassName和getElementsByTagName
                     * 3.  2为false ， 用querySelectorAll
                     */
                    return (element.getElementById && maybeId && isSimple) ?
                        ((found = element.getElementById(nameOnly)) ? [found] : []) :
                        (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
                        slice.call(
                            isSimple && !maybeId && element.getElementsByClassName ?
                            maybeClass ? element.getElementsByClassName(selector) : element.getElementsByTagName(selector) :
                            element.querySelectorAll(selector)
                        )
                }

                /**
                 * jquery式判断类型的方式
                 * @param  {[type]}  name [description]
                 * @return {Boolean}      [description]
                 */
                zepto.isType = function(name) {
                    return function(value) {
                        return toString(value) === "[object " + name + "]";
                    }
                }

                function type(obj) {
                    return obj == null ? String(obj) :
                        class2type[toString.call(obj)] || "object"
                }

                // class2type填充
                $.each('Object Array String Number RegExp Boolean Error Date Function'.split(' '), function(i, name) {
                    // zepto判断类型方式
                    class2type["[object " + name + "]"] = name.toLowerCase();
                    // jquery判断类型方式
                    zepto['is' + name] = zepto.isType(name);
                });

                zepto.isWindow = function(obj) {
                    return obj !== null && obj === obj.window;
                }
                zepto.isDocument = function(obj) {
                        return obj !== null && obj.nodeType === obj.DOCUMENT_NODE;
                    }
                    //是否扁平化对象
                zepto.isPlainObject = function(obj) {
                    return zepto.isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) = Object.prototype;
                }

                /**
                 * 类似数组
                 * @param  {[type]} obj [description]
                 * @return {[type]}
                 * obj不是函数不是window，length === 0 或者length大于0且下标是数字
                 * 才能认定为；类似数组
                 */
                function likeArray(obj) {
                    var length = !!obj && 'length' in obj && obj.length;
                    return !zepto.isFunction(obj) && !zepto.isWindow(obj) && (
                        zepto.isArray(obj) || length === 0 || (zepto.isNumber(length) && length > 0 && (length - 1) in obj)
                    )
                }

                // 过滤数组为null的元素
                function compact(array) {
                    return filter.call(array, function(item) {
                        return item != null
                    })
                }
                // 扁平化数组
                function flatten(array) {
                    return array.length > 0 ? $.fn.concat.apply([], array) : array
                }

                // 把传入的对象的属性全部挂在在Z的实例上
                function Z(dom, selector) {
                    var i, len = dom ? dom.length : 0;
                    for (var i = 0; i < len; i++) {
                        this[i] = dom[i];
                    }
                    this.length = len;
                    this.selector = selector;
                }

                function isZ = function(obj) {
                    return obj instanceof zepto.Z;
                }

                zepto.Z = function(dom, selector) {
                    return new Z(dom, selector);
                }

                zepto.init = function(selector, context) {
                    var dom;
                    //没有选择器，返回一个空Z对象
                    if (!selector) zepto.Z()
                        // 选择器是string
                    else if (zepto.isString(selector)) {
                        selector = selector.trim()
                            // fragmentRE = /^\s*<(\w+|!)[^>]*>/,
                            // 不是css选择器，是包含元素的html字符串
                        if (selector[0] == '<' && fragmentRE.test(selector)) {
                            //从正则表达式中提取元素类型
                            dom = zepto.fragment(selector, RegExp.$1, context), selector = null
                        } else if (context !== undefined) {
                            // 存在上下文，可以从上下文中筛选
                            return $(context).find(selector);
                        } else {
                            // 是css选择器
                            dom = zepto.qsa(document, selector);
                        }
                    }
                    //选择器是function
                    else if (zepto.isFunction(selector)) {
                        return $(document).ready(context);
                    }
                    // 本来就是zepto选择器的情况
                    else if (isZ(selector)) return selector;
                    else {
                        if (zepto.isArray(selector)) {
                            // 去掉数组无效元素
                            dom = compact(selector);
                        } else if (zepto.isObject(selector)) {
                            // 包裹对象
                            dom = [selector], selector = null
                        }
                    }

                    return zepto.Z(dom, selector);
                }

                $ = function(selector, context) {
                    return zepto.init(selector, context)
                }

                zepto.fragment = function(html, name, properties) {
                    var dom, nodes, container
                        // 如果满足是单个div的情况，可以直接得到dom元素
                    if (singleTagRE.test(html)) dom = document.createElement(RegExp.$1);
                    if (!dom) {
                        //"<div name=''/>".replace(regex, "<$1></$2>")   => "<div name=''></div>"
                        //把自闭合标签替换成一个完整的元素闭环
                        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
                        // 如果没有传name值，重新生成
                        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
                        if (!(name in containers)) name = "*"
                            // 这儿已经创建了新元素了，默认div
                        container = containers[name]
                            // 把html填充进container元素内
                        container.innerHTML = "" + html
                            // 取容器的子节点  $.each 返回第一个参数，把容器下的东西全部删除，因为容器要反复使用
                        dom = $.each(slice.call(container.childNodes), function() {
                            container.removeChild(this)
                        });

                    }

                    if (isPlainObject(properties)) {
                        nodes = $(dom)
                            // 增加properties上的属性到dom元素上
                        $.each(properties, function(key, value) {
                            if (methodAttributes.indexOf(key) > -1) nodes[key](value)
                            else nodes.attr(key, value)
                        })
                    }

                    return dom
                }

                function extend(target, source, deep) {
                    for (key in source) {
                        //深复制且 source[key]是数组或者对象
                        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                                target[key] = {}
                            if (isArray(source[key]) && !isArray(target[key]))
                                target[key] = []
                                // 源和目标类型设为一致，递归调用
                            extend(target[key], source[key], deep)
                        } else if (source[key] !== undefined) {
                            target[key] = source[key]
                        }
                    }
                }

                $.extend = function(target) {
                    var deep, args = slice.call(arguments, 1)
                        // 第一个参数如果是boolean类型，target设置为第二个参数
                    if (typeof target == 'boolean') {
                        deep = target
                        target = args.shift()
                    }
                    // 调用extend方法处理
                    args.forEach(function(arg) {
                        extend(target, arg, deep)
                    })
                    return target
                }

                function filtered(nodes, selector) {
                    return selector == null ? $(nodes) : $(nodes).filter(selector)
                }

                $.contains = document.documentElement.contains ?
                    // 支持contains方法，直接使用contains
                    function(parent, node) {
                        return parent !== node && parent.contains(node)
                    } :
                    // 链表的方式循环查找，查到返回true， 没查到返回false
                    function(parent, node) {
                        while (node && (node = node.parentNode))
                            if (node === parent) return true
                        return false
                    }

                function funcArg(context, arg, idx, payload) {
                    // 传递this和参数
                    return isFunction(arg) ? arg.call(context, idx, payload) : arg
                }

                function setAttribute(node, name, value) {
                    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
                }

                $.isEmptyObject = function() {
                    var name;
                    for (name in obj) return false;

                    return true;
                }
                $.inArray = function(elem, array, i) {
                    return emptyArray.indexOf.call(array, elem, i)
                }
                $.trim = function(str) {
                    return str == null ? "" : String.prototype.trim.call(str)
                }
                $.uuid = 0
                $.support = {}
                $.expr = {}
                $.noop = function() {}

                $.map = function(elements, callback) {
                    var value, values = [],
                        i, key
                    if (likeArray(elements))
                        for (i = 0; i < elements.length; i++) {
                            value = callback(elements[i], i)
                            if (value != null) values.push(value)
                        }
                    else
                        for (key in elements) {
                            value = callback(elements[key], key)
                            if (value != null) values.push(value)
                        }
                    return flatten(values)
                }
                $.each = function(elements, callback) {
                    var i, key
                    if (likeArray(elements)) {
                        for (i = 0; i < elements.length; i++)
                            if (callback.call(elements[i], i, elements[i]) === false) return elements
                    } else {
                        for (key in elements)
                            if (callback.call(elements[key], key, elements[key]) === false) return elements
                    }

                    return elements
                }

                $.grep = function(elements, callback) {
                    return filter.call(elements, callback)
                }

                if (window.JSON) $.parseJSON = JSON.parse


                $.fn = {
                        constructor: zepto.Z,
                        length: 0,
                        forEach: emptyArray.forEach,
                        reduce: emptyArray.reduce,
                        push: emptyArray.push,
                        sort: emptyArray.sort,
                        splice: emptyArray.splice,
                        indexOf: emptyArray.indexOf,
                        concat: function() {
                            var i, value, args = []
                            for (i = 0; i < arguments.length; i++) {
                                value = arguments[i]
                                args[i] = zepto.isZ(value) ? value.toArray() : value
                            }
                            return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
                        },
                        map: function(fn) {
                            return $($.map(this, function(el, i) {
                                return fn.call(el, i, el)
                            }))
                        },
                        slice: function() {
                            return $(slice.apply(this, arguments))
                        },

                        ready: function(callback) {
                            // need to check if document.body exists for IE as that browser reports
                            // document ready when it hasn't yet created the body element
                            if (readyRE.test(document.readyState) && document.body) callback($)
                            else document.addEventListener('DOMContentLoaded', function() {
                                callback($)
                            }, false)
                            return this
                        },
                        get: function(idx) {
                            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
                        },
                        toArray: function() {
                            return this.get()
                        },
                        size: function() {
                            return this.length
                        },
                        remove: function() {
                            return this.each(function() {
                                if (this.parentNode != null)
                                    this.parentNode.removeChild(this)
                            })
                        },
                        each: function(callback) {
                            emptyArray.every.call(this, function(el, idx) {
                                return callback.call(el, idx, el) !== false
                            })
                            return this
                        },
                        filter: function(selector) {
                            if (isFunction(selector)) return this.not(this.not(selector))
                            return $(filter.call(this, function(element) {
                                return zepto.matches(element, selector)
                            }))
                        },

                        not: function(selector) {
                            var nodes = []
                            if (isFunction(selector) && selector.call !== undefined)
                                this.each(function(idx) {
                                    if (!selector.call(this, idx)) nodes.push(this)
                                })
                            else {
                                var excludes = typeof selector == 'string' ? this.filter(selector) :
                                    (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                                this.forEach(function(el) {
                                    if (excludes.indexOf(el) < 0) nodes.push(el)
                                })
                            }
                            return $(nodes)
                        },
                    },

                    has: function(selector) {
                        return this.filter(function() {
                            return isObject(selector) ?
                                $.contains(this, selector) :
                                $(this).find(selector).size()
                        })
                    },

                    eq: function(idx) {
                        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
                    },
                };

                function traverseNode(node, fun) {
                  fun(node)
                  for (var i = 0, len = node.childNodes.length; i < len; i++)
                    traverseNode(node.childNodes[i], fun)
                }

                // ['after', 'prepend', 'before', 'append']
                adjacencyOperators.forEach(function(operator, operatorIndex){
                    var inside = operatorIndex % 2; // -> true : 'prepend', 'apppend'; false -> 'after', 'before'
                    $.fn[operator] = function () {
                        // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
                        var argType, nodes = $.map(arguments, function (arg) {
                            var arr = [],
                            argType = type(arg)
                            if(argType === "array"){
                                arg.forEach(function (el) {
                                    // 元素加到arr中
                                    if(el.nodeType !== undefined) arr.push(el)
                                    else if($.zepto.isZ(el))  arr = arr.concat(el.get())
                                    else arr = arr.concat(zepto.fragment(el))
                                });
                                return arr;
                            }

                            return argType === 'object' || arg === null ? arg :  zepto.fragment(arg)
                        }),
                        parent, copyByClone = this.length > 1

                        if(nodes.length < 1) return this

                        return this.each(function (_, target) {
                            //inside 为true时，是增加在target的内部，parent为target
                            parent = inside ? target : target.parentNode

                            // 全部使用insertBefore模拟
                            target = inside === 0 ? target.nextSibling :
                            inside === 1 ? target.firstChild :
                            inside === 2 ? target : null;
                            // 判断parent是否存在于document之中
                            var parentInDocument = $.contains(document.documentElement, parent);

                            nodes.forEach(function (node) {
                                // insertBefore时复制的是引用，为了避免出现闭包问题，深复制node节点
                                if(copyByClone) node = node.cloneNode(true)
                                else if (!parent) return $(node).remove()

                                parent.insertBefore(node, target)

                                if(parentInDocument) {
                                    traverseNode(node, function (el) {
                                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                                              (!el.type || el.type === 'text/javascript') && !el.src) {
                                            // script 动态编译执行
                                            var target = el.ownerDocument ? el.ownerDocument.defaultView : window
                                            target['eval'].call(target, el.innerHTML)
                                          }
                                    })
                                }
                            })
                        })
                    }

                    $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function(html) {
                      $(html)[operator](this)
                      return this
                }
                });

                // 缓存元素的默认display的值
                function defaultDisplay(nodeName) {
                    var element, display;
                    if( !elementDisplay){
                        // 创建节点得到display的值，再删除节点
                        var el = document.createElement(nodeName);
                        document.body.appendChild(el);
                        display = getComputedStyle(element, '').getPropertyValue('display');
                        el.parentNode.removeChild(el);
                        display == "none" && (display = "block");
                        return elementDisplay[nodeName] = display;
                    }

                    return elementDisplay[nodeName]
                }

                function className(node, value) {
                    var klass = node.className || '',
                  // 通过baseVal判断是否是SVG
                  svg = klass && klass.baseVal !== undefined

                if (value === undefined) return svg ? klass.baseVal : klass
                svg ? (klass.baseVal = value) : (node.className = value)
            }
        });
