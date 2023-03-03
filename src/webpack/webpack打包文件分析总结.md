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

## loader总结
loader本质上就是一个函数，这个函数会在我们加载一些文件时执行
```
// index.js
console.log('hello')

// webpack.config.js
const path = require('path')
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolveLoader: {
        // loader路径查找顺序从左往右
        modules: ['node_modules', './']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'syncLoader'
            }
        ]
    }
}

// syncLoader
module.exports = function (source) {
    source += '升值加薪'
    return source
}

```
## plugins总结
plugin通常是在webpack在打包的某个时间节点做一些操作,
plugin类里面需要实现一个apply方法，webpack打包时候，会调用plugin的aplly方法来执行plugin的逻辑，这个方法接受一个compiler作为参数，这个compiler是webpack实例
plugin的核心在于，apply方法执行时，可以操作webpack本次打包的各个时间节点（hooks，也就是生命周期勾子），在不同的时间节点做一些操作
```
// webpck.config.js
const path = require('path')
const DemoWebpackPlugin = require('./demo-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new DemoWebpackPlugin()
    ]
}
// DemoWebpackPlugin.js
class DemoWebpackPlugin {
    constructor () {
        console.log('plugin init')
    }
    // compiler是webpack实例
    apply (compiler) {
        // 一个新的编译(compilation)创建之后（同步）
        // compilation代表每一次执行打包，独立的编译
        compiler.hooks.compile.tap('DemoWebpackPlugin', compilation => {
            console.log(compilation)
        })
        // 生成资源到 output 目录之前（异步）
        compiler.hooks.emit.tapAsync('DemoWebpackPlugin', (compilation, fn) => {
            console.log(compilation)
            compilation.assets['index.md'] = {
                // 文件内容
                source: function () {
                    return 'this is a demo for plugin'
                },
                // 文件尺寸
                size: function () {
                    return 25
                }
            }
            fn()
        })
    }
}

module.exports = DemoWebpackPlugin

```
