var Model = {
    inherited: function () { },
    created: function () { },

    prototype: {
        init: function () { }
    },
    create: function () {
        var object = Object.create(this);
        object.parent = this;
        object.prototype = object.fn = Object.create(this.prototype);
        object.created();
        this.inherited(object);
        return object;
    },
    init: function () {
        var instance = Object.create(this.prototype);
        instance.parent = this;
        instance.init.apply(this, arguments);
        return instance;
    },

    extend: function (o) {
        var extended = o.extended;
        jQuery.extend(this, o);
        if (extended) extended(this);
    },
    include: function (o) {
        var included = o.included;
        jQuery.extend(this.prototype, o);
        if (included) included(this);
    }
};

Model.records = {};
Model.include({
    newRecord: true,
    create: function () {
        if (!this.id) this.id = Math.guid();
        this.newRecord = false;
        this.parent.records[this.id] = this.dup();
    },
    destroy: function () {
        delete this.parent.records[this.id];
    },
    update: function () {
        this.parent.records[this.id] = this.dup();
    },
    save: function () {
        this.newRecord ? this.create() : this.update();
    },
    dup: function () {
        return jQuery.extend(true, {}, this);
    }
});

Model.extend({
    // 通过ID 查找，找不到则抛出异常
    find: function (id) {
        if (!this.records[id]) throw ("Unknown record")
        return this.records[id].dup();
    },
    created: function () {
        this.records = {};
    },
    populate: function (values) {
        // 重置model 和records
        this.records = {};
        for (var i = 0, il = values.length; i < il; i++) {
            var record = this.init(values[i]);
            record.newRecord = false;
            this.records[record.id] = record;
        }
    }
});

