// 在一定时间段内重复触发事件，会重新开启定时器，只会执行一次
function deboundce (fn, delay = 300) {
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
