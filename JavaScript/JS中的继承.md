> 手写寄生组合继承。

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