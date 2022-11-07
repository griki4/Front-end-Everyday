使用`npm`发布一个自己的包并尝试使用。

1. 注册`npm`官方网站的账号

2. 本地编写对相应的工具库，目录结构如下

   ```
   |--index.js
   |--math.js
   |--package.json //初始化目录生成的
   ```

​	以我自己编写的库函数为例，三个文件中的代码

```js
//index.js
export { addString } from './math.js'
```

```js
//math.js
export function addString(num1, num2) {
    let i = num1.length - 1, j = num2.length - 1
    let add = 0
    let res = []
    while(i >= 0 || j >= 0 || add !== 0) {
        const x = i >= 0 ? num1.charAt(i) - '0':0
        const y = j >= 0 ? num2.charAt(j) - '0':0
        const result = x + y + add
        res.push(result % 10)
        add = Math.floor(result / 10)
        i -= 1
        j -= 1
    }
    return res.reverse().join('')
}
```

```json
//package.json
{
  "name": "xrikis_math",
  "version": "1.0.0",
  "description": "some math tools in javascript",
  "main": "index.js",
  "keywords": ["math", "tool", "xrikis"],
  "author": "xrikis",
  "license": "MIT"
}
```

3. `npm login`在终端登录账号。**这里注意一下需要切换到`npm`官方的安装源，如果之前使用了镜像注意切换。**
4. `npm publish`发布即可。

成功发布之后去查看自己的`npm`账号可以发现自己之前编写的代码都发布过来了，之后任何人如果想要使用你编写的这个库函数，直接`npm install`就可以了。

以我这里为例，直接`npm install xrikis_math`就能在项目里面使用我编写的这个库函数了。