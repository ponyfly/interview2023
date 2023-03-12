class Observer {
	constructor(value) {
		this.walk(value)
	}
	walk (data) {
		let keys = Object.keys(data)
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			defineReactive(data, key, data[key])
		}
	}
}

function defineReactive(data, key, value) {
	observer(value)
	Object.defineProperty(data, key, {
		get() {
			// 收集依赖
			return value
		},
		set (newVal) {
			if (newVal === value) return
			// 触发更新
			value = newVal
		}
	})
}

export default function observer (val) {
	if (Object.prototype.toString.call(val) === "[object Object]") {
		return new Observer(val)
	}
}
