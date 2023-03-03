function myNew (cons, ...args) {
	if (typeof cons !== 'function') {
		throw TypeError('not a function')
	}
	let res = {}
	// ToDo： 要加原型
	res.__protp__ = cons.prototype
	let obj = cons.apply(res, args)

	return typeof obj === 'object' ? obj : res
}
