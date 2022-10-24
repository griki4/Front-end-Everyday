### ESLint

之前参加阿里巴巴的训练营的时候再团队合作的时候接触过`ESLint`，但是没有系统的学习过。简单来说就是一个代码检查工具，帮助我们在开发阶段就发现一些代码中的错误。

### 打包组件和第三方库

以打包一个字符串相加的函数为例

```js
//webpack.config.js
const TerserPlugin = require('terser-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    entry: {
        //使用同一个文件入口
        'large-number': './src/index.js',
        'large-number.min': './src/index.js'
    },
    output: {
        filename: "[name].js",
        //导出的名称
        library: 'largeNumber',
        libraryTarget: "umd",
        //导出方式
        libraryExport: "default"
    },
    mode: 'none',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

此时直接打包就会发现有`min`后缀的文件因为经过压缩，体积要不不带后缀的文件小得多。

然后在统计目录下新建`index.js`

```js
//index.js
//根据所处的环境，决定向外导出压缩还是为未经压缩的代码
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./dist/large-number.min')
}else {
    module.exports = require('./dist/large-number')
}
```

### 结合服务端渲染
