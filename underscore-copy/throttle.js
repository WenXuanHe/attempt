// 函数防抖：任务频繁触发的情况下，只有任务触发的时间间隔超过指定间隔时，任务才会执行
// 函数节流：指定时间间隔内只会执行一次任务

/**
节流函数有一个阀门，每次触发都会关闭这个阀门， 只有执行函数才会短暂开启这个阀门
即，在设置的时间段内只能有一个任务执行
*/
function throttle(func, delay){
	//初始状态默认阀门开关开启
	var canRun = true;

	return function(){
		//设置阀门
		if(!canRun) return;
		//阻断后来者
		canRun = false;
		setTimeout(()=>{
			func.apply(this, arguments);
			//执行完毕，开放阀门
			canRun = true;

		}, delay)
	}
}

// 防抖
function debounce (func, delay){
	var timeout = null;

	return function(){
		//每次都清理前一个定时器，只执行最后一个
		clearTimeout(timeout);
		timeout = setTimeout(()=>{
			func.apply(this, arguments);
		}, delay);
	}

}


