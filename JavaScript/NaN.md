> NaN就跟它的名字是一样，是真的难。

`NaN`全称`Not a Number`，说明数据是一个非数值类型的值，所以一般情况下

```js
console.log(Nan === NaN) //false
```

毕竟两个值都不是数字，你总不能说它们是相等的。

**`Set`数据结构中会将`NaN`看做相同的元素而进行去重。**

但是有趣的事情又来了，用类型判断函数看看`NaN`会返回什么呢？（让我访问！）

```js
console.log(typeof NaN) //number
```

是不是相当逆天？

关于`NaN`还有两个函数`isNaN`和`Number.isNaN`，用于判断类型的。前者是通过能不能转换为数字进行判断，后者则是先判断是不是数字，然后再判断是不是`NaN`，后者更加精确。
