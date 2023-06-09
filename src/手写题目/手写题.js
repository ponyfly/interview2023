// 手写call apply bind
Function.prototype.myCall = function (context, ...args) {
  if (context === null || context === undefined) {
    context = window
  }
  const fn = Symbol()
  context[fn] = this
  return context[fn](...args)
}
Function.prototype.myApply = function (context, args) {
  if (context === null || context === undefined) {
    context = window
  }
  const fn = Symbol()
  context[fn] = this
  return context[fn](...args)
}
Function.prototype.myBind = function (context, ...args) {
  if (context === null || context === undefined) {
    context = window
  }
  const fn = Symbol()
  context[fn] = this
  const _this = this

  const result = function (...restArgs) {
    if (this instanceof _this) {
      this[fn] = _this
      this[fn](...[...args, ...restArgs])
    } else {
      context[fn](...[...args, ...restArgs])
    }
  }
  result.prototype = Object.create(this.prototype)
  return result
}
// 实现promise all race
Promise.myAll = function (args) {
  let count = 0
  let result = []
  return new Promise((resolve, reject) => {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      Promise.resolve(arg).then((res) => {
        result[i] = res
        count++
        if (count === args.length) {
          resolve(result)
        }
      })
        .catch(err => {
          reject(err)
        })
    }
  })
}
Promise.myRace = function (args) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      Promise.resolve(arg).then((res) => {
        resolve(res)
      })
        .catch(err => {
          reject(err)
        })
    }
  })
}
// 手写-实现一个寄生组合继承
function Parent (name) {
  this.name = name
  this.say = () => {
    console.log(111)
  }
}
Parent.prototype.play = function () {
  console.log(222)
}
function Child (name) {
  Parent.call(this)
  this.name = name
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
// 手写-new 操作符
function myNew (fn, ...args) {
  let target = Object.create(fn.prototype) // 通过Object.create创建一个基于原型的实例
  let result = fn.call(target, ...args) // 如果fn有返回值result，则最终返回的实例是result,否则返回target
  if (result && (typeof result === 'object' || typeof result === 'function')) {
    return result
  } else {
    return target
  }
}
// 手写-setTimeout 模拟实现 setInterval（阿里）
function myInterval(fn, delay = 1000) {
  let timer
  let isClear = false
  function interval () {
    if (isClear) {
      clearTimeout(timer)
      timer = null
      isClear = false
      return
    }
    fn()
    timer = setTimeout(interval, delay)
  }
  timer = setTimeout(interval, delay)
  return () => {
    isClear = true
  }
}
// 发布订阅模式
class EventEmitter {
  constructor() {
    this.events = {}
  }
  on (type, handler) {
    if (this.events[type]) {
      this.events[type].push(handler)
    } else {
      this.events[type] = [handler]
    }
  }
  off (type, handler) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(fn => fn !== handler)
    }
  }
  once (type, handler) {
    const self = this
    function fn () {
      handler()
      self.off(type, fn)
    }
    this.on(type, fn)
  }
  emit (type, ...restArgs) {
    if (this.events[type]) {
      this.events[type].forEach(fn => {
        fn.apply(this, restArgs)
      })
    }
  }
}
// 手写-防抖节流（京东）
function debounce (fn, delay = 300) {
  let timer
  return function () {
    const args = arguments
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}
function throttle (fn, delay = 300) {
  let flag = true
  return function () {
    const args = arguments
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(this, args)
      flag = true
    }, delay)
  }
}
// 手写-将虚拟 Dom 转化为真实 Dom（类似的递归题-必考）
function _render (vnode) {
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }
  const dom = document.createElement(vnode.tag)
  if (vnode.attrs) {
    const keys = Object.keys(vnode.attrs)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = vnode.attrs[key]
      dom.setAttribute(key, value)
    }
  }
  vnode.children.forEach(child => dom.appendChild(_render(child)))
  return dom
}
// todo 手写-实现一个对象的 flatten 方法（阿里）
function isObject (obj) {
  return typeof obj === 'object' && obj !== null
}
function flatten (obj) {
  let res = {}

  function dfs (cur, prefix) {
    if (isObject(cur)) {
      if (Array.isArray(cur)) {
        cur.forEach((val, i) => {
          dfs(val, `${prefix}[${i}]`)
        })
      } else {
        for (const key of cur) {
          dfs(cur[key], `${prefix}${prefix ? '.' : ''}${key}`)
        }
      }
    } else {
      res[prefix] = cur
    }
  }
  dfs(obj, '')

  return res
}
//手写-判断括号字符串是否有效（小米）
function isValid (s) {
  if (s.length % 2 === 1) {
    return false;
  }
  const arr = []
  const map = {
    '{': '}',
    '(': ')',
    '[': ']',
  }
  for (let i = 0; i < s.length; i++) {
    if (['(', '[', '{'].includes(s[i])) {
      arr.push(s[i])
    } else {
      const cur = arr.pop()
      if (s[i] !== map[cur]) {
        return false
      }
    }
  }
  if (arr.length) return false
  return true
}
// 手写-查找数组公共前缀（美团）
function longestCommonPrefix (strs) {
  const [ first, ...restStrs ] = strs
  let res = ''
  let index = 0
  while (index < first.length) {
    const curS = first[index]
    for (let i = 0; i < restStrs.length; i++) {
      const restCurS = restStrs[i][index];
      if (restCurS !== curS) {
        return res
      }
    }
    res += curS
    index++
  }

  return res
}
console.log(longestCommonPrefix(["dog","racecar","car"]))
// 手写-字符串最长的不重复子串
function lengthOfLongestSubstring (s) {
  if (s.length === 0) {
    return 0;
  }
  let slow = 0
  let fast = 0
  let len = s.length
  let max = 0
  while (fast < len) {
    let i = s.substring(slow, fast).indexOf(s[fast])
    if (i !== -1) {
      slow = slow + i + 1
    } else {
      max = Math.max(max, fast - slow + 1)
    }
    fast++
  }
  return max
}
// 手写-如何找到数组中第一个没出现的最小正整数 怎么优化（字节）
function firstMissingPositive (nums) {
  let len = nums.length
  let res = 1
  let i = 0
  while (res <= len) {
    if (nums.indexOf(res) > -1) {
      i++
      res++
    } else {
      return res
    }
  }
  return res
}
function firstMissingPositive1 (nums) {
  let len = nums.length
  let res = 1
  let i = 0
  let set = new Set(nums)
  while (res <= len) {
    if (set.has(res)) {
      i++
      res++
    } else {
      return res
    }
  }
  return res
}
console.log(firstMissingPositive1([1,2,0]))
// 手写-怎么在制定数据源里面生成一个长度为 n 的不重复随机数组 能有几种方法 时间复杂度多少（字节）
function getTenNum (testArray, n) {
  const cloneArr = [...testArray];
  let res = []
  let i = 0
  while (i < n) {
    const random = Math.floor(cloneArr.length * Math.random())
    res.push(cloneArr.splice(random, 1)[0])
    i++
  }

  return res
}
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const resArr = getTenNum(testArray, 14);
console.log(resArr)
// 写 Vue.extend 实现
// import { mergeOptions } from ''
Vue.extend = function (extendOptions) {
  let Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(this.prototype)
  Sub.prototype.constructor = Sub
  Sub.options = mergeOptions(this.options, extendOptions)
  return Sub
}
// vue-router 中路由方法 pushState 和 replaceState 能否触发 popSate 事件
// 答案是：不能   popstate 事件会在点击后退、前进按钮(或调用 history.back()、history.forward()、history.go()方法)时触发
// common.js 和 es6 中模块引入的区别
// 1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
// 2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口（静态编译）。
// 3、CommonJs 是单个值导出，ES6 Module 可以导出多个
// 4、CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
// 5、CommonJs 的 this 是当前模块，ES6 Module 的 this 是 undefined

// babel 是什么，原理了解吗
// parse 解析  转换为AST 生产为新代码

// 原型链判断
Object.prototype.__proto__; // null
Function.prototype.__proto__; // Object.prototype
Object.__proto__; // Function.prototype
Object instanceof Function;  // true
Function instanceof Object; // true
Function.prototype === Function.__proto__; // true

//13 RAF 和 RIC 是什么
// requestAnimationFrame： 告诉浏览器在下次重绘之前执行传入的回调函数(通常是操纵 dom，更新动画的函数)；由于是每帧执行一次，那结果就是每秒的执行次数与浏览器屏幕刷新次数一样，通常是每秒 60 次。
// requestIdleCallback：: 会在浏览器空闲时间执行回调，也就是允许开发人员在主事件循环中执行低优先级任务，而不影响一些延迟关键事件。如果有多个回调，会按照先进先出原则执行，但是当传入了 timeout，为了避免超时，有可能会打乱这个顺序
function flatter (arr) {
  if (!arr.length) return arr
  let res = []
  while(arr.some(item => Array.isArray(item))) {
    res = [].concat(...arr)
  }
  return res
}
// 实现有并行限制的 Promise 调度器
class Scheduler {
  constructor(limit) {
    this.maxCount = []
    this.runCount = 0
    this.queues = []
  }
  add (time, order) {
    const fn = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order)
          resolve(order)
        }, time)
      })
    }

    this.queues.push(fn)
  }
  taskStart () {
    for (let i = 0; i < this.maxCount; i++) {
      this.request()
    }
  }
  request () {
    if (this.queues.length === 0 || this.runCount > this.maxCount) return
    this.runCount++
    this.queues.shift()().then(() => {
      this.runCount--
      this.request()
    })
  }
}

const scheduler = new Scheduler(2)
const addTask = (time, order) => {
  scheduler.add(time, order)
}
// new 操作符
function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const res = fn.apply(obj, args)
  if (res && typeof res === 'object') {
    return res
  } else {
    return obj
  }
}
// todo 深拷贝（考虑到复制 Symbol 类型）
function deepClone (obj, hash = new WeakMap()) {
  if (!isObject(obj)) return obj
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  let target = Array.isArray(obj) ? [] : {}
  hash.set(obj, target)
  Reflect.ownKeys(obj).forEach(item => {
    if (isObject(obj[item])) {
      target[item] = deepClone(obj[item], hash)
    } else {
      target[item] = obj[item]
    }
  })
  return target
}
// todo 实现myInstanceof
function myInstanceof(obj, target) {
  while (true) {
    if (obj === null) return false
    if (obj.__proto__ === target.prototype) return true
    obj = obj.__proto__
  }
}
// todo 柯里化
function currying(fn, ...args) {
  let length = fn.length
  let allArgs = [...args]
  let res = function (...innerArgs) {
    allArgs = [...allArgs, ...innerArgs]
    if (allArgs.length === length) {
      return fn.apply(this, allArgs)
    } else {
      return res
    }
  }
  return res
}
// 用法如下：
// const add = (a, b, c) => a + b + c;
// const a = currying(add, 1);
// console.log(a(2,3))
// todo 冒泡排序
function bubbleSort (arr) {
  const len = arr.length
  for (let i = 0; i < len; i++) {
    // j和j+1比较， 所以j< len -1
    for (let j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
function quickSort (arr) {
  if (arr.length < 2) return arr
  let cur = arr[arr.length - 1]
  let leftArr = []
  let rightArr = []
  for (let i = 0; i < arr.length - 1; i++) {
    const arrElement = arr[i];
    if (arrElement <= cur) {
      leftArr.push(arrElement)
    } else {
      rightArr.push(arrElement)
    }
  }
  return [...quickSort(leftArr), cur, ...quickSort(rightArr)]
}
// todo 二分查找--时间复杂度 log2(n) 如何确定一个数在一个有序数组中的位置

function search (arr, target) {
  let start = 0
  let end = arr.length - 1
  while (start <= end) {
    let middle = Math.floor(start + (end - start) / 2)
    if (arr[middle] === target) {
      return middle
    } else if (arr[middle] > target) {
      end = middle - 1
    } else if (arr[middle] < target) {
      start = middle + 1
    }
  }
  return -1
}
//todo  实现 LazyMan
class LazyMan {
  constructor(name) {
    const task = () => {
      console.log(`Hi! This is ${name}`);
      this.next();
    };
    this.tasks = []
    this.tasks.push(task)
    setTimeout(() => {
      this.next()
    }, 0)
  }
  next () {
    const task = this.tasks.shift()
    task && task()
  }
  sleep (time) {
    this._sleepWrapper(time, false)
    return this
  }
  sleepFirst (time) {
    this._sleepWrapper(time, true)
    return this
  }
  _sleepWrapper (time, first) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`)
        this.next()
      }, time * 1000)
    }
    if (first) {
      this.tasks.unshift(task)
    } else {
      this.tasks.push(task)
    }
  }
  eat (name) {
    const task = () => {
      console.log(`Eat ${name}`)
      this.next()
    }
    this.tasks.push(task)
    return this
  }
}
// todo 写版本号排序的方法
function sortVersion (arr) {
  arr.sort((a, b) => {
    let i = 0
    let arrA = a.split('.')
    let arrB = b.split('.')
    while (true) {
      let s1 = arrA[i]
      let s2 = arrB[i]
      i++
      if (s1 === undefined || s2 === undefined) {
        return arrB.length - arrA.length
      }
      if (s1 === s2) continue
      return s2 - s1
    }
  })
}
// LRUCache
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize
    this.map = new Map()
  }
  get (key) {
    if (this.map.has(key)) {
      const temp = this.map.get(key)
      this.map.delete(key)
      this.map.add(key, temp)
      return temp
    }
    return -1
  }
  put (key, value) {
    if (this.map.has(key)) {
      this.map.delete(key)
      this.map.add(key, value)
    }
    if (this.map.size < this.maxSize) {
      this.map.add(key, value)
    }
    this.map.delete(this.map.keys().next().value)
    this.map.add(key, value)
  }
}
// add
function add (...args) {
  let allArgs = [...args]
  function res(...innerArgs) {
    if (innerArgs.length) {
      allArgs = [...allArgs, ...innerArgs]
      return res
    } else {
      return allArgs.reduce((pre, cur) => pre + cur)
    }
  }
  return res
}
// todo 动态规划求解硬币找零问题
function coinChange (coins, amount) {
  const f = []
  f[0] = 0
  for (let i = 1; i <= amount; i++) {
    f[i] = Infinity
    for (let j = 0; j < coins.length; j++) {
      const coin = coins[j];
      if (i - coin >= 0) {
        f[i] = Math.min(f[i], f[i - coin] + 1)
      }
    }
  }
  if (f[amount] === Infinity) return -1
  return f[amount]
}
// todo 请实现 DOM2JSON 一个函数，可以把一个 DOM 节点输出 JSON 的格式
function dom2Json (dom) {
  const res = {}
  res.tag = dom.tagName
  res.children = []
  dom.childNodes.forEach((child) => res.children.push(dom2Json(child)));
  return res
}
// 类数组转化为数组的方法
// const arrayLike = new Set()
// [...arrayLike]
// Array.from(arrayLike)
// Array.prototype.slice.call(arrayLike)

// todo Object.is 实现
Object.myIs = function (x, y) {
  if (x === y) {
    return !x  || 1 / x !== 1 / y
  }
  return x !== x && y !== y
}

// todo 利用 XMLHttpRequest 手写 AJAX 实现
function getJSON (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.send();
  })
}
// todo 分片思想解决大数据量渲染问题
function render () {
  let ul = document.getElementById("container");
// 插入十万条数据
  let total = 100000;
// 一次插入 20 条
  let once = 20;
//总页数
  let page = total / once;
//每条记录的索引
  let index = 0;
//循环加载数据
  function loop(curTotal, curIndex) {
    if (curTotal <= 0) {
      return false;
    }
    //每页多少条
    let pageCount = Math.min(curTotal, once);
    window.requestAnimationFrame(function () {
      for (let i = 0; i < pageCount; i++) {
        let li = document.createElement("li");
        li.innerText = curIndex + i + " : " + ~~(Math.random() * total);
        ul.appendChild(li);
      }
      loop(curTotal - pageCount, curIndex + pageCount);
    });
  }
  loop(total, index);

}
// 实现模板字符串解析功能
function render(template, data) {
  let computed = template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
    return data[key];
  });
  return computed;
}
// todo 列表转成树形结构
function listToTree(data) {
  let temp = {}
  let treeData = []

  for (let i = 0; i < data.length; i++) {
    temp[data[i].id] = data[i]
  }

  for (const key of temp) {
    if (+temp[key].parentId === 0) {
     treeData.push(temp[key])
    } else {
      if (!temp[temp[key].parentId].children) {
        temp[temp[key].parentId].children = []
      }
      temp[temp[key].parentId].children.push(temp[key])
    }
  }

  return treeData
}
// todo 树形结构转成列表
function treeToList (data) {
  let res = []

  function dfs (tree) {
    tree.forEach(item => {
      if (item.children) {
        dfs(item.children)
        delete item.children
      }
      res.push(item)
    })
  }

  dfs(data)

  return res
}
