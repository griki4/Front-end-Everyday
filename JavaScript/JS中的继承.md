> 重点掌握寄生组合继承

### 原型链继承

一句话概括原型链继承，将子类的原型对象指向父类构造的实例。

```js
    function Parent(name){
        this.name = name
    }
    Parent.prototype.getName = function (){
        console.log(this.name)
    }
    function Child(){

    }
    Child.prototype = new Parent('Jack')
    let person = new Child()
    console.log(person.name)//Jack
```

原型链继承的缺点，当使用构造函数创建了多个对象的时候，如果通过一个对象修改原型中的属性，该修改结果也会反映在其他的实例身上。

### 构造函数继承

盗用构造函数继承，借助`call`来实现，把父类的`this`变为子类创造的实例对象。

```js
function P(){
        this.name = ['Dante']
    }
    P.prototype.get = function (){
        console.log(this.name)
    }

    function C(){
        P.call(this)
    }
    let a = new C()
    // console.log(a.get())//Uncaught TypeError: a.get is not a function
```

缺点也很明显，子类的实例无法访问父类的原型中定义的方法。

### 组合继承

组合继承就是将原型链继承和构造函数继承的两种继承方式组合起来。

```js
    function Parent(name){
        this.name = name
        this.weapon = 'power'
    }    
	Parent1.prototype.sayName = function (){
        console.log(`this is ${this.weapon}`)
    }
    function Child(name, age){
        this.name = name
        //继承属性
        Parent1.call(this, name)
        this.age = age
    }
    //继承方法
    Child.prototype = new Parent()
```

组合继承的问题综合了上述两种继承方式，避免了各自的缺点。但是组合继承的问题在于，将子类构造函数的原型重写为父类构造函数的实例，此时子类原型上的`constructor`不指向子类构造函数了，这是不符合直觉的。

而且在子类创建实例的过程中调用了两次父类的构造函数，效率较低。

### 寄生组合继承

最常见也是最为完美的一种实现继承的方式，综合上述两种继承的优点，同时避免了各自的缺点。

```js
    function Parent1(name){
        this.name = name
        this.weapon = 'power'
    }    
	Parent1.prototype.sayName = function (){
        console.log(`this is ${this.weapon}`)
    }
    function Child(name, age){
        this.name = name
        //使用构造函数继承
        Parent1.call(this, name)
        this.age = age
    }
    //Object.create实现原型链继承
    Child.prototype = Object.create(Parent.prototype)
    //原型的构造器本身还得是自己
    Child.prototype.constructor = Child
    let c2 = new Child(20)
    console.log(c2.name, c2.weapon, c2.age)
    c2.sayName()
```

注意链接原型链的方式是使用`Object.create`，以及最后还需要将子类的原型的构造器指定为子类本身，负责构造器就是父类了，这是不符合继承的本意的。

在`ES6`中的`class`的`extends`实现的继承中，经过`babel`转义之后发现，`class`类的继承也是基于寄生组合继承来实现的。

### 原型式继承

原型式继承适用于需要对象间共享信息，但是不用额外创建构造函数的情况。

```js
function object(obj){
        function Fn(){}
        Fn.prototype = obj
        return new Fn()
    }
```

`ES5`中提供了原生的`Object.create`方法支持这种继承方式。

### 寄生式继承

寄生式继承是将原对象使用`object`构造函数进行包装。利用某种方式增强这个对象后返回。

```js
function createAnother(original){
	let clone = object(original) //以original为基准创建一个新对象
	clone.sayHi = function(){ //增强这个对象
		console.log("Hi")
	}
	return clone //返回
}
```

