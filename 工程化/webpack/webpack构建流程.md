> 我直接现场手写一个webpack

### 写在最前面

关于`webpack`我之前看了很多的文章和视频，结果还是看得迷迷糊糊，被各种繁琐的细节和配置信息整的云里雾里。最后发现得从更加宏观和抽象的视角来看待`webpack`，或者说所有的前端构建工具。

其实官网的图已经给我们解释了`webpack`的作用。

![webpack](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f741d40eaf5b45~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)

你写的一堆组件啊，`sass less`这种东西浏览器根本不认识，`webpack`的作用就是把这些玩意给你转换成浏览器认识的文件。并且你项目里面各种组件依赖过来依赖过去，数据通信各种乱飞，`webpack`能分析这些依赖关系，把你项目里面的文件给装箱打包成一个或者多个`js`文件。

这里只需要了解`webpack`做了什么就行。总结起来就是**分析依赖，装箱打包**。

## webpack构建流程

1. 初始化参数。从配置文件（`webpack.confgi.js`）和`Shell`语句（比如`npm run build`）中读取合并参数，并得出最终的参数。
2. 开始编译。利用上一步得到的参数初始化`Compiler`对象，加载配置的所有插件，执行`run`方法开始编译。
3. 确定入口：根据配置文件中的`entry`配置找到入口文件。
4. 编译模块。从入口文件开始，调用配置的`loader`处理模块。然后寻找该模块依赖的模块，递归本步骤直到入口文件依赖的所有模块都被处理。
5. 完成编译。上一步之后，得到了经过`loader`处理后的所有模块的内容和他们之间的依赖关系。
6. 输出资源。根据入口文件和模块之间的依赖关系，组成成一个个包含多个模块的`Chunk`，将`Chunk`转换成单独的文件并且添加到输出列表，这是最后一次可以修改输出内容的机会。
7. 完成输出。根据出口`output`配置，将输出资源写入到指定的文件目录下。

在上述整个流程中，`webpack`会在特定的时间广播特定的时间，插件在监听到感兴趣的事件后就会开始执行特定流程。插件能够调用`webpack`提供的`API`改变`webpack`的运行结果。

## 从代码看构建流程

在掘金上看到一篇很清晰的关于`webpack`打包流程的分析，这里自己整理了一下。

```
|-- xrikispack
    |-- dist
    |-- lib
    |   |-- compiler.js
    |   |-- index.js
    |   |-- parser.js
    |-- src
    |   |-- hello.js
    |   |-- index.js
    |-- xrikis.config.js
    |-- package.json
```

`src`目录下就是项目的源代码，包含模块间的引用。`xrikis.config.js`就是对应的打包工具的配置文件，只配置基本的入口和出口即可。`lib`下的`compiler.js parer.js`就是打包工具的核心文件。

先来看看`parser.js`。

```js
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");
module.exports = {
    // 解析我们的代码生成AST抽象语法树
    getAST: (path) => {
        const source = fs.readFileSync(path, "utf-8");
        return parser.parse(source, {
            sourceType: "module", //表示我们要解析的是ES模块
        });
    },
    // 对AST节点进行递归遍历
    getDependencies: (ast) => {
        const dependencies = [];
        traverse(ast, {
            ImportDeclaration: ({ node }) => {
                dependencies.push(node.source.value);
            },
        });
        return dependencies;
    },
    // 将获得的ES6的AST转化成ES5
    transform: (ast) => {
        const { code } = transformFromAst(ast, null, {
            presets: ["env"],
        });
        return code;
    },
};
```

可以发现这是一个工具文件，它提供了三个方法。

- `getAST`将代码转换为抽象语法树。
- `getDependencies`递归遍历`AST`的节点，收集节点依赖的模块放入`dependencies`数组。
- `transform`将抽象语法树转换为代码，同时进行语法降级。

然后就是最重要的`compiler.js`文件。

```js
const { getAST, getDependencies, transform } = require("./parser");
const path = require("path");
const fs = require("fs");

module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
        this.modules = [];
    }
    // 开启编译
    run() {
        const entryModule = this.buildModule(this.entry, true);
        this.modules.push(entryModule);
        this.modules.map((_module) => {
            _module.dependencies.map((dependency) => {
                this.modules.push(this.buildModule(dependency));
            });
        });
        // console.log(this.modules);
        this.emitFiles();
    }
    // 构建模块相关
    buildModule(filename, isEntry) {
        let ast;
        if (isEntry) {
            ast = getAST(filename);
        } else {
            const absolutePath = path.join(process.cwd(), "./src", filename);
            ast = getAST(absolutePath);
        }

        return {
            filename, // 文件名称
            dependencies: getDependencies(ast), // 依赖列表
            transformCode: transform(ast), // 转化后的代码
        };
    }
    // 输出文件
    emitFiles() {
        const outputPath = path.join(this.output.path, this.output.filename);
        let modules = "";
        this.modules.map((_module) => {
            modules += `'${_module.filename}' : function(require, module, exports) {${_module.transformCode}},`;
        });

        const bundle = `
        (function(modules) {
          function require(fileName) {
            const fn = modules[fileName];
            const module = { exports:{}};
            fn(require, module, module.exports)
            return module.exports
          }
          require('${this.entry}')
        })({${modules}})
    `;

        fs.writeFileSync(outputPath, bundle, "utf-8");
    }
};
```

依然先从整体的角度看，`compiler`中定义了三个方法。

- `buildModule`模块构建方法，返回一个对象。包含模块名称，模块的依赖，以及模块转换之后的代码。
- `emitFiles`输出方法。将文件进行输出并写入配置的出口中。
- `run`启动构建方法。从入口文件开始读取。

`run`方法初始参数为入口文件，然后递归遍历，寻找入口文件的所有直接和间接依赖并且调用`buildModule`方法对每一个模块进行构建。

然后调用`emitFiles`方法输出文件。`webpack`打包之后的文件是一个`IIFE`，传入的参数为`modules`数组，该数组的每一项都是一个模块初始化函数

```js
(function(module, exports, __webpack_require__) {
  ...
})
```

`__webpack_require__`用于加载模块，返回`module.exports`。最后将文件写入对应的目录。

`index.js`中就是读取配置文件和传入初始化参数的操作了。

```js
const Compiler = require("./compiler");
const options = require("../xrikispack.config");

new Compiler(options).run();
```

总结一下代码里面的构建流程。

- `run`启动构建，调用`buildModule`方法并传入配置文件中的入口文件作为参数。
- `buildModule`调用`paeser`的三个方法，将一个包含模块名，模块依赖的其他模块和模块经过转化后的代码的对象放入全局的`modules`数组中。
- `run`遍历`modules`数组，发现模块还依赖了其他模块，对这些被依赖的模块重复执行第2步。得到一个包含所有项目中依赖模块的`modules`数组。**`buildModule`**的执行过程就是`loader`的调用时机。
- `run`调用`emitFiles`方法。遍历`modules`数组，为每一个模块生成初始化函数，放入一个数组中。最终将代码打包成一个`IIFE`，这个立即执行函数的参数就是刚才包含所有模块初始化函数的数组。
