> Plugin究竟和Loader有什么区别？

插件配置在`plugins`数组中，并且都是以`new`实例化的方式进行调用的。

`webpack`在运行的声明周期中会广播许多事件，而插件具备监听这些事件的能力。插件会在监听到特定的事件后，加入`webpack`的构建流程，调用`webpack`的`API`对内容进行一些操作。

比如经常使用的`clean-webpack-plugin`具备在输出内容的时候自动清除残留在输出目录下文件内容的功能。

```js
// plugins/clean-webpack-plugin.js
class CleanWebpackPlugin {
  apply(compiler) {
    // 获取操作文件的对象
    const fs = compiler.outputFileSystem;
    // emit是异步串行钩子
    compiler.hooks.emit.tapAsync("CleanWebpackPlugin", (compilation, callback) => {
      // 获取输出文件目录
      const outputPath = compiler.options.output.path;
      // 删除目录所有文件
      const err = this.removeFiles(fs, outputPath);
      // 执行成功err为undefined，执行失败err就是错误原因
      callback(err);
    });
  }

  removeFiles(fs, path) {
    try {
      // 读取当前目录下所有文件
      const files = fs.readdirSync(path);

      // 遍历文件，删除
      files.forEach((file) => {
        // 获取文件完整路径
        const filePath = `${path}/${file}`;
        // 分析文件
        const fileStat = fs.statSync(filePath);
        // 判断是否是文件夹
        if (fileStat.isDirectory()) {
          // 是文件夹需要递归遍历删除下面所有文件
          this.removeFiles(fs, filePath);
        } else {
          // 不是文件夹就是文件，直接删除
          fs.unlinkSync(filePath);
        }
      });

      // 最后删除当前目录
      fs.rmdirSync(path);
    } catch (e) {
      // 将产生的错误返回出去
      return e;
    }
  }
}
module.exports = CleanWebpackPlugin;
```

`complier.hook.emit`在`webpack`将要输出打包的文件之前触发。通过`webpack`提供的一些`API`，该插件能够获取到出口目录并且操作对应的文件。

插件监听事件的原理就是通过在`webpack`提供的声明周期钩子上注册一些代码逻辑，这些逻辑能通过`webpack`提供`API`操作文件。`webpack`广播事件的方式就是向外暴露声明周期，主要是通过`compiler compilation`这两个对象。

- `compiler`对象包含`wepack`整个声明周期相关的钩子。
- `compilation`则更加精细化，包含和模块以及依赖相关的粒度更小的声明周期钩子。

![Webpack 插件生命周期](https://yk2012.github.io/sgg_webpack5/imgs/source/plugin.jpg)