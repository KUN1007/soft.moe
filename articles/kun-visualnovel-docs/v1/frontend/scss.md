# SCSS

## 介绍

我们在本项目中选择了 `SCSS` 作为样式预处理器，原因是本项目是我们原项目 [kungalgame-pure-css](https://github.com/KUN1007/kungalgame-pure-css) 的重构项目，然而原项目的样式是全部使用原生 css 编写的

> 为什么不用 tailwindcss

折腾一下而已啦（CSS 真的好麻烦。。。）~~我不会告诉你其实是因为当时我还不会 tailwindcss~~

## 结构

本项目的 SCSS 位于 `src/styles` 目录下，它的结构为

* effect. 一些 CSS 动画的位置
* nprogess. 自定义了一下 nprogess 的样式
* theme. 存放了白天 / 黑夜模式的配色
* tooltip. v-tooltip 指令的实现
* index.scss
* reset.scss 预设样式

## 使用

`SCSS` 在本项目中主要有下面几种用法

### 在 Vue 的 `<style>` 标签中使用

这是本项目最常见的使用方式，它是方便的，并且我们使用了 `scoped` 来确保不产生样式污染

### 预设样式

`reset.scss` 中的预设样式，以及 `styles` 中的其他样式，都会被引入使用

### v-bind 样式绑定

可以使用 `v-bind` 绑定一个样式的变量，使其变为响应式的。

这个在本项目中被大量使用，例如 `width: v-bind(kungalgamePageWidth);`

### :deep() 样式穿透

某些样式可能在 `Vue` 将其他元素渲染完成之后才会出现，给这些元素在 `<style>` 标签内设置的样式是无法生效的

这些元素都是别人预先定义好的，我们无法更改它的样式，这个时候我们可以使用 `:deep()` 实现样式穿透

在想要生效元素的父元素上包裹 `:deep()` 即可解决这个问题

```scss
.editor {
  :deep(.milkdown) {
    width: 100%;
    padding: 10px;
  }
}
```

## 核心

本项目中用到的样式无非就几种，非常常见且无聊

### 居中魔法

UR 级

```scss
.kun {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

SSR 级

```scss
.kun {
    margin: 0 auto;
}
```

### 水平填充分布

```scss
.kun {
    display: flex;
    justify-content: space-around;
}
```

### 竖直分布

```scss
.kun {
    display: flex;
    flex-direction: column;
}
```

### 边框，hover 改变背景色

```scss
.kun {
    color: var(--kungalgame-blue-4);
    border: 1px solid var(--kungalgame-blue-4);
    background-color: var(--kungalgame-trans-white-9);

    &:hover {
        transition: all 0.2s;
        color: var(--kungalgame-white);
        background-color: var(--kungalgame-blue-4);
    }
}
```
