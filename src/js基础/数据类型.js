Function.prototype.myCall = function (target, ...args) {
	target = target || window
	const symbol = Symbol()
	let res
	target[symbol] = this
	res = target[symbol](...args)
	delete target[symbol]
	return res
}

Function.prototype.myApply = function (target, args) {
	target = target || window
	const symbol = Symbol()
	let res
	target[symbol] = this
	res = target[symbol](...args)
	delete target[symbol]
	return res
}

Function.prototype.myBind = function (target, ...args) {
	target = target || window
	const fn = this
	// 返回函数
	let res = function () {
		const o = this instanceof res ? this : target
		return fn.apply(o, [...args, ...arguments])
	}
	return res
}
