// 题目描述:实现一个 compose 函数
// compose函数的作用就是组合函数，依次组合传入的函数：
// 后一个函数作为前一个函数的参数
// 最后一个函数可以接受多个参数，前面的函数只能接受单个参数；后一个的返回值传给前一个
// todo: 阅读即可
function compose (...fns) {
  if (!fns.length) return arg => arg
  if (fns.length === 1) return fns[0]
  return fns.reduce((pre, cur) => {
    return (...args) => {
      return pre(cur(...args))
    }
  })
}
// settimeout 模拟实现 setinterval(带清除定时器的版本)
function mySetinterval(fn, delay = 300) {
  let timer
  function interval() {
    timer = setTimeout(() => {
      fn()
      interval()
    }, delay)
  }
  interval()
  return () => {
    clearTimeout(timer)
    timer = null
  }
}
const interv = mySetinterval(function () {
  console.log(1)
}, 1000)
// setTimeout(() => {
//   interv()
// },10000)

// 3 发布订阅模式
class EventEmitter {
  constructor() {
    this.subs = {}
  }
  on (type, callback) {
    if (this.subs[type]) {
      this.subs[type].push[callback]
    } else {
      this.subs[type] = [callback]
    }
  }
  off (type, callback) {
    if (!this.subs[type]) return
    this.subs[type] = this.subs[type].filter(item => item !== callback)
  }
  once (type, callback) {
    function fn () {
      callback()
      this.off(type, fn)
    }
    this.on(type, fn)
  }
  emit (type, ...args) {
    if (!this.subs[type]) return
    this.subs[type].forEach(fn => fn.apply(this, args))
  }
}
//4 数组去重
function uniq(arr) {
  return Array.from(new Set(arr))
  // return [...new Set(arr)]
}
// 5 数组扁平化
function flatter(arr) {
  if (!arr.length) return
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}
// 6 寄生组合继承
class Parent {
  constructor(name) {
    this.name = name
  }
  getName () {
    return this.name
  }
}
class Child extends Parent {
  constructor(name) {
    super(name);
  }
}
const child = new Child('xiaoming')

// 实现有并行限制的 Promise 调度器
class Scheduler {
  constructor(maxCount) {
    this.maxCount = maxCount
    this.runCount = 0
    this.subs = []
  }
  addTask (time, order) {
    const fn = function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order)
          resolve()
        }, time)
      })
    }
    this.subs.push(fn)
  }
  runTask () {
    for (let i = 0; i < this.maxCount; i++) {
      this.run()
    }
  }
  run () {
    if (this.runCount > this.maxCount || !this.subs.length) return
    this.runCount++
    this.subs.shift()().then(() => {
      this.runCount--
      this.run()
    })
  }
}
// 8 new 操作符
function myNew (fn, ...args) {
  const obj = Object.create(fn.prototype)
  const target = fn.apply(obj, args)
  if (typeof target === 'object' || typeof target === 'function') {
    return target
  } else {
    return obj
  }
}
// 题目描述:手写 call apply bind 实现
Function.prototype.myBind = function (context, ...args) {
  const fn = Symbol()
  context[fn] = _this
  const _this = this

  function result (...innerArgs) {
    if (this instanceof _this === true) {
      this[fn] = _this
      this[fn](...[...args, ...innerArgs])
    } else {
      context[fn](...[...args, ...innerArgs])
    }
  }
  result.prototype = Object.create(this.prototype)
  result.prototype.constructor = result
  return result
}

// todo 深拷贝（考虑到复制 Symbol 类型）
function isObject(val) {
  return typeof val === "object" && val !== null;
}
function cloneDeep(obj, hash = new WeakMap()) {
  if (!isObject(obj)) return
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  let target = Array.isArray(obj) ? [] : {}
  hash.set(obj, target)
  Reflect.ownKeys(obj).forEach(key => {
    if (isObject(obj[key])) {
      target[key] = cloneDeep(obj[key], hash)
    } else {
      target[key] = obj[key]
    }
  })
}
// 题目描述:手写 instanceof 操作符实现
function myinstanceof (a, b) {
  while (true) {
    if (a.__proto__ === b.prototype) return true
    if (a.__proto__ === null) return false
    a = a.__proto__
  }
}
// 12 todo 柯里化
function currying (fn, ...args) {
  let allArgs = [...args]
  const len = fn.length
  return function fn (...innerArgs) {
    allArgs = [...allArgs, ...innerArgs]
    if (allArgs.length === len) {
      return fn(...allArgs)
    } else {
      return fn
    }
  }
}
// 13 todo 冒泡排序--时间复杂度 n^2
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
     if(arr[j + 1] < arr[j]) {
       [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
     }
    }
  }
  return arr
}
// 23 todo Promise 以及相关方法的实现
class MyPromise {
  constructor(fn) {
    this.status = 'pending'
    this.successCb = []
    this.failCb = []
    let resolve = (val) => {
      if (this.status !== 'pending') return
      this.status = "success"
      setTimeout(() => {
        this.successCb.forEach(item => item.call(this, val))
      })
    }
    let reject = (val) => {
      if (this.status !== 'pending') return
      this.status = "fail"
      setTimeout(() => {
        this.failCb.forEach(item => item.call(this, val))
      })
    }
    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then (resolveCb, rejectCb) {
    return new MyPromise((resolve, reject) => {
      this.successCb.push((val) => {
        let x = resolveCb(val);
        x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
      })
      this.failCb.push((val) => {
        let x = rejectCb(val);
        x instanceof MyPromise ? x.then(resolve, reject) : reject(x)
      })
    })
  }
  static all (fns) {
    let result = []
    let len = fns.length
    let count = 0
    return new Promise((resolve, reject) => {
      for (let i = 0; i < fns.length; i++) {
        const fn = fns[i];
        Promise.resolve(fn).then(res => {
          result[i] = res
          count++
          if (count === len) {
            resolve(result)
          }
        }, err => {
          reject(err)
        })
      }
    })
  }
  static race (fns) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < fns.length; i++) {
        const fn = fns[i];
        Promise.resolve(fn).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    })
  }
}
function coinChange (coins, amount) {
  const res = []
  res[0] = 0 // todo 注意
  for (let i = 1; i <= amount; i++) { // todo: 注意
    res[i] = Infinity
    for (let j = 0; j < coins.length; j++) {
      const coin = coins[j];
      if (coin <= i) { // todo: 注意
        res[i] = Math.min(res[i], res[i - coin] + 1)
      }
    }
  }
  if (res[amount] === Infinity) return -1
  return res[amount]
}
// todo
function firstMissingPositive (nums) {
  let set = new Set(nums)
  for (let i = 1; i <= set.size + 1; i++) {
    if (!set.has(i)) {
      return i
    }
  }
}
