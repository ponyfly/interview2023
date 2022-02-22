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
      delete this[fn]
    } else {
      context[fn](...[...args, ...restArgs])
      delete context[fn]
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

