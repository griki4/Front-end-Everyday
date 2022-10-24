## webpack配置快速上手

> 开始学习一门新技术的正确打开方式是知道它是干啥的以及怎么用。

`webpack`是一个打包工具，能够将我们编写的代码打包成浏览器能够识别的语言运行。`webpack`是目前主流的前端工程化工具，具有代码压缩、性能优化等诸多优点。

在创建`Vue`项目时使用的`Vue-Cli`就是对`webpack`的封装。（小声bb，`Vite`是真香）

话不多说，直接上手配置一下就知道是怎么回事了。

新建一个文件夹并且初始化。

```
npm init -y
```

安装`webpack`和`webpack-cli`

```
npm install webpack@5.42.1 webpack-cli@4.10.0 -D
```

在`package.json`中配置一下`webpack`的启动命令

```
"dev": "webpack"
```

然后就可以新建一个`webpack.config.js`文件，在里面进行`webpack`相关的配置了。

```javascript
//webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')//导入插件
module.exports = {
	//打包环境。开发环境（development）打包快，不进行代码压缩和性能优化。生产环境（production）则相反
	mode: 'development'，
    //入口。决定打包开始的入口文件
    entry: path.join(__dirname, 'src/index.js'),
    //出口。打包完的文件应该放在哪里
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/bundle.js' //bundle.js存放打包之后的文件   
    },
	//配置dev-server，可以在浏览器中查看打包的文件。npm安转一下webpack-dev-server
    //在package.json中配置一下启动命令"serve":"webpack serve"
	devServer: {
        port: 9000 //端口号
    },
    //配置插件plugin，webpack强大之处的体现。npm安转对应插件。
    plugins: [
        new HtmlWebpackPlugin({
           	 template: path.join(__dirname, './src/index.html'), //原文件存放路径
      		filename: path.join(__dirname, './dist/index.html'), //输出文件路径
        })
    ]
}
```

上面这些配置完成之后，我们的`webpack`目前就可以打包`js`文件了。没错，目前只能打包`js`文件，想要打包`css`,`Vue`组件，这点配置还不够，我们需要加载器`loader`的帮助。

`webpack`其实是只认`js`文件的，想要它去打包其他类型文件，就需要一个“翻译官”，就是`loader`。

关于`loader`的调用，`webpack`首先会判断需要打包的模块是否为`js`模块。

- 是`js`模块。查看是否有`js`高级语法，无则直接打包处理，有则查看是否配置了`babel-loader`用于进行`ES6`到`ES5`语法的转换，没有会报错，有则调用该`loader`进行处理后打包。
- 不是`js`模块的模块同理，会判断是否有对应的`loader`进行处理，有则调用无则报错。

安装几个常用的`loader`：

```
npm i style-loader css-loader -D
npm i less-loader less -D
npm i url-loader file-loader -D //用于打包图片
npm i babel-loader@8.2.2 @babel/core@7.14.6 @babel/plugin-proposal-decorators@7.14.5 -D
```

不同的`loader`配置也不尽相同，所以这里简单说一下最通用的配置。以`less-loader`为例，在`webpack.config.js`中新增以下配置项

```javascript
module.exports = {
	...
	modules: {
		rules: [
		   {
                test: /\.less$/,//正则匹配对应类型的文件
                use: ['style-loader', 'css-loader', 'less-loader']//采用的loader顺序，注意从右往左
            }
		]
	}
}
```

其他类型的模块基本一致，`babel-loader`要注意要将项目的依赖模块排除。

```javascript
{
	test: /\.js$/,
	use: 'babel-loader',
	exclude: /node_modules/ //排除node_modules文件下的模块
}
```

最后就是在生产环境的打包发布，在`package.json`中新增以下代码

```javascript
"scripts": {
    "build": "webpack --mode production",
}
```

然后在终端运行

```
npm run build
```

就可以看见用于生产环境的打包之后的代码，和开发环境最直观的区别就是我们发现代码被压缩了，这是`webpack`为了节省空间而做出的优化。



