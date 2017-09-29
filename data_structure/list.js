/**
 * 列表
 */
function List() {
    this.pos = 0;
    this.dataStore = []; // 初始化一个空数组来保存列表元素
}

List.prototype = {
    clear: function(){
        this.dataStore.length = 0;
        this.pos = 0;
    },

    find: function(elem){

        var pos = -1;
        for(var i = 0; i < this.dataStore.length; i++){
            if(this.dataStore[i] === elem){
                pos = i;
                return;
            }
        }

        return pos;
    },

    toString: function(){
        return this.dataStore;
    },

    insert: function(elem, after){
        var pos = this.find(after);
        if(pos > -1){
            this.dataStore.splice(pos, 0, elem);
            return true;
        }

        return false;
    },

    length: function(){
        return this.dataStore.length;
    },

    append: function(elem){
        this.dataStore.push(elem);
    },

    remove: function(elem){
        var pos = this.find(elem);
        if(pos < 0) throw new Error(elem + "is not existed in list");

        this.dataStore.splice(pos, 1);
        return true;
    },
    front: function(){
        this.pos = 0;
    },
    end: function(){
        this.pos = this.length() - 1;
    },
    prev: function(){
        if(this.pos > 0){
            this.pos--;
        }
    },
    next: function(){
        if(this.pos < this.length() - 2){
            this.pos++;
        }
    },
    currPos: function(){
        return this.pos;
    },
    moveTo: function(pos){
        this.pos = pos;
    },
    getElement: function(){
        return this.dataStore[this.pos];
    },
    contains: function(elem){
        var pos = this.find('elem');
        return pos < 0 ? false: true;
    },

    appendMax: function(elem){
        if(typeof elem === 'number'){
            var max = Math.max.apply(null, this.dataStore);
            if(elem > max){
                this.append(elem);
            }
        }else if(elem === 'string'){
            var code = elem[0].toLowerCase().charCodeAt();
            var flag = true;
            for(var i = 0; i < this.dataStore.length; i++){
                if(code < this.dataStore[i][0].toLowerCase().charCodeAt()){
                    flag = false;
                    return;
                }
            }
            if(flag){
                this.append(elem);
            }
        }
    },



};
