## webpack
### webpack 工作流程
+ 参数解析：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数  
+ 找到入口文件：已入口 Entry 为起点开始递归解析 Entry 依赖的所有 Module调用，不同的module使用不同的 Loader 进行处理
+ 编译文件：每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则
+ 开始构建：首先将源文件生成AST语法树，然后将AST语法树转换为我们的目标代码，遍历 AST，收集依赖：对 Module 进行转换后，再解析出当前 Module 依赖的 Module
+ 生成 Chunk：这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组
+ Chunk输出文件：最后 Webpack 会把所有 Chunk 转换成文件输出
### webpack 打包速度慢怎么办
+ 缩小编译范围  
   使用modules noParse exclude include mainFields alias
```
const resolve = dir => path.join(__dirname, '..', dir);
resolve: {
    modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
        resolve('src'),
        resolve('node_modules'),
        resolve(config.common.layoutPath)
    ],
    mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
    alias: {
        vue$: "vue/dist/vue.common",
        "@": resolve("src") // 缓存src目录为@符号，避免重复寻址
    }
},
module: {
    noParse: /jquery|lodash/, // 忽略未采用模块化的文件，因此jquery或lodash将不会被下面的loaders解析
    // noParse: function(content) {
    //     return /jquery|lodash/.test(content)
    // },
    rules: [
        {
            test: /\.js$/,
            include: [ // 表示只解析以下目录，减少loader处理范围
                resolve("src"),
                resolve(config.common.layoutPath)
            ],
            exclude: file => /test/.test(file), // 排除test目录文件
            loader: "happypack/loader?id=happy-babel" // 后面会介绍
        },
    ]
}

```
+ webpack-parallel-uglify-plugin 插件（优化 js 压缩过程）能够把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程，从而实现并发编译，进而大幅提升 js 压缩速度
+ happyPack  
  在 webpack 运行在 node 中打包的时候是单线程去一件一件事情的做，HappyPack 可以开启多个子进程去并发执行，子进程处理完后把结果交给主进程
+ DLL动态链接  
  三方库不是经常更新，打包的时候希望分开打包，来提升打包速度。打包 dll 需要新建一个 webpack 配置文件（webpack.dll.config.js），在打包 dll 的时候，webpack 做一个索引，写在 manifest 文件中。然后打包项目文件时只需要读取 manifest 文件
```
const webpack = require("webpack");
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const dllPath = path.resolve(__dirname, "../src/assets/dll"); // dll文件存放的目录
module.exports = {
entry: {
// 把 vue 相关模块的放到一个单独的动态链接库
vue: ["babel-polyfill", "fastclick", "vue", "vue-router", "vuex", "axios", "element-ui"]
},
output: {
filename: "[name]-[hash].dll.js", // 生成vue.dll.js
path: dllPath,
library: "dll[name]"
},
plugins: [
new CleanWebpackPlugin(["*.js"], { // 清除之前的dll文件
root: dllPath,
}),
new webpack.DllPlugin({
name: "dll[name]",
// manifest.json 描述动态链接库包含了哪些内容
path: path.join(__dirname, "./", "[name].dll.manifest.json")
}),
],
};
```
接着， 需要在 package.json 中新增 dll 命令。
```
"scripts": {
    "dll": "webpack --mode production --config build/webpack.dll.config.js"
}

```
运行 npm run dll 后，会生成 ./src/assets/dll/vue.dll-[hash].js 公共 js 和 ./build/vue.dll.manifest.json 资源说明文件，至此 dll 准备工作完成，接下来在 webpack 中引用即可。
```
externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'vuex',
    'elemenct-ui': 'ELEMENT',
    'axios': 'axios',
    'fastclick': 'FastClick'
},
plugins: [
    ...(config.common.needDll ? [
        new webpack.DllReferencePlugin({
            manifest: require("./vue.dll.manifest.json")
        })
    ] : [])
]

```
### webpack 如何优化前端性能
1. 第三方库按需加载、路由懒加载
2. 代码分割
  + 提取第三方库「vendor」
```
module.exports = {
    entry: {
        main: './src/index.js',
        vendor: ['react', 'react-dom'],
    },
}

```
  + 依赖库分离「splitChunks」
```
optimization: {
  splitChunks: {
     chunks: "async", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
     minSize: 30000, // 最小尺寸，30000
     minChunks: 1, // 最小 chunk ，默认1
     maxAsyncRequests: 5, // 最大异步请求数， 默认5
     maxInitialRequests : 3, // 最大初始化请求书，默认3
     automaticNameDelimiter: '~',// 打包分隔符
     name: function(){}, // 打包后的名称，此选项可接收 function
     cacheGroups:{ // 这里开始设置缓存的 chunks
         priority: 0, // 缓存组优先级
         vendor: { // key 为entry中定义的 入口名称
             chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async)
             test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
             name: "vendor", // 要缓存的 分隔出来的 chunk 名称
             minSize: 30000,
             minChunks: 1,
             enforce: true,
             maxAsyncRequests: 5, // 最大异步请求数， 默认1
             maxInitialRequests : 3, // 最大初始化请求书，默认1
             reuseExistingChunk: true // 可设置是否重用该chunk
         }
     }
  }
 },

```
3. 删除冗余代码(「Tree-Shaking」)

### 常见的loader
+ file-loader 把文件输出到一个文件夹中，在代码中通过URL引用
+ url-loader 加载文件，可以设置阈值，超过阈值使用file-loader,小于阈值则压缩为base64
+ less-loader less转css
+ css-loader 加载css
+ style-loader 将css注入到js中
+ image-loader 加载并压缩图片文件
+ json-loader 识别JSON文件
+ babel-loader es6转es5
+ ts-loader ts转js
+ eslint-loader: 通过eslint检查js

## 常见的plugin
+ html-webpack-plugin: 配置html
+ mini-css-extract-plugin:提取css
+ terser-webpack-plugin: 压缩js
+ clean-webpack-plugin：清除dist
+ define-plugin: webpack4之后可以通过mode设置
+ webpack-parallel-uglify-plugin: 多进程执行代码压缩
+ webpack-bundle-analyzer: 模块打包分析

## loader和plugin的区别
+ 作用：loader本质是函数，用来处理各种各样的非js文件，plugin是贯穿于webpack的整个生命周期的，可以基于事件在各个节点进行处理
+ 使用：loader在module.rules配置，插件在plugins中配置，是数组形式，每一个plugin是一个实例

## 使用webpack开发时，你用过哪些可以提高效率的插件？

+ webpack-merge: 合并基础配置
+ size-plugin: 监控体积变化
+ webpack-dashboard： 更友好的打包信息展示

## source map是什么？生产环境怎么用？

将压缩后的代码映射会源代码的一个文件。

map文件只要不打开开发者工具，浏览器是不会加载的。

线上环境处理方案：

+ hidden-source-map：借助第三方错误监控平台 Sentry 使用

## 模块打包原理
将所有module作为数组的一项，把数组传给IIFE，当我们调用的时候，会调用module中的代码，webpack实现了自己的require和exports机制，并且在require之后做缓存，下次直接从module.export中获取结果

##  Webpack 的热更新原理

简介：webpack热更新，全称是hot module replacement,简称HMR，是一种在不刷新浏览器的情况下，实现新模块替换就模块的技术方案

实现原理：WDS（webpack-dev-server）和客户端建立websocket链接，一旦本地文件发生变更，WDS通知客户端并携带本次的构建hash,客户端和上一次的资源进行对比，然后向WDS发送ajax请求获取更新内容（文件列表，hash）,这样客户端再借助这些信息继续想向WDS发起jsonp请求，获取该chunk的增量更新。后续的部分（如何更新）交给hotModulePlugin实现,vue-loader也是借助了这些api实现了HMR

## 如何对bundle体积进行监控和分析

`webpack-bundle-analyzer`

## 文件指纹是什么？怎么用
就是指打包后的hash
+ hash: 构建有关，只要任意文件变更，整个项目构建的hash值就有变更
+ chunkHash: 不同的entry会生成不同的hash
+ contentHash: 只要文件内容变更就会生成hash

## 如何优化 Webpack 的构建速度
+ 使用高版本的webpack
+ tree-shaking，减少无用代码
+ 第三方资源CDN化，减少打包文件， webpack 中我们要配置 externals
+ 使用dll缓存非业务模块
+ 缩小打包作用域：
  + exclude/include (确定 loader 规则范围)
  + resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
  + noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)
  + IgnorePlugin (完全排除模块)
+ 使用多进程打包
+ 充分利用缓存提升二次构建速度：babel-loader terser-webpack-plugin cache-loader开启缓存

## 代码分割的本质
代码分割的本质是在体验性、性能上做出的权衡。是在打包成唯一main.bundle.js和源文件两种极端状态之间做出的中间态选择。用可接受的服务器性能压力换取用户的良好体验。

## 是否写过Loader？简单描述一下编写loader的思路

loader就是一个函数，接受的参数为源代码，我们可以对源代码做一些处理，然后return出去

## Babel原理

+ 解析：将源代码转换为AST语法树
+ 转换：将AST语法树转换为新的AST树（Taro就是利用 babel 完成的小程序语法转换）
+ 生成：将新AST语法树转换为目标代码

## webpack5特点
+ 自带静态资源处理，不需要再安装url-loader file-loader
```js
//webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	output: {
		filename: "[name].[hash:5].js",
		clean: true,
		assetModuleFilename: "assets/[hash:6][ext]",	//用来配置资源模块输出的位置以及文件名
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html"
		}),
	],
	module: {
		rules: [

			{
				test: /\.png/,          //相当于4.x版本使用的file-loader
				type: "asset/resource", //将png图片使用文件的方式打包
			},
			{
				test: /\.txt/,
				type: "asset/source",   //将文件内容原封不动的放到asset中
			},
			{
				test: /\.jpg/,          //相当于4.x版本的url-loader
				type: "asset/inline",   //jpg文件都处理成base64方式存储
			},
			{
				test: /\.gif/,
				type: "asset",
				generator: {
					filename: "gif/[hash:6][ext]",   //如果处理出来的是文件存放位置命名规则是什么，会覆盖上面assetModuleFilename配置项
				},
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,  //如果文件尺寸小于4kb那么使用base64的方式，大于使用文件
					}
				}
			},
		]
	}
}
```
+ 自带清除打包目录:webpack5提供了output.clean来替代了clean-webpack-plugin
+ 打包体积优化，5比4占用更小的体积
+ 自带缓存：在4.x版本中需要使用cache-loader来对打包结果进行缓存。在5.x版本中，无需再次安装cache-loader，如果没有做任何配置，默认就开启了打包缓存，不过是缓存到内存(memory)中，可以设置缓存到硬盘
+ 模块联邦：实现文件的互相引用
```
//给两个项目都配置上shared
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            shared: {
                jquery: {
                     singleton: true,//整个微前端项目全局唯一
                }
            }
        })
    ],
}
```
## 性能优化
### 代码层面
1. 页面资源使用懒加载import()
2. js放在底部，减少首屏渲染时间
3. 减少对dom的频繁操作
4. 减少重绘的操作（合并css操作，使用css类）
### 构建
1. 压缩文件
2. 开启gzip
3. 第三方资源cdn化
### 其他
1. 开启http2,头部压缩，多路复用，服务器推送
2. ssr
3. http缓存资源（强缓存，协商缓存）

