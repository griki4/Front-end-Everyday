> At its core, **webpack** is a *static module bundler* for modern JavaScript applications.

上次体验了一下配置`webapck`的流程，不过一些概念还是模模糊糊的，这里就梳理一下一些基础概念。

### dependency graph（依赖图）

就是一个模块引用了哪些外部模块，也就是依赖。`import`，`reqiure`这些就是表明自身依赖的关键字。`webapck`会根据依赖进行打包，防止出现把未使用的资源进行打包的情况。

### mode（模式）

分为开发模式和生产模式。

开发模式：打包快，但是不会进行代码压缩和性能优化。

生产模式：进行代码压缩和性能优化，打包慢。

### entry（入口）

`webpack`构建依赖图的时候的起点，从起点文件开始寻找构建依赖。

允许配置多个入口文件。一般`SPA`使用单个入口文件，多页应用则使用多个入口文件。

```javascript
//单入口文件
module.exports = {
	entry: 'index.js'
}

//多入口文件
module.exports = {
	entry: {
		index: 'index.js',
		search: 'search.js'
	}
}
```

### output（出口）

输出打包好的文件。打包后文件叫啥名字，放在哪里由出口决定。

出口不存在单个多个的说法，一直都是只有一个

```javascript
const path = reqiure('path')

...
//单入口文件
output: {
	path: path.join(__dirname, 'dist')
	filename: 'bundle.js'
}
//多入口文件需要在文件名上添加[name]占位符区分入口文件
output: {
	path: path.join(__dirname, 'dist')
	filename: 'bundle.js'
}
```

多个入口文件

### loader（加载器）

`webpack`的翻译官，对于`CSS`，`TypeScript`等类型的模块，`webapck`自己不认识这些模块也没有办法处理，需要`loader`将它们转换为有效的模块后才能处理。

### plugin（插件）

插件用于扩展`webpack`的功能。

### resolve（解析）

配置别名一类的操作

