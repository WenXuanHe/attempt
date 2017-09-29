/**
 * 随机输出数组的元素
 * @param {[type]} max [description]
 */
var RandomAll = function(max) {
    this.dataStore = Object.keys(Array.apply([], Array(max)));
    this.max = max;
}

RandomAll.prototype.randomAllArrData = function() {
    for (var i = 0; i < this.max; i++) {
        this.random();
    }
}
RandomAll.prototype.random = function() {
    var pos = this.getRandomNum(this.dataStore.length);
    console.log(this.dataStore[pos]);
    this.dataStore.splice(pos, 1);

}
RandomAll.prototype.getRandomNum = function(max) {
    return Math.floor(Math.random() * max);

}
