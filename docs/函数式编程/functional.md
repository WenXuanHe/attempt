1. 纯函数- 相同的输入得到相同的输出， 没有副作用
2. 冥等: 执行无数次还有相同的结果， 
3. 在restful中， post和put都是可以用来创建资源和更新资源，两者的区别是post不冥等， put冥等
4. 科里化  
5. 函数组合 
```
  const compose = (...args) => (x) => args.reduce((a, b) => b(a), x)
```
6. point free- 把一些对象自带的方法转化为纯函数，biubiu命名无意义的变量
7. 惰性函数 - 部分逻辑在第一次完成，后续不需要再重复执行
8. 高阶函数 - 把函数当参数传递，把这个传入函数进行封装，达到更高程度的封装再返回
9. 尾调用优化 - 递归会导致创建很多栈， 尾调用优化避免爆栈
```
# 不会产生新栈，直接走掉了
function test(n, total=0){
  if(n === 0) return total;
  total = total + n;
  n = n - 1;
  return test(n, total);
}
```