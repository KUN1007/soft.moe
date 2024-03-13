# Nuxt3 项目结构总览

::: tip

截止本文档目前编写的日期 3 / 12 / 2024，网站的版本为 2.5.17

这已经是一个非常新的项目了，下面我们以 2.5.17 版本为例介绍项目结构

:::

## Nuxt3 官方项目结构介绍

我们严格遵循官网推荐的最佳实现进行项目组织，并在其上针对我们的论坛应用进行扩展

https://nuxt.com/docs/guide

下面我们从上到下一个一个介绍项目的目录

## .husky

这是 husky 的目录，husky 官方对其描述为

> Husky enhances your commits and more woof! Automatically lint your commit messages, code, and run tests upon committing or pushing. 

为什么我们要用到 husky？

我们有一个需求，在每次代码提交时将 `package.json` 中的 `version` 增加 0.0.1

根据这个需求，我们需要在 git 的 `pre-commit` 这个 hook 中执行某些代码，更改 `version` 字段

关于该需求可以看：[如何在提交时自动更新项目的版本号](/technology/frontend/kun-precommit)

## .nuxt

这是 nuxt 的工程文件，内部含有 nuxt 运行时必要的类型推断，hot reload 等等，大多数情况不需要在意

需要注意的有三点

* 在使用 pnpm i 的时候，安装完 `node_modules` 之后会执行一个 `nuxt prepare` 命令，这个命令会自动生成一个 `.nuxt`  文件夹，以便类型推断等开发操作
* 开发时可能碰到页面卡住，写的对但是浏览器报错的情况，除了完全清除浏览器缓存之外，还应该彻底删除 `.nuxt` 文件夹，重新启动项目，因为内部有 Nuxt 的开发缓存
* 在 `.gitignore` 等文件中忽略该文件夹（Nuxt 已经自动做好了）

## .vscode

我们偏好使用 Visual Studio Code 作为开发工具，这是我们在开发中的一些配置

内部含有生词查错，插件定义等配置，如果使用 JetBrains 等 IDE，不必在意

## assets

这是我们项目的静态资源文件夹，请看官网的项目目录介绍

我们有两个文件夹

### css

这是本项目一些常用的样式文件夹，例如编辑器样式，主题颜色配置等等

* editor. 这是本项目编辑器代码块颜色的配置
* effect. 一些 css 特效，例如话题被推后的样式
* theme. 论坛的主题颜色文件
* tooltip. 论坛的 tooltip 实现
* index.scss 论坛的 css 资源索引
* reset.scss 预设样式，清除某些默认样式

### ren

我们论坛的看板娘名字叫 `レン`（Ren），出自游戏 `枯れない世界と終わる花`，这是她的 JSON 资源配置文件

我们的看板娘使用了游戏内的基本配置拼合得到，目的是为了得到更多的表情和更良好的性能

该文件使用 `GARBro` 解包，并由我们修改得到，该资源的版权属于公司 `SWEET&TEA`

[游戏官网](http://sweet.clearrave.co.jp/)

## components

我相信您已经看过我们 V1 的文档，并有足够的组件化编程经验，该文件夹是项目的核心，为我们的组件文件夹

需要注意的是，在原来的项目中，`components` 是所有的全局组件

但是，在本 Nuxt3 重构的项目中，`components` 文件夹不止含有全局组件，还含有其余所有页面的各种组件

### kun

该文件夹是 `components` 的核心，内部有一些我们的核心组件，大多数在我们 Version 1 文档已经极为详细的介绍过，这里不再赘述

我们来介绍几个本次新增的全局组件

* message. 全局消息的组件
* Blank.vue 空白页的组件
* Layout.vue 本项目的布局文件夹（我们没有采用 NuxtLayout，因为采用之后页面会因为未知原因在水合时抖动，造成 CLS 过大）
* Switch.vue 这是通用的 `Switch` 组件

### 其他文件夹

除了 `kun` 文件夹之外的其他文件夹都一一对应 `pages` 文件夹中的页面，为那些页面的组件

## composables

这是某些可组合函数，关于该文件夹的用处依然可以在 Nuxt 官网的目录结构介绍在看到

这类似于我们原来项目的 `hooks` 文件夹，都是以 `use` 开头的函数，它们是通用的、可组合的

熟悉 `React` 的朋友们可能更为理解这些函数的命名

## error

本项目的错误处理，该错误处理主要是将已知错误输出，不涉及页面级别的处理，例如 `<NuxtErrorBoundary/>`

我们的错误处理完全实现了 i18n

## language

这是我们项目的 i18n 语言资源文件夹

和原来项目有所不同，目前的资源文件没有使用 Typescript 导出对象，而是直接使用了 json 文件，i18n 的配置在项目根目录的 `nuxt.config.ts` 文件中

这样的做法更符合 `nuxt-i18n` 的设计，并且可以给 vscode 的 `i18n-ally` 插件提供更加良好的补全

## middleware

这是项目前端部分的中间件配置，用于页面的鉴权

例如，在用户未登录时，访问不可访问的页面将会被跳转到登陆页面

## modules

modules 的配置极为复杂，涉及到 Nuxt 本身的开发，我们不会详细解释这部分的内容，有能力的朋友可以自己查看

::: tip

到目前的项目（2.5.17），我们有一个问题没有解决

如何使用 pm2, socket.io 多实例部署项目，目前的项目是 pm2 单实例部署，没有达到多核服务器应有的性能

我们将 socket.io 上面所写的方法全部实验了一遍，但是多实例配置 pm2 之后上线会导致 socket.io 连接失败，pm2 的配置文件在根目录的 `ecosystem.config.js` 中

如果有朋友知道如何处理，恳请联系我们，或者直接给我们 pull request

:::

本项目截至目前只用到了这一个 module，目的是为了在 Nuxt3 项目中使用 `socket.io` 这个库实现实时通知效果

它包含有 `websocket`，但是相对于 `websocket` 具有更好的兼容性，并且提供了更多的功能

我们之后会据此创建用户之间的私聊功能

## pages

该文件夹的结构一一对应我们项目整体的路由，关于该文件夹请查看 Nuxt3 官网对于路由的介绍

## plugins

这是本项目所用到的插件，就是原来 Vue 项目中所说的 `Directives`

* fontPlugin. 字体配置插件，目的是为了覆盖网站整体的字体，防止初始状态水和时，页面抖动造成 `CLS` 过大
* tooltipDirective. 论坛的 tooltip 实现

## public

项目的公共静态资源文件夹，主要存放了项目的图片

除了图片之外，还有 robots.txt

## server

这是 Nuxt3 的服务端所在的文件夹，这是重中之重，相当于原来项目的后端

关于该文件夹请先看 Nuxt3 官网的介绍

### api

定义了该项目所有的 api，相当于原来 Version 1 文档所说的 `route`, `Controller`, `Service`，现在通通合在一起了

### env

环境变量读取相关的文件夹

尽管 Nuxt3 自带了 `.env` 文件的读取功能，但是某些时候直接读取 env 文件是一个良好的实践，可以省去很多麻烦

### models

mongoose model 的定义，和 Version 1 文档一样，变更了部分 field 的名称

### plugins

后端项目的插件，目前用于 mongodb 和 redis 的连接

### socket

socket.io 配置使用相关的文件夹

### utils

某些后端通用的函数文件夹，目前有

* checkBufferSize. 检查 buffer 的大小，用户检查用户上传的图片大小
* generateRandomCode. 生成随机英文或数字的验证码
* getCookieTokenInfo. 获取 token 载荷中包含的用户信息
* getRemoteIp. 获取 ip
* increasingSequence. 在 mongoose model 保存时固定将某个字段 +1，例如 uid
* jwt. JWT 相关操作
* kunError. 自定义错误返回响应
* message. 创建用户通知相关的函数
* sendVerificationCodeEmail. 发送邮箱验证码
* tag. 话题或者回复的标签相关操作
* uploadImage. 上传图片
* verifyVerificationCode. 验证邮箱验证码

本项目我们自认为写的非常易懂，看一眼就知道是什么功能了

### tsconfig.json

后端项目 ts 配置，不必理会

## store

Pinia 的 store 定义，重构项目中我们依旧采用了 Pinia 作为项目的 Store，项目结构和原来 Version 1 文档一致

有所不同的是，对于 Pinia 的 persistedstate，我们采用了 `Cookies` 的形式存储，而不是 `localStorage`

由于 Nuxt3 的 SSR 特性，在服务端渲染的时候是拿不到 `localStorage` 的，会导致页面抖动，水合不一致，而 `Cookies` 则通用的

## types

项目的某些类型定义，api 文件夹是部分接口的返回类型定义

由于我们使用了 `nuxt-typed-router` 这个包，所以路由会在编写代码时被自动补全，无需担心类型问题，这里只是为了更加规范

其余类型随便定义即可

## utils

这是我们前端项目通用的某些工具函数

* dataURItoBlob. 将 string 转换为 Blob
* debounce. 防抖
* errorHandler. 错误处理
* formatTime. 日期格式化
* formatTimeI18n. 日期 i18n 格式化
* markdownToText. 将 Markdown 转换为纯文本
* random. 随机数生成
* responseHandler. 全局通用响应处理，用于 `useFetch`
* throttle. 节流
* time. 获取已经经过的时间
* validate. 一些验证函数

## .env.example

这是我们项目所需环境实例文件，如果想要运行我们的项目，需要**根据该文件自行在根目录创建一个 `.env` 文件**，按照该文件的格式编写自己的环境配置

关于详细使用，请看下一篇

[.env.example](/kun-visualnovel-docs/v2/introduction/run#.env)

## .eslintignore

ESLint 忽略文件

## .eslintrc

ESLint 配置文件

## .gitignore

Git 忽略文件

## .npmrc

npm 配置文件，不用理会

## .prettierrc

Prettier 配置文件

## app.vue

项目的总入口文件，在这里我们初始化了基本的变量和配置

## ecosystem.config.js

pm2 的配置文件

## LICENSE

项目 GPL V3 开源许可证书

## nuxt.config.ts

Nuxt3 的配置文件

关于详细使用，请看下一篇

[.env.example](/kun-visualnovel-docs/v2/introduction/config)

