### 前缀补齐

考虑浏览器兼容问题需要在`CSS`代码的前面添加前缀。比如`webkit`，`ms`等等，每次编写都书写前缀过于繁琐，于是使用`postcss`和`autoperfixer`插件实现前缀自动补全。

在之前的`less-loader`的配置中添加一个`postcss-loader`

```
test: /.less$/,
                //从右往左，链式调用
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    //自动补齐CSS3前缀
                    {
                        loader: "postcss-loader"
                    }
                ]
```

在根目录下新建一个`postcss.config.js`文件，输入下列代码。

```js
module.exports = {
    plugins: [
        require('autoprefixer')({
            //兼容使用人数大于1%，最新的两个版本的浏览器，iOS7上的浏览器。
            overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
        })
    ]
}
```

重新打包发现`CSS`代码以及自动添加了前缀。

### 移动端px自动转换成rem

媒体查询?

为了适配移动端，会采用`rem`作为单位而非`px`，同样在`less-loader`中新增配置，

```js
{
   loader: "px2rem-loader",
   options: {
       //1rem = 75px
       remUnit: 75,
       //rem保留8位小数    
       remPrecision: 8
   }
}
```

同时还需要`lib-flexible`计算`rem`的大小，这样才能实现顺利转换。这里需要使用静态资源的内联来实现。静态资源内联使用`raw-loader`或者`html-inline-css-webpack-plugin`。

静态资源内联主要用于一些小资源或者项目需要预处理库等等。

