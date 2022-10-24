### Scope Hoisting

没有开启`Scope Hoisting`的情况下，打包后的文件中，每个模块都会使用闭包进行包裹。这样会导致打包后代码的体积增大以及大量使用闭包会有较高的内存开销。

开启`Scope Hoisting`之后，`webpack`会进行优化。如果模块`a`引用了模块`b`，那么就会将两个模块包裹在一起，通过这种方法来减少闭包的数量，进行优化。

`webpack5`在生产环境下回默认开启，起作用的是`ModuleConcatenationPlugin`这个插件。

### 动态import

页面性能优化的一个方法，有些功能或者内容在用户进行特定的行为交互之前是不会触发的，只有要使用到的时候才会加载，也就是懒加载的概念。

动态`import`就是当需要使用某一个模块的功能的时候才去引入。

```js
//触发加载模块的函数
loadComponent() {
		//返回一个Promise
        import('./test').then((Text) => {
            this.setState({
                Text: Text.default
            })
        })
    }
```

动态引入的模块会被打包成一个单独的`js`文件，触发之后会通过`JSONP`的方式进行引入。