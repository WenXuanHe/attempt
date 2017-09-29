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

Node.prototype.eachForfirst = function(){
    if(this.left){
        this.root.eachForfirst.call(this.left);
    }
    console.log(this.data);
    if(this.right){
         this.root.eachForfirst.call(this.right);
    }

}
Node.prototype.eachForLast = function () {
     if(this.right){
         this.root.eachForfirst.call(this.right);
    }
    console.log(this.data);
   if(this.left){
        this.root.eachForfirst.call(this.left);
    }
}
Node.prototype.eachForfloor = function () {

    console.log(this.data);
    this.left && this.root.list.push(this.left);
    this.right && this.root.list.push(this.right);
    let current = this.root.list.shift();
     current && this.root.eachForfloor.call(current);
}
var root = new Node(10);
root.add(12);

root.add(15);
root.add(18);
root.add(2);
root.add(5);
root.add(6);
root.add(25);
root.eachForfloor();
