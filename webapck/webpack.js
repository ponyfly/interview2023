const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
// 对ast进行遍历的工具,类似于字符串的replace方法，指定一个正则表达式，就能对字符串进行替换。只不过babel-traverse是对ast进行替换
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const getModuleInfo = (file)=>{
  // 读取入口文件内容
  const body = fs.readFileSync(file,'utf-8')
  // 使用@babel/parser解析内容，sourceType表示我们要解析的es模块
  const ast = parser.parse(body,{
    sourceType:'module' //表示我们要解析的是ES模块
  });
  const deps = {}
  // 遍历ast语法树，当遇到import时调用ImportDeclaration函数，将模块依赖存到deps
  traverse(ast,{
    ImportDeclaration({node}){
      const dirname = path.dirname(file)
      const abspath = "./" + path.join(dirname,node.source.value)
      deps[node.source.value] = abspath
    }
  })
  // deps = { './a.js': './src/a.js' }
  console.log(deps)
  // 使用babel将ast语法树转换为es5代码
  const {code} = babel.transformFromAst(ast,null,{
    presets:["@babel/preset-env"]
  })
  console.log(code)
  const moduleInfo = {file,deps,code}
  return moduleInfo
}
/* moduleInfo
* {
  "file": "./src/index.js",
  "deps": {
    "./a.js": "./src/a.js"
  },
  "code": "\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nconsole.log(\"\".concat(_a.str, \" Webpack\"));"
}
* */
/*
* 我们首先传入主模块路径
将获得的模块信息放到temp数组里。
外面的循坏遍历temp数组，此时的temp数组只有主模块
循环里面再获得主模块的依赖deps
遍历deps，通过调用getModuleInfo将获得的依赖模块信息push到temp数组里。
* */
const parseModules = (file) =>{
  const entry =  getModuleInfo(file)
  const temp = [entry]
  const depsGraph = {}
  for (let i = 0;i<temp.length;i++){
    const deps = temp[i].deps
    if (deps){
      for (const key in deps){
        if (deps.hasOwnProperty(key)){
          temp.push(getModuleInfo(deps[key]))
        }
      }
    }
  }
  temp.forEach(moduleInfo=>{
    depsGraph[moduleInfo.file] = {
      deps:moduleInfo.deps,
      code:moduleInfo.code
    }
  })
  console.log(temp)
  console.log(depsGraph)
  return depsGraph
}
/*
* temp
* [
  {
    "file": "./src/index.js",
    "deps": {
      "./a.js": "./src/a.js"
    },
    "code": "\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nconsole.log(\"\".concat(_a.str, \" Webpack\"));"
  },
  {
    "file": "./src/a.js",
    "deps": {
      "./b.js": "./src/b.js"
    },
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\n\nvar _b = require(\"./b.js\");\n\nvar str = \"hello\" + _b.b;\nexports.str = str;"
  },
  {
    "file": "./src/b.js",
    "deps": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = \"bbb\";\nexports.b = b;"
  }
]
* */
/*
* {
  "./src/index.js": {
    "deps": {
      "./a.js": "./src/a.js"
    },
    "code": "\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nconsole.log(\"\".concat(_a.str, \" Webpack\"));"
  },
  "./src/a.js": {
    "deps": {
      "./b.js": "./src/b.js"
    },
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\n\nvar _b = require(\"./b.js\");\n\nvar str = \"hello\" + _b.b;\nexports.str = str;"
  },
  "./src/b.js": {
    "deps": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = \"bbb\";\nexports.b = b;"
  }
}
* */
const bundle = (file) =>{
  const depsGraph = JSON.stringify(parseModules(file))
  return `(function (graph) {
            function require(file) {
            
              function absRequire(relPath) {
                return require(graph[file].deps[relPath])
              }
              
              var exports = {};
              (function (require,exports,code) {
                eval(code)
              })(absRequire,exports,graph[file].code)
              
              return exports
            }
          require('${file}')
        })(${depsGraph})`

}
const content = bundle('./src/index.js')

//写入到我们的dist目录下
fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js',content)

// 总结
/* 一、getModuleInfo 获取模块信息 返回{file,deps,code} 该模块的路径（file），该模块的依赖（deps），该模块转化成es5的代码
* 1. 读取文件
* 2. 使用parse解析文件为ast
* 3. 使用traverse存储模块依赖
* 4. 将ast转换为es5语法代码
* 二、parseModules 递归方法，递归获取依赖
* 1. 我们首先传入主模块路径
  2. 将获得的模块信息放到temp数组里。
  3. 外面的循坏遍历temp数组，此时的temp数组只有主模块
  4. 循环里面再获得主模块的依赖deps
  5. 遍历deps，通过调用getModuleInfo将获得的依赖模块信息push到temp数组里。
  三、处理两个关键字 require exports
  1. 定义require函数，定义exports对象
* */
