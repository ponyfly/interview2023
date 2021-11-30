## webpack打包文件分析

webpack打包后的文件是一个IIFE，核心有两个
+ 定义了一系列内置方法
+ 依赖的modules数组，模块之间通过`__webpack__require__`引用，我们写的模块会作为依赖传递给webpack定义的函数，第一个模块就是入口文件

```
function hello() {
  console.log('hello world')
}
hello()

```
首先定义了一系列方法，最后调用__webpack_require__
```
(function(modules) {
    var installedModules = {};  //  模块缓存
    function __webpack_require__(moduleId) {...}
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    // define getter function for harmony exports
    __webpack_require__.d = function(exports, name, getter) {...};
    // define __esModule on exports
    __webpack_require__.r = function(exports) {...};
    __webpack_require__.t = function(value, mode) {...};
    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function(module) {...};
    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    // __webpack_public_path__
    __webpack_require__.p = "";
    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = 0);
})
([
/* 0 */
(function(module, exports) {
    function hello() {
         console.log('hello world')
    }
    hello()
})]);

```
`__webpack_require__`代码如下所示
```
// 模块缓存
var installedModules = {};
function __webpack_require__(moduleId) {
  // 检查当前require的模块id是否在cache中存在，如果存在，则直接返回对应模块的exports
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  // 创建一个模块，
  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
  };
  // 执行模块方法
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  // 标记当前模块已经被加载过
  module.l = true;
  // 返回模块的exports
  return module.exports;
}

```
实际上就是定义了一个module，然后`__webpack_require__(0)`就是执行我们第一个模块，也就是hello模块
### 稍微负责一点的例子
+ 通过script标签加载动态模块，script onload之后执行resolve函数

```
// log.js
export default function log(str) {
  console.log(str);
}

// index.js
import log from './log';
function hello() {
  log('hello world')
}

hello()

```
使用webpack重新构建，得到的bundle如下：
```
(function (modules) { // webpackBootstrap
  // 省略了一堆代码
  return __webpack_require__(__webpack_require__.s = 0);
})
  ([
    /* 0 */
    (function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      function hello() {
        Object(_log__WEBPACK_IMPORTED_MODULE_0__["default"])('hello world')
      }
      hello()
    }),
    /* 1 */
    (function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function () { return log; });
      function log(str) {
        console.log(str);
      }
    })
  ]);

```
我们发现modules多了一个模块，正是我们的log模块，hello模块编译出来的代码也有了一些变化，通过__webpack_require__(1)加载下一个模块的exports，
并将其缓存到变量_log__WEBPACK_IMPORTED_MODULE_0__上，然后在hello方法中传递参数给log__WEBPACK_IMPORTED_MODULE_0__["default"]并执行，

那么问题来了，`log__WEBPACK_IMPORTED_MODULE_0__["default"]`是怎么来的呢，说明我们的log模块输出的有default属性，然我们回到log模块
```
/* 1 */
(function (module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function () { return log; });
  function log(str) {
    console.log(str);
  }
}
```
log模块中使用了一个__webpack_require__.d方法，该方法的定义如下
```
__webpack_require__.d = function(exports, name, getter) {
  if(!__webpack_require__.o(exports, name)) {
    Object.defineProperty(exports, name, { enumerable: true, get: getter });
  }
};
__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

```
实际上就是在module.exports添加了一个default的方法，执行该方法会返回log函数
```
__webpack_require__.d(__webpack_exports__, "default", function () { return log; });
```
因此，在hello模块中，就能通过__webpack_require__(1)获取log模块的exports。通过__webpack_require__(1)["default"])()就能调用log方法

## 动态加载
```
// index.js
function hello() {
  import('./dynamic.js').then(res => console.log(res))
}
hello()

// dynamic.js
export default function log(str) {
  console.log(str);
}

```
经过webpack构建后，我们发现，除了app.bundle.js以外，还多了一个1.bundle.js，这就是我们要动态导入的模块。
另外，app.bundle.js中还多了几个先前没出现过的方法。
```
(function (modules) { // webpackBootstrap
   // 省略部分代码
// 处理jsonp
function webpackJsonpCallback(data) {  //...}; 

// 构造jsonp的请求地址
function jsonpScriptSrc(chunkId)  {// ...}

// 动态加载方法，返回promise，在promise.then中可以使用__webpack_require__加载动态模块
webpack_require__.e = function requireEnsure(chunkId) {   // ...};
var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
jsonpArray.push = webpackJsonpCallback;
jsonpArray = jsonpArray.slice();
for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
var parentJsonpFunction = oldJsonpFunction;
return __webpack_require__(__webpack_require__.s = 0);
})([/* 0 */
       (function (module, exports, __webpack_require__) {
		 function hello() {
		 __webpack_require__.e(/* import() */ 1).then(__webpack_require__.bind(null, 1)).then(res => console.log(res))
		 }
		 hello()
	 })
]);

```

还是先从入口文件看起，当执行hello方法时，会执行以下逻辑：
```
__webpack_require__.e(/* import() */ 1).then(__webpack_require__.bind(null, 1)).then(res => console.log(res))

```
在__webpack_require__.e(/* import() */ 1)之后就能正常引用了。__webpack_require__.e这个方法到底做了什么呢？我们先来看看它的定义：
```

  // 用来存储已加载和加载中的chunk
  // undefined表示chunk未加载，null表示chunk preloaded/prefetched
  // Promise = chunk loading, 0 = chunk loaded
  var installedChunks = {
	0: 0 // 表示模块0已加载
  };
__webpack_require__.e = function requireEnsure(chunkId) {
  var promises = [];
  // JSONP chunk loading for javascript
  var installedChunkData = installedChunks[chunkId]; // 当前chunkId为1，值为undefined，表示未加载,
  if (installedChunkData !== 0) { // 0 表示chunk已经安装了
    // installedChunkData只有0, undefined, null ,promise4种类型的值。如果installedChunkData布尔值为true，表示installedChunkData为一个数组，chunk加载中
    if (installedChunkData) { // 
      promises.push(installedChunkData[2]);
    } else {
      // setup Promise in chunk cache
      var promise = new Promise(function (resolve, reject) {
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });
      promises.push(installedChunkData[2] = promise); // installedChunkData = [resolve, reject，promise]，例如installedChunkData保存新创建的promise以及他的resolve和reject
      // promises => [promise]
      // 开始加载chunk
      var script = document.createElement('script');
      var onScriptComplete;
      script.charset = 'utf-8';
      script.timeout = 120;
      if (__webpack_require__.nc) {
        script.setAttribute("nonce", __webpack_require__.nc);
      }
      script.src = jsonpScriptSrc(chunkId);
      // create error before stack unwound to get useful stacktrace later
      var error = new Error();
      onScriptComplete = function (event) {
        // avoid mem leaks in IE.
        script.onerror = script.onload = null;
        clearTimeout(timeout);
        var chunk = installedChunks[chunkId]; // [resolve, reject，promise]
        if (chunk !== 0) {
          if (chunk) { // reject erro
            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
            var realSrc = event && event.target && event.target.src;
            error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
            error.name = 'ChunkLoadError';
            error.type = errorType;
            error.request = realSrc;
            chunk[1](error);
          }
          installedChunks[chunkId] = undefined;
        }
      };
      var timeout = setTimeout(function () {
        onScriptComplete({ type: 'timeout', target: script });
      }, 120000);
      script.onerror = script.onload = onScriptComplete; // load事件会在script加载并执行完才触发
      document.head.appendChild(script);
    }
  }
  return Promise.all(promises);
};


```
__webpack_require__.e的作用是判断模块是否已加载（或加载中），如果都不是，就利用jsonp加载模块。该方法会返回一个promise，当script加载并执行成功时会resolve，当加载失败时reject。这里需要注意的是，script的load事件会在脚本下载并执行完之后触发。
通过jsonp加载的1.bundle.js的实现如下
```
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1], [/* 0 */,  /* 1 */
  (function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function () {
      return 'dynamic'
    });
  })
]]);

```
不难发现，js加载完成后，调用了 window["webpackJsonp"]的push方法。当这个push方法可不是数组原生当push方法，初始化时webpack做了一个小动作，关键代码如下：
```
var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray); // oldJsonpFunction -> push，代理jsonpArray的push方法
jsonpArray.push = webpackJsonpCallback; 

```
所以在执行push方法时，实际上是执行webpackJsonpCallback。我们来看一下这个函数的定义
```
function webpackJsonpCallback(data) {
  var chunkIds = data[0];
  var moreModules = data[1];
  // 把新加载的模块加到modules数组中
  // 把模块标记为已加载，然后resolve
  var moduleId, chunkId, i = 0, resolves = [];
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
      resolves.push(installedChunks[chunkId][0]); // 把chunk的resolve方法放到resolves数组中，后面统一resolve
    }
    installedChunks[chunkId] = 0; // 把模块标记为已加载
  }
  for (moduleId in moreModules) {
    if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      modules[moduleId] = moreModules[moduleId]; // 把新加载回来的模块添加到之前的模块数组中
    }
  }
  if (parentJsonpFunction) parentJsonpFunction(data); // 把模块数据放到window["webpackJsonp"] 数组中
  while (resolves.length) {
    resolves.shift()(); // resolve the promise
  }
};

```
这个函数其实就做了几件事：

把模块标记为已加载，并追加到modules数组中
把模块数据放到window["webpackJsonp"] 数组中
调用之前那些promise的resolve

因此，当__webpack_require__.e(/* import() */ 1).then时，就能通过__webpack_require__拿到动态获取的模块了。
```
__webpack_require__.e(/* import() */ 1).then(__webpack_require__.bind(null, 1)).then(res => console.log(res))

```
