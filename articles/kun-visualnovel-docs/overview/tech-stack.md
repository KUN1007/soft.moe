# 技术栈介绍

## 概览

本项目主要采用 Vue + Nodejs 为技术栈，全面支持 Typescript

**前端不依赖任何 UI 组件库**

后端为 Koa

前端采用了: Vite, Vue3 Composition API + Setup, Typescript, Pinia, SCSS, Vue-router, Milkdown, vue-i18n, indexdb

后端采用了: Nodejs, Webpack, Babel, Koa, Typescript, Redis, Mongoose, Mongodb, JWT, bcrypt, nodemailer, sharp

## 前端

### Vite

前端选用 Vite 的原因是它的快速，以及对 Vue 的第一优先级支持

插件上，仅仅对其集成了基本的 Vue 插件，以及一个分析打包大小的插件 `rollup-plugin-visualizer`

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

### Nodejs

我们的后端没有使用常规的 `Java`, 原因是 `Java` 有些过饱和了

我们对 `Nodejs` 进行了 `Typescript` 支持

我们使用了以下 `Nodejs` package

* formidable, 用于解析表单
* node-schedule, 定时任务
* nodemailer, nodejs 邮件服务
* nodemailer-smtp-transport, 用于兼容 nodejs 以及 Gmail

我们的后端总体是传统的 MVC 架构

### Webpack

我们的后端使用了 Webpack 作为打包工具, 配置了总共 `base.js`, `dev.js`, `prod.js` 三个配置文件, 用于支持开发环境和生产环境的不同需求

我们还对 Webpack 集成了 `TerserWebpackPlugin`, 优化打包大小, 以及热重载插件 `nodemon`, 转译插件 `babel` 等优化体验的工具

由于某些原因, 我们的 webpack 配置文件目前还是 `js`, 之后会改为 `ts`


### Babel

我们的后端使用了 babel 将 js module 的引入由 `require` 变为了 `import`, 并且使其适配更健壮

### Koa

Koa 框架是一个 `Nodejs` 的后端框架, 使用它的目的是 `Koa` 听起来像 `Koi` 所以比较萌

我们对其进行了全面的 `Typescript` 支持

我们使用了以下的中间件

* koa-body, 解析请求体
* koa-combine-routers, 结合 koa-router
* koa-mount, 挂载目录
* koa-route, koa 路由
* koa-static, koa 静态托管
* koa2-connect-history-api-fallback, 页面刷新 404

### Typescript

我们后端的 `src` 资源文件夹全面支持 `Typescript`, 主要体现在以下几个方面

* Interface
* Class. private
* as. 类型断言
* declare module

我们使用了 `@types` 安装了许多相关 `node package` 的类型

### Redis

我们集成了 `Redis` 作为了缓冲数据库, 提升性能, 项目中使用了更适合我们使用场景的 `ioredis`

redis 的配置文件主要位于 `src/config/redisConfig.ts`

我们封装了常用的 `get`, `set`, `del` 操作, 用于在其它地方使用 redis

在项目中，我们的 redis 主要用于邮箱验证码缓存，单点限流 (单用户多次操作限制)

### Mongoose

Mongoose 是一个 `Nodejs` 中用于操作 `mongodb` 的驱动，或许您可能了解 `ORM` ，`mongoose` 就好比 `Hibernate`, `MyBatis` 之类的东东

我们的项目在 `src/model` 文件夹中定义了 `Mongoose` 的 `schema`, 并使用 `Typescript` 规范了其 types

### Mongodb

Mongodb 是一个非关系型数据库, 由于是 Web 论坛, 并且使用 `Nodejs` 作为后端, 使用 `Mongodb` 是一个合理的决定

在项目中, 我们使用 `Mongoose` 操作 `Mongodb`, 这个配置位于 `src/db/connections.ts`

我们使用了 `dot-env` 来安全地读取环境变量, 所以 `mongodb` 的链接、端口等位于项目根目录的 .env 文件中

### JWT

我们是登陆制的论坛, 目前不开放浏览, 后续会开放浏览。对于用户的鉴权，我们使用 `JWT` 作为鉴权手段

我们使用了 `access-token` 和 `refresh-token` 两个 `token` 作为安全的访问手段, 用户在登陆后会获取 `token`, `token` 会在后端存储在 `redis` 中

### Bcrypt

将用户的密码直接保存在数据库中是糟糕的实践，我们将用户的密码使用 `bcrypt` 加密存放在数据库中，增强安全性

### Nodemailer

用户的注册、找回密码等操作都需要邮箱验证，我们使用了 `nodemailer` 结合 `Gmail` 实现了邮件发送, 用在邮件服务中

### Sharp

用户的更改头像需要修改大小, 转换压缩等操作，我们使用了 `sharp` 处理用户的图片

