> 主要回答flex布局的基础概念、父子元素的属性以及一些简写属性。

`flex`布局本质上就是利用轴线对于元素的布局进行控制，相比于传统的基于盒子模型和浮动定位方式的布局要强大许多。

给一个元素设置`display:flex`之后就开启了`flex`布局。

该元素内部会存在两根坐标轴，分别是横轴也就是主轴，以及纵轴也称为交叉轴。该元素会通过这两根轴线控制内部元素的布局。

## 父元素容器属性

### flex-direction

子元素在轴线上的对齐方式。

```
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
row（默认值）：主轴为水平方向，起点在左端。row-reverse：主轴为水平方向，起点在右端。column：主轴为垂直方向，起点在上沿。column-reverse：主轴为垂直方向，起点在下沿。
```

### flex-wrap

决定子元素是否要换行显示的属性。

```
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
nowarp 不换行
warp换行，第一行在上方
wrap-reverse换行，第一行在下方
```

### flex-flow

上面两个属性的简写方式，默认值分别是`row nowarp`。

### justify-content

子元素在主轴上的对齐方式。

```
flex-start（默认值）：左对齐
flex-end：右对齐
center： 居中
space-between：两端对齐，项目之间的间隔都相等。
space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
```

### align-items

子元素在交叉轴上的对齐方式。

```
flex-start：交叉轴的起点对齐。
flex-end：交叉轴的终点对齐。
center：交叉轴的中点对齐。
baseline: 项目的第一行文字的基线对齐。
stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度
```

## 子元素的属性

### flex-grow

子元素的放大比例，默认为0。我们总是说`flex`布局非常灵活，即使浏览器窗口不断变化，`flex`布局也能基本保持页面原有布局，其实就是通过子元素的放大缩小来实现的。

### flex-shrink

子元素的缩小比例，默认为1。也就是浏览器窗口缩小对的时候，对应的子元素也会等比例缩小，从而实现维持原有布局。

### flex-basis

在分配多余空间之前，项目占据的主轴空间。默认为`auto`即项目本来的大小。

### flex

**重点！！！**

我们在项目里面常见的子元素的属性可能不是上面这三个中的任何一个，经常看见的写法是

```css
flex: 1
flex: auto/none
```

这样的`flex`后面跟了一个数字或者是`auto/none`。这样的写法表示的其实是上面三个属性的简写。

`flex: 1`表示上面三个属性的值依次为: 1 1 0。在`flex-basis`为0基础上进行伸缩。

`flex: auto`表示的属性是：1 1 auto。`flex`元素既可以放大也可以缩小

