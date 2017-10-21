// [B3,A1,C2,A2,C3,A3,B1,C1,B2]=>[A1,B1,C1,A2,B2,C2,A3,B3,C3]

var sortBy = function(arr = ["B3","A1","C2","A2","C3","A3","B1","C1","B2"]){
    var sort = [].sort;
    var sortByFirstFun = (first, second) => first.slice(0, 1) > second.slice(0, 1);
    var sortByLastFun = (first, second) => first.slice(first.length - 1) > second.slice(second.length - 1);

    return sort.call(sort.call(arr, sortByFirstFun), sortByLastFun);
}