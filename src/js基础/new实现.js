function myNew (fn, ...args) {
	const obj = Object.create(fn.prototype)
	const target = fn.apply(obj, args)
	if (typeof target === 'object' || typeof target === 'function') {
		return target
	} else {
		return obj
	}
}
