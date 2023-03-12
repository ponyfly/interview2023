// 在一定时间段内重复触发事件，只会执行一次，定时器结束后，执行句柄
// 可以减少一段时间内事件的触发频率. 懒加载时要监听计算滚动条的位置,但不必要每次滑动都触发
function throttle(fn, delay = 300) {
	let timer
	return function () {
		const args = arguments
		if (timer) return false
		timer = setTimeout(() => {
			fn.apply(this, args)
			clearTimeout(timer)
			timer = null
		}, delay)
	}
}

function throttle2(fn, delay = 300) {
	let flag = true
	return function () {
		const args = arguments
		if (!flag) return false
		flag = false
		setTimeout(() => {
			fn.apply(this, args)
			flag = true
		}, delay)
	}
}
