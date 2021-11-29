(function (graph) {
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
        require('./src/index.js')
    })({"./src/index.js":{"deps":{"./a.js":"./src/a.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nconsole.log(\"\".concat(_a.str, \" Webpack\"));"},"./src/a.js":{"deps":{"./b.js":"./src/b.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\n\nvar _b = require(\"./b.js\");\n\nvar str = \"hello\";\nexports.str = str;"},"./src/b.js":{"deps":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\nvar b = \"bbb\";\nexports.b = b;"}})