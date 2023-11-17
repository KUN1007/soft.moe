# 技术栈介绍

## 概览

本项目主要采用 Vue + Nodejs 为技术栈，全面支持 Typescript

**前端不依赖任何 UI 组件库**

后端为 Koa

前端采用了: Vite, Vue3 Composition API + Setup, Typescript, Pinia, SCSS, Vue-router, Milkdown, vue-i18n, indexdb

后端采用了: Webpack, Babel, Koa, Typescript, Redis, Mongoose, Mongodb, JWT

## 前端

### Vite

前端选用 Vite 的原因是它的快速，以及对 Vue 的第一优先级支持

插件上，仅仅对其集成了基本的 Vue 插件，以及一个分析打包大小的插件

配置上，还对其 host, port 等基本设置进行了配置, 默认为 127.0.0.1:1007

### Vue

我们选用了 Vue 最新的一套技术栈，Vue3 Composition API + Setup + Typescript

这是因为

* 更加现代，技术栈不落后
* Vue3 带来了强大的性能提升
* 更加符合现代框架的写法
* 更好的 Typescript 支持
* Setup 写法非常简洁

我们想把技术栈提升的尽可能新，其实当时应该使用 Nuxt3 的

在项目中，我们使用了 `Teleport`, `TransitionGroup` 等多种 Vue3 最新的内置组件，并且使用了官网最推荐的良好 Typescript 实践

我们的函数一律使用了箭头函数写法

```typescript
const kun = () => {
    console.log('KUN IS THE CUTEST!')
}
```

### Typescript

Typescript 的好处在是显而易见的，尤其是在大型项目中

对于本项目前端来说，Typescript 的使用体现在以下几个方面

* Interface. 带来了极好的类型支持
* No any. 本项目中不存在 Any 的声明
* Omit. 省略不必要的属性
* Type Guard. 类型守卫
* typeof
* Vue3 的 defineProps 与 defineEmits

项目 `src` 目录下有一个 `types` 文件夹, 它存放了某些全局的 `types`, 对于某些文件中使用的类型, 可以在其父文件夹的 `types` 目录内找到

### Pinia

Pinia 是 Vue3 目前最推荐的状态管理工具，使用它是一个良好的实践

我们的项目需要部分 Pinia 的持久存储, 也就是将 Pinia 的 store 存储在 `localStorage` 中, 于是我们使用了 Pinia 的插件 `pinia-plugin-persistedstate` 

例如说首页的 `Aside` 需要在用户刷新页面时保留状态, 就需要持久存储状态

对于本项目来说, Pinia 在 `src` 文件夹下的 `store` 目录定义, 这个目录有几个子目录和一个 `index.ts` 文件

* modules. 这是持久存储的 store, 里面的变量全部会在 `localStorage` 中存储一份
* temp. 这是临时存储的 store, 用于在全局组件之中传递数据
* types. 这是 store 变量的类型
* utils. 这是一些 store 需要用到的工具函数
* index.ts 这是将 Pinia 应用到 Vue 的函数, 注册 Pinia

### SCSS

由于我们原来的纯 `HTML`, `CSS` 编写的 [kun-galgame-pure-css](https://github.com/KUN1007/kun-galgame-pure-css) 是使用原生 CSS 写的，所以我们没有使用 `tailwindcss` 这样的工具库

对于 `less`, 我们在初期使用过，但是效果不是很理想，所以使用了 `SCSS`

在项目中, 它们位于 `src/styles` 目录下, 这是全局通用的样式, 存放了全局颜色变量等

在每个 `Vue` 的组件中, `style` 标签下存放了该 `Vue` 组件的样式

### Router

任何一个前端框架都有自己的 `Router`, 由于我们使用了 `Vue3`, 所以我们使用了 `vue-router@4`

在本项目中, router 的体现有以下几点

* <RouterLink/>, <RouterView/>, 这是 Vue 自带的组件
* useRouter, 可以创建一个 router, 本项目中大多用于 router.push()
* useRoute, 可以返回当前的路由实例
* onBeforeRouterLeave
* router.beforeEach

我们还使用了 `nprogess`, 作用是在 router 跳转期间展现进度条

### Milkdown

这是我们目前的文本编辑器, 我们使用了 Milkdown, 这是一个 Markdown 编辑器

编辑器对于论坛来说是灵魂, 由于 Vue 在对富文本的支持上没有任何符合我们需求的编辑器, 故而我们没有采用富文本编辑器

原因如下

* WangEditor. 坑比较多, 目前已停止维护
* TinyMCE. 有收费计划, 去掉官方的图标不符合我们萌萌的作风
* Quill. 有 vue-quill, 可以用, 但是难看, vue-quill 的 quill 版本较老, 有警告

未使用其他 Markdown 编辑器的原因是不支持 `WYSIWYG (所见即所得)`

关于 Milkdown, 我们追求最新的版本, 所以自己写了一个工具栏 (Milkdown 的最新版是没有官方 Menu 的), 并使用了以下的插件

* @milkdown/core, @milkdown/ctx. Milkdown 的核心
* @milkdown/plugin-clipboard, 支持剪切板复制 Markdown
* @milkdown/plugin-history, 支持 Ctrl + Z
* @milkdown/plugin-indent, 支持 Tab 缩进
* @milkdown/plugin-listener, 支持编辑器监听事件
* @milkdown/plugin-prism, 代码高亮
* @milkdown/plugin-tooltip, 鼠标选中工具提示
* @milkdown/plugin-trailing, 编辑区域结束自动插入一行
* @milkdown/preset-commonmark, commonmark 支持
* @milkdown/preset-gfm, gfm 支持
* @milkdown/prose, Milkdown 适配
* @milkdown/transformer
* @milkdown/utils, Milkdown 的工具函数包
* @milkdown/vue,@prosemirror-adapter/vue. Milkdown 的 Vue 适配

### i18n

作为一个论坛, i18n 带来的好处是显而易见的, 我们使用了 vue-i18n 作为 i18n 支持

i18n 支持两种语言, English | 中文

i18n 主要位于 `src/language` 目录下

我们在 i18n 的配置中使用了 `globalInjection` 全局注册了 `t`, `tm` 等方法, `tm()` 会翻译一个对象式的键, 使用 `t()` 翻译会有警告, 所以我们在全局使用了 `tm()` 翻译

我们的一个关键全局通知组件 `Message()` 也是支持 `i18n` 的

我们推荐 vscode 的 `i18n-ally` 插件

### indexdb

我们使用了 `localforage` 来作为操作 `indexdb` 的工具, 使用这个的目的是缓存背景图片来提升网页加载速度

我们的背景图片均使用了 `1080p, 77% compress, webp` 的图片, 大小每张仅有 100 ~ 300kb, 所以加起来的大小仅有 2m 所有, 无需担心电脑的本地存储问题


## 后端


