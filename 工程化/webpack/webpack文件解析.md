## ES6

`ES6`语法的转换需要使用`babel`，因此首先安装`babel`并且配置相关的`preset`

```
//.babelrc
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

然后加入相应的`loader`配置

```javascript
//webpack.config.js
...

module: {
	rules: [
		{
		//用babel-loader处理以.js结尾的文件
			test: /.js$/,
			use: 'babel-loader'
		}
	]
}
```

## CSS、Less、Sass

`css-loader`加载CSS文件并将其转换为一`common.js`模块。

`style-loader`将样式文件以`<style>`标签的形式插入`html`的`<header>`中。

`less-loader`将`less`文件转换为`css`文件。

**loder的调用顺序是链式调用，从右往左。所以顺序应该写成数组形式并且反着写。**

```javascript
module: {
	rules: [
		{
			test: /.css$/,
			use: [
				'style-loader',
				'css-loader',
				'less-loader'
			]
		}
	]
}
```

## 图片和字体

`file-loader`用于解析图片和字体。打包之后会出现图片和字体的哈希值。

`url-loader`也可以实现同样的功能，只是针对小于limit设置的图片会进行base64转换。

```javascript
module: {
	rules: [
		{
			test: /.(png|jpg|gif|jepg|woff|woff2|eot|ttf|otf)$/,
			use: 'file-loader'
		}
	]
}
```

```javascript
{
    test: /.(png|jpg|gif|jepg)$/,
    use: [
        {
            loader: "url-loader",
            options: {
                //大小小于10240字节的图片会被转换为base64
                limit: 10240
            }
        }
    ]
},
```