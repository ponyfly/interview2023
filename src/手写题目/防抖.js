// 在一定时间段内重复触发事件，会重新开启定时器，只会执行一次
// 用户在输入框连续输入一串字符时,可以通过防抖策略,只在输入完后
function debounce (fn, delay = 300) {
	let timer
	return function () {
		let args = arguments
		let context = this
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(context, args)
			timer = null
		}, delay)
	}
}
