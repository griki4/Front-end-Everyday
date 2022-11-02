> 一个线程同时只能运行一个协程。

`async/await`让我们能够以书写同步代码的方式执行异步任务，相比`Promise`的链式调用更加语义化也更加清晰。

关于`async/await`的代码输出类题目总是让我感到头疼，最后发现如果结合生成器函数中的协程的概念就很好理解。本质上`async/await`的底层原理也是借助生成器函数和`Promise`来实现的。

**协程**：协程是比线程更加轻量级的存在，可以看成跑在线程上的任务，并且协程完全由用户控制。一个线程可以拥有多个协程，但是只能同时运行一个协程。如果`A`协程创建了`B`协程，那么前者是后者的父协程。

首先看一段代码：

```js
    function* genDemo() {
        console.log("开始执行第一段")
        //yield关键字将暂停当前协程，将控制权交给外部协程，并且把后面的值返回给外部协程。
        yield 'generator 1'
        console.log("开始执行第二段")
        yield 'generator 2'
        console.log("开始执行第三段")
        yield 'generator 3'
        console.log("执行结束")
        return 'generator 4'
    }
    console.log('main 0')
    let gen = genDemo() //创建gen协程，但是此时线程的控制器还是父协程，只有调用next方法的时候才会将控制权交给gen协程
    console.log(gen.next().value)
    console.log('main 1')
    console.log(gen.next().value)
    console.log('main 2')
    console.log(gen.next().value)
    console.log('main 3')
    console.log(gen.next().value)
    console.log('main 4')
```

分析一下执行流程。

- 打印`main 0`，创建`gen`协程。
- `gen.next`切换至`gen`协程，打印*开始执行第一段*，遇到`yield`将切换协程并且将`generator 1`交给外部协程。
- 执行`gen.next().value`，打印`yield`交出来的值，打印`main 1`。

后面的步骤就是重复上述步骤。

`gen`协程执行完毕后会关闭并将`return`关键字后面的值返回出来。

理解了协程和生成器的概念再看看`async/await`。

`async`函数的返回值是一个`Promise`对象，基本类型的数据也会被包装成`Promise`对象返回。

`await`关键字后面的值会被包装成`Promise`对象，同时`await`还会暂停当前函数的执行，执行协程切换，将后面的`Promise`对象返回给外部协程。

依旧是一段代码

```js
async function foo() {
    console.log(1)
    let a = await 100
    console.log(a)
    console.log(2)
}
console.log(0)
foo()
console.log(3)
// 0 1 3 100 2
```

分析一下执行流程。

- 打印0。
- `foo()`创建协程并且切换协程，打印1。
- `await`将100包装成一个`Promise`对象并返回给外部，同时暂停`foo`协程，切换至父协程。这里创建`Promise`对象的时候由于是基本数据类型，所以会调用`resolve`将其值放入微任务队列。
- 打印3，父协程执行完毕。查看微任务队列并且执行，`Promise.then`触发将切换至`foo`协程，执行里面代码。

最后附加一个练习题

```js
async function async1(){
   console.log('async1 start');
    await async2();
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}
console.log('script start');
async1();
console.log('script end')
// 输出顺序：script start->async1 start->async2->script end->async1 end
```



总之，**协程**的概念非常有助于理解生成器以及`async`的执行过程。