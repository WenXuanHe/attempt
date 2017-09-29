var exports = this;
$(function () {

    exports.ToggleView = Controller.create({
        //选择器到局部变量名的映射
        elements: {
            "input[type=search]": "searchInput",
            "form": "searchForm"
        },
        //代理事件
        events: {
            "submit form": "search"
        },
        init: function (element) {
            this.el = $(element);
            this.refreshElements();
            this.delegateEvents();
            // this.view.mouseover(this.proxy(this.toggleClass), true);
            // this.view.mouseout(this.proxy(this.toggleClass), false);
        },
        toggleClass: function (e) {
            this.el.toggleClass("over", e.data);
        },
        $: function (selecter) {
            return $(selecter, this.el);
        },
        refreshElements: function () {
            Object.keys(this.elements).forEach(function (elem) {
                this[this.elements[elem]] = this.$(elem);
            });
        },
        delegateEvents: function () {
            var eventSplitter = /^(\w+)\s*(.*)$/;
            Object.keys(this.events).forEach(function (methodName) {
                var method = this.proxy(this.events[methodName], this);
                var match = methodName.match(eventSplitter);
                var eventName = match[1], selector = match[2];
                if (selector === '') {
                    this.el.bind(eventName, method);
                } else {
                    this.el.delegate(selector, eventName, method);
                }
            });
        }
    });

    new ToggleView("#view");
});