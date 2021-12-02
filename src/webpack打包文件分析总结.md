打包文件分析：
1. 打包后是个IIFE
2. 参数是modules,modules是我们所有的依赖模块
3. 执行IIFE的时候，首先是定义了一些函数，最后调用`__webpack_require__`函数，
```
__webpack_require__(0)
```
0表示执行第一个模块，`__webpack_require__`做了几个事情
  + 定义了module，在module上定义了exports属性，定义了l属性表示模块是否加载完毕
  + 执行模块
  + module.l = true表示模块已加载完毕
  + 最后return module.exports

稍微复杂的栗子：
1. modules是多个，在执行modules[0]的过程中，遇到其他module，继续调用`__webpack_require__`去加载其他模块
```
var _log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1)
```
然后继续调用
```
_log__WEBPACK_IMPORTED_MODULE_0__["default"])('hello world')
```
2. 在加载`__webpack_require__(1)`的时候，又继续去执行第二个模块，第二个模块中有这样一段代码
```
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function () { return log; });
      function log(str) {
        console.log(str);
      }
```
`__webpack_require__.d`其实是在module上定义了一个default方法，执行该方法会返回log函数，因此，在hello模块中，
就能通过__webpack_require__(1)获取log模块的exports。通过__webpack_require__(1)["default"])()就能调用log方法

## 动态模块

动态模块加载核心原理是通过script插入js
1. 从入口文件分析来看，我们打包后的文件只有一个module
```
[/* 0 */
       (function (module, exports, __webpack_require__) {
		 function hello() {
		 __webpack_require__.e(/* import() */ 1).then(__webpack_require__.bind(null, 1)).then(res => console.log(res))
		 }
		 hello()
	 })
]
```
通过`__webpack_require__.e`判断模块是否加载过，如果没有加载过，则通过script加载，script加载完成后触发load事件，然后执行resolve，
s加载完成后，调用了 window["webpackJsonp"]的push方法，push方法中做了三件事情：
+ 将模块标记为已加载
+ 将模块数据放到window["webpackJsonp"] 数组中
+ 调用之前的promise的resolve方法

