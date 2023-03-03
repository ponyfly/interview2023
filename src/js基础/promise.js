// realize promise All
Promise.MyAll = function (promises) {
	return new Promise((resolve, reject) => {
		// todo: res and l should in callback inner
		const res = []
		let l = 0
		for (let i = 0; i < promises.length; i++) {
			const p = promises[i]
			// todo: p maybe a normal value
			Promise.resolve(p).then((r) => {
				res[i] = r
				l++
				if (l === promises.length) {
					resolve(res)
				}
			}, (e) => {
				reject(e)
			})
		}
	})
}
