## Flex 语法篇
* Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。 *

* 任何一个容器都可以指定为Flex布局。 *

```

.box{
    display: flex;
}

```

* 行内元素也可以使用Flex布局。 *
```

.box{
    display: inline-flex;
}

```
        
* Webkit内核的浏览器，必须加上-webkit前缀。*
```

.box{
    display: -webkit-flex;
    display: flex;
}

```

* 容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。*
* 项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。*
```
/*容器的属性*/
/*flex-direction*/ /* 属性决定主轴的方向*/
    .box {
        flex-direction: row | row-reverse | column | column-reverse;
    }
/*flex-wrap*/ /* lex-wrap属性定义，如果一条轴线排不下，如何换行*/
.box{
    /*（默认）：不换行。*/
    /*wrap：换行，第一行在上方。*/
    /*wrap-reverse：换行，第一行在下方。*/
    flex-wrap: nowrap | wrap | wrap-reverse; nowrap;
}
/*flex-flow*/
    /*flex-flow属性是flex-direction属性和flex-wrap属性的简写形式 默认值为row nowrap*/
/*justify-content*//*justify-content属性定义了项目在主轴上的对齐方式。*/
.box {
    justify-content: flex-start | flex-end | center | space-between | space-around;
    /*flex-start（默认值）：左对齐*/
    /*flex-end：右对齐*/
    /*center： 居中*/
    /*space-between：两端对齐，项目之间的间隔都相等。*/
    /*space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。*/
}
/*align-items*//*align-items属性定义项目在交叉轴上如何对齐。*/
.box {
    align-items: flex-start | flex-end | center | baseline | stretch;
    /*flex-start：交叉轴的起点对齐。*/
    /*flex-end：交叉轴的终点对齐。*/
    /*center：交叉轴的中点对齐。*/
    /*baseline: 项目的第一行文字的基线对齐。*/
    /*stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。*/
}
/*align-content*//*align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。*/
/*该属性可能取6个值。*/
/*flex-start：与交叉轴的起点对齐。*/
/*flex-end：与交叉轴的终点对齐。*/
/*center：与交叉轴的中点对齐。*/
/*space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。*/
/*space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。*/
/*stretch（默认值）：轴线占满整个交叉轴。*/
```
        