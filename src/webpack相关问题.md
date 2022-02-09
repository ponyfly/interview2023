## webpack
### webpack 工作流程
+ 参数解析：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数  
+ 找到入口文件：从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module调用 Loader 
+ 编译文件：每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则
+ 遍历 AST，收集依赖：对 Module 进行转换后，再解析出当前 Module 依赖的 Module
+ 生成 Chunk：这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 
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
