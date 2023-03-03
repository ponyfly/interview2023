function flat(arr) {
	return arr.toString().split(',')
}

console.log(flat([1, [2, [3, 5]], 6]))

function flat2(arr) {
	const res = []
	for (let i = 0; i < arr.length; i++) {
		if (Array.isArray(arr[i])) {
			res.push(...flat2(arr[i]))
		} else {
			res.push(arr[i])
		}
	}
	return res
}
console.log(flat2([1, [2, [3, 5]], 6]))

function flat3(arr) {
	return arr.reduce((prev, next) => {
		return prev.concat(Array.isArray(next) ? flat2(next) : next)
	}, [])
}

const flatten = (arr) => {
	while(arr.some(item=>Array.isArray(item))){
		arr = [].concat(...arr);
	}
	return arr;
};

