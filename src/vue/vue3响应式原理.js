let activeEffect

function effect(fn) {
	activeEffect = fn
	fn()
}

let data = {
	name: 'zzc'
}
let bucket = new WeakMap()

let obj = new Proxy(data, {
	get(target, key) {
		if (!activeEffect) return target[key]
		let depsMap = bucket.get(target)
		if (!depsMap) {
			bucket.set(target, (depsMap = new Map()))
		}
		let deps = depsMap.get(key)
		if (!deps) {
			depsMap.set(key, (deps = new Set()))
		}
		deps.add(activeEffect)
		return target[key]
	},
	set (target, key, newVal) {
		target[key] = newVal
		const depsMap = bucket.get(target)
		if(!depsMap) return
		const deps = depsMap.get(key)
		deps && deps.forEach(fn => fn())
		return true
	}
})

effect(() => {
	console.log(obj.name)
})
setTimeout(() => {
	obj.age = 20
}, 1000)
