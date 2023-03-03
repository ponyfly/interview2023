function myInstanceOf (obj, target) {
	if (typeof obj !== "object" || obj === null) return false
	if (typeof target !== 'function') {
		console.log('must be function')
		return false
	}
	let proto = obj.__proto__
	while (proto) {
		if (proto === target.prototype) return true
		proto = proto.__proto__
	}
}
