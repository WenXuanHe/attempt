### grid布局：
 <p> 这是一个新的布局方式, 能轻松帮助我们解决各种奇怪的布局， 和flex布局结合使用潜力无穷</p>

 ```
	.grid{
	
		display:grid;
		grid-template-rows: 1fr 2fr 1fr; //定义三列
		grid-template-columns: 1fr 2fr 1fr; //定义三行
		grid-gap:20px 30px;  //行与列之间的间隙。

		grid-template-areas: //定义范围
			"header header header"
			"leftSide content aside"
			"leftSide footer footer";


	}

	.gird .item{
		grid-area:header;//即可
	}
 ```
