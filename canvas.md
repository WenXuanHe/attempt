
canvas 设置宽和高，以属性的方式设置， 不要从css里面设置。

save() 和restore() 方法 用于保存及恢复当前canvas环境的所有属性
```
function drawGrid(strokeStyle, fillStyle){
controlContext.save();
controlContext.fillStyle=fillStyle;
controlContext.strokeStyle=strokeStyle;
controlContext.restore();
}
```
restore存在性能问题， 要引起注意才行
使用离屏canvas增加性能。

任务1，画一个蓝胖子， 然后使用离屏canvas增加性能
任务2，实现橡皮筋式选取框
