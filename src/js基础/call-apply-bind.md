## 特点以及如何实现

1. 都可以改变this的指向

### 不同点
call参数需要依次传入 call(thisObj, arg1, arg2)
apply参数作为数组传入 call(thisObj, [ arg1, arg2 ])
bind返回一个函数

### 实现
#### call
```js
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

```
