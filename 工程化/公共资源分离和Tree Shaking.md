### 公共资源分离

以`React`构建的页面为例，我们基本都会使用到`React`和`ReactDOM`，每个页面都打包一份无疑会造成文件体积过大并且包含重复部分。使用`html-webpack-externals-plugin`或者是`splitChunks`可以实现对这些公共资源的分离，前者还可以配合`CDN`进行使用，减小打包文件的体积。

```js
//html-webpack-externals-plugin
...
        new htmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'react',
                    entry: 'CDN路径',
                    global: 'React'
                },
                {
                    module: 'react-dom',
                    entry: 'CDN路径',
                    global: 'ReactDOM'
                }
            ]
        })
```

```js
//splitChunks
optimization: {
        ...
        splitChunks: {
            //引用公共资源的最小体积
            minSize: 0,
            cacheGroups: {
                commons: {
                    //打包公共资源后的名称
                    name: 'common',
                    chunks: "all",
                    //资源的引用次数
                    minChunks: 2
                }
            }
        }
    },
```

### Tree-Shaking

中文名摇树优化，简单来说就是一个作用。没有使用到的代码就不要打包到文件里面了，节省空间。比如引入了模块`a`，但是自始至终都没有使用到`a`模块中导入的内容，这样打包后的文件就不会包含`a`模块的内容，由此实现代码体积优化。

还有就是没有副作用的代码才会被”摇“掉，所谓副作用就是模块内部的代码会对模块外部的变量产生影响，比如模块`b`中有这样的一行代码

```js
Array.prototype.fun = () => {}
```

这行代码会对全局的数组都产生影响，所以即使`b`模块的代码引入之后没有调用，他也不会被摇掉。

`package.json`中的`sideffects`选项可以设置`tree-shaking`的配置，设为所有文件都有副作用还是默认都没有副作用，或者单独表示哪些文件是有副作用的。

```
// 所有文件都有副作用，全都不可 tree-shaking
{
 "sideEffects": true
}
// 没有文件有副作用，全都可以 tree-shaking
{
 "sideEffects": false
}
// 只有这些文件有副作用，打包的时候会保留
// 所有其他文件都可以 tree-shaking，
{
 "sideEffects": [
  "./src/index.js",
  "./src/search.js"
 ]
}
```

