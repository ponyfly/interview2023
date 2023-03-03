function sortArray(arr) {
	if (arr.length <= 1) return arr
	const mid = arr[arr.length - 1]
	const leftArr = []
	const rightArr = []
	for (let i = 0; i < arr.length - 1; i++) {
		const item = arr[i]
		if (item < mid) {
			leftArr.push(item)
		} else {
			rightArr.push(item)
		}
	}
	return [...sortArray(leftArr), mid, ...sortArray(rightArr)]
}

console.log(sortArray([3, 1, 5, 2, 6, 8, 0]))
