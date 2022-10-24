### 多页面打包

优雅的配置多页面打包的方法是动态获取各个页面的入口文件并且自动为每个入口文件设置`htmlWebpackPlugin`。

通过`glob`和编写一个函数来完成这些事情。

```js
//需要额外安转 npm i glob@7.1.4 -D  对了 最新版本有坑匹配不到文件，所以还是用旧版本
const glob = require('glob')

//多页面打包函数
const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    //获取到所有的入口文件，未能正确获取index.js文件
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/(.*)\/index\.js/)
        const pageName = match && match[1]
        entry[pageName] = entryFile
        htmlWebpackPlugins.push(
            new HTMLWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        )
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins } = setMPA()

...
module.exports = {
	entry: entry,
	...
	plugin: [
		...
	].concat(htmlWebpackPlugins)
}
```

### SourceMap

在配置文件中新增
```js
devtool: 'source-map'
```

就能开启`sourcemap`，其本质上是一个映射关系的表示，表示源代码和打包构建之后的代码之间的关系。有了它，当打包构建后的代码出现`bug`的时候，就不用盯着打包之后的代码发出这是我写的代码吗？的疑惑了，我们可以直接查看`bug`出现在了源码的哪个位置，是一个非常方便开发的工具。

当然，生产环境下就不要用了，不然等于直接宣告让人来搬你的代码。