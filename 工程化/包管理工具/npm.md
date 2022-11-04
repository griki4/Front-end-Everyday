> 天天npm i，npm到底是个啥？

`npm`全程`Node Package Manager`，翻译过来就是`Node`的包管理器，虽然它现在的功能远远不止应用于`Node`，不过现在都这么叫。简单来说，有了`npm`，我们写项目的时候如果需要用一些外部的库，直接用`npm`进行命令行操作就能下载对应的文件了，不需要自己上搜索引擎一顿找了。

### 项目初始化

一般来说初始化一个项目有两种方式。

- npm init -y。会为我们自动在当前目录下生成`package.json package-lock.json`。
- 使用脚手架工具，比如`Vue-CLI Create-React-APP`，`Vue-CLI`中的初始化命令就是`vue create `+ 项目名称。

### 配置文件解读

`package.json`和`package-lock.json`都是项目里面的常客了，分析一下它们的结构和作用。

#### package.json

```json
{
  "name": "02_package_demo", //项目名称
  "version": "1.0.0", //项目版本
  "description": "", //项目的简单描述
  "main": "index.js", //入口文件
  "scripts": { //命令行配置，对象形式。通过npm run {key}可以运行对应的value中的命令
    "start": "node ./src/main.js",
    "build": "webpack xxx.js"
  },
  "keywords": [],
  "author": "", //项目作者
  "license": "ISC",
  "dependencies": { //项目依赖的库
    "axios": "^0.27.2",
    "dayjs": "^1.11.3",
    "element-plus": "^2.2.6",
    "vue": "^3.2.37"
  },
  "devDependencies": { //项目开发时的依赖，在生产环境下不依赖 npm install的时候加上--save-dev或-D表示开发时依赖
    "babel": "^6.23.0",
    "webpack": "^5.73.0"
  }
}
```

这里细说一下依赖中的版本号。版本号由三个部分组成，以`axios 0.27.2`为例。

- 0表示主版本号。做了不向下兼容的`API`修改的时候需要更新。
- 27表示次版本号。一般是新增了一些向下兼容的功能的时候更新。
- 2表示修订号。一般是做了一些`bug`修复的时候更新。

**发布到`npm`的包一般都需要遵守上述的三条规范，也就是`semver`规范。**

至于前面的`^`表示安装依赖的时候，主版本号保持不变，但是次版本号和修订版本号以最新的为准。

还有一种写`~`表示主次版本号都不变，修改版本号为最新。

#### package-lock.json

上面说了安转依赖的时候版本号可能发生改变，如果遇到一些不遵守发布规范的库可能导致项目无法运行，因此出现了`package-lock.json`来锁定版本号。

该文件会锁定开发时的版本号并记录，防止由于引用了不遵守规范的库而导致项目无法运行的问题。

### npm install

`npm`的原理？

![](E:\.png)



关于`npm`的一些其他的命令可以查看[官方文档](https://docs.npmjs.com/)。
