// 在一定时间段内重复触发事件，只会执行一次，定时器结束后，执行句柄

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
