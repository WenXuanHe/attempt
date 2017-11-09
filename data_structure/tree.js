/**
 * 二叉树的实现以及遍历
 * @param {[type]} data [description]
 * @param {[type]} root [description]
 */
var Tree = function (data, root) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.root = root;
}

var Node = function (data) {
    Tree.call(this, data);
    this.root = this;
    this.list = [];
}

// 新增元素
Node.prototype.add = function(data){
    if(data > this.data){
        if(this.right){
            this.root.add.call(this.right, data);
        }else{
            this.right = new Tree(data, this.root);
        }
    }else {
        if(this.left){
            this.root.add.call(this.left, data);
        }else{
            this.left = new Tree(data, this.root);
        }
    }
}

/**
 * 先序遍历
 * @param  {[type]} callBack [description]
 * @return {[type]}          [description]
 */
Node.prototype.eachForfirst = function(callBack){

    console.log(this.data);
    if(callBack){
        callBack.call(this);
    }else{
        callBack = function(){};
    }

    if(this.left){
        // 为了方便从底层往父层查找，添加一层链表
        this.left.parent = this;
        this.root.eachForfirst.call(this.left, callBack);
    }

    if(this.right){
        this.right.parent = this;
         this.root.eachForfirst.call(this.right, callBack);
    }
}

/**
 * 后序遍历
 * @return {[type]} [description]
 */
Node.prototype.eachForLast = function () {
     if(this.right){
         this.root.eachForfirst.call(this.right);
    }
    console.log(this.data);
   if(this.left){
        this.root.eachForfirst.call(this.left);
    }
}

/**
 * 广度优先遍历
 * @return {[type]} [description]
 */
Node.prototype.eachForfloor = function () {

    console.log(this.data);
    this.left && this.root.list.push(this.left);
    this.right && this.root.list.push(this.right);
    let current = this.root.list.shift();
     current && this.root.eachForfloor.call(current);
}

/**
 * 通过先序遍历，找出所有的最下层的元素，即没有left和right的元素
 * @return {[type]} [description]
 */
Node.prototype.findEnds = function(){
    var arr = [];
    this.eachForfirst(function(){
        if(!this.left && !this.right){
            arr.push(this);
        }
    });

    return arr;
}

/**
 * 从最下层元素查找一直到最顶层
 * @param  {[type]} nodes [description]
 * @return {[type]}       [description]
 */
Node.prototype.getEveryParentData = function(nodes){

    return nodes.map(function(node){
        var res = [node.data];
        while(node.parent){
            node = node.parent;
            res.unshift(node.data);
        }

        return res;
    });
}

var root = new Node(7);
root.add(4);
root.add(2);
root.add(5);
root.add(9);
root.add(8);
root.add(13);
root.add(25);

var nodes = root.findEnds();
var result = root.getEveryParentData(nodes);
console.log(result);
