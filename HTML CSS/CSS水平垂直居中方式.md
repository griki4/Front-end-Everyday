> 你看我考不考你CSS就完了！

实现水平垂直居中大概是`CSS`在面试中出现频率最高的形式了。

实现这个效果主要是根据父元素是否定宽高来决定，下面分两种情况讨论一下这个问题。

### 父元素定宽高

#### 1.绝对定位加margin负值

```html
<template>
    <div id="app">
        <div class="box">
            <div class="children-box"></div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    position: relative;
}
.children-box {
    position: absolute;
    width: 100px;
    height: 100px;
    background: yellow;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -50px; 
}
</style>
```

#### 2.绝对定位加transform(-50%)

```
<template>
    <div id="app">
        <div class="box">
            <div class="children-box"></div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    position: relative;
}
.children-box {
    position: absolute;
    width: 100px;
    height: 100px;
    background: yellow;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); 
}
</style>
```

#### 3.绝对定位 + left/right/top/bottom + margin(auto)

```html
<template>
    <div id="app">
        <div class="box">
            <div class="children-box"></div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    position: relative;
}
.children-box {
    position: absolute;
    display: inline;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0px;
    background: yellow;
    margin: auto;
    height: 100px;
    width: 100px;
}
</style>
```

#### 4.flex布局

```html
<template>
    <div id="app">
        <div class="box">
            <div class="children-box"></div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
}
.children-box {
    background: yellow;
    height: 100px;
    width: 100px;
}
</style>
```

#### 5.grid布局

```html
<template>
    <div id="app">
        <div class="box">
            <div class="children-box"></div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: grid;
}
.children-box {
    width: 100px;
    height: 100px;
    background: yellow;
    margin: auto;
}
</style>
```

### 父元素不定宽高

#### 1.flex布局

伟大的`flex`布局拯救了前端！和定宽高一样，设定`justify-content align-items`都设置为`center`。

#### 2.grid布局

和定宽高一样。

#### 3.table布局的vertical-align

```html
<template>
    <div id="app">
        <div class="box">
            <div class="children-box">111111</div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.children-box {
   background: yellow;
   display: inline-block;
}
</style>
```

总结一下，就是`flex grid`这种布局在定宽高和不定宽高的时候都可以使用。涉及`margin transfrom`一类的操作则需要定宽高，不定宽高的话使用`table line-height`这种跟宽高不相关的定位方式。