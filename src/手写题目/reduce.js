Array.prototype.myReduce = function (fn) {
	let arr = this
	let prev = arr[0]
	for (let i = 1; i < arr.length; i++) {
		prev = fn(prev, arr[i], i, arr)
	}
	return prev
}

Array.prototype.myReduceInit = function (fn, initialValue) {
	let arr = this
	let prev = initialValue || arr[0]
	let startIndex = initialValue ? 0 : 1
	for (let i = startIndex; i < arr.length; i++) {
		prev = fn(prev, arr[i], i, arr)
	}
	return prev
}
