var CArray = function(numElements) {
    // [...Array(100)]  Array.from(Array(100))
    this.dataStore = Object.keys(Array.apply([], Array(numElements)));
    this.dataStoreHash = {};
    this.pos = 0;
    this.numElements = numElements;
    this.insert = insert;
    this.toString = toString;
    this.clear = clear;
    this.setData = setData;
    this.swap = swap;

}
CArray.prototpe = {
    setData() {
        for (var i = 0; i < this.numElements; ++i) {
            this.dataStore[i] = Math.floor(Math.random() * (this.numElements + 1));
        }
    },

    clear() {
        for (var i = 0; i < this.dataStore.length; ++i) {
            this.dataStore[i] = 0;
        }
    },
    insert(element) {
        this.dataStore[this.pos++] = element;
    },
    toString() {
        var restr = "";
        for (var i = 0; i < this.dataStore.length; ++i) {
            retstr += this.dataStore[i] + " ";
            if (i > 0 & i % 10 == 0) {
                retstr += "\n";
            }
        }
        return retstr;
    },
    swap(arr, index1, index2) {
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    },
    /**
     * 冒泡排序
     * @return {[type]} [description]
     */
    bubbleSort() {
        for (var j = this.dataStore.length; j > 1; j--) {
            //每一轮把最大的数送往右边
            for (var i = 0; i < j; i++) {
                if (this.dataStore[i] > this.dataStore[i + 1]) {
                    this.wrap(this.dataStore, i, i + 1);
                }
            }
        }
    }
    /**
     * 选择排序
     * 第一轮：外层循坏为0， 内层循坏从0->length-1找到最小值，与外层循坏的位置0交互
     * 第二轮：外层循坏为1， 内层循坏从1->length-1找到最小值，与外层循坏的位置1交互
     * ...
     * @return {[type]} [description]
     */
    selectionSort() {
        var min;
        for (var outer = 0; outer < this.dataStore.length - 2; outer++) {
            min = outer;
            //每一轮都会把最小值放到指定最外层指定位置
            for (var inter = outer; inter < this.dataStore.length - 1; inter++) {
                if (this.dataStore[inner] < min) {
                    min = inner;
                }
                this.wrap(this.dataStore, outer, min);
            }
        }
    }

    /**
     * 插入排序：外循环将数组元素挨个移动，
     * 而内循环则对外循环选中的元素与它前面的那个元素进行比较，
     * 如果外循环选中的元素比内循环中选中的元素小，
     * 那么数组元素就向右整体移动，为内循环中的这个元素腾出位置
     * [4,5,3,8,1,2]
     * 插入排序就是抢位置
     */
    insertionSort() {
        var temp, inter;
        //由于要与前面的元素作比较，所以从1开始
        for (var outer = 1; outer < this.dataStore.length - 1; outer++) {
            //你就是那个被选中的元素
            temp = this.dataStore[outer];
            //内层循环和外层息息相关，但又不能在内层直接修改outer，所以赋一个inner
            inter = outer;
            //与前面的元素比较, 比前面的元素小，则前面的元素后移
            while (inner > 0 && this.dataStore[inner - 1] > temp) {
                this.dataStore[inner] = this.dataStore[inner - 1];
                inner--;
            }
            //比较完了，被选中的元素得到它自己的位置就是inner
            this.dataStore[inner] = temp;
        }
    }
}

/**
 * 希尔排序
 * 插入排序的一种，利用设置间隔来快速排序
 * @return {[type]} [description]
 */
shellsort() {
    //设置间隔， 这里间隔设置为3的倍数
    var h = 1;
    while (h < this.dataStore.length / 3) {
        h = 3 * h + 1;
    }

    while (h >= 1) {
        //插入排序的逻辑
        for (var i = h; i < this.dataStore.length; i++) {
            for (var j = i; j >= h && this.dataStore[j] < this.dataStore[j - h]; j -= h) {
                this.swap(this.dataStore, j, j - h);
            }
        }
        //一轮完毕，将间隔调小，直到为1，排序完成
        h = (h - 1) / 3;
    }
}

/**
 * 快速排序 首先在列表中选择一个元素作为基准值
 * 数据排序围绕基准值进行，将列表中小于基准值的元素
 * 移到数组的底部，将大于基准值的元素移到数组的顶部。
 *
 * @return {[type]} [description]
 */
    qSort(list){
        //递归终止条件
        if(list.length === 0){
            return [];
        }
        var left = [];
        var right = [];
        //这是基准元素
        var point = list[0];
        var i = 1;
        //把大于基准元素的放入right
        //小于基准元素的放入left
        while(i < list.length){
            if(list[i] > point){
                right.push(list[i]);
            }else{
                left.push(list[i]);
            }
            i++;
        }
        //递归相加
        return qSort(left).concat(point, qSort(right));
    }
};

var sort = new CArray();
