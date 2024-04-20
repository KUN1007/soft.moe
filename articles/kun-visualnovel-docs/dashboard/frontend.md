# React + Antd 后台管理系统前端简介

## 项目简介

我们管理系统的前端使用了非常经典的 React / Antd 技术栈

对于该技术栈，在互联网上可以找到大量的参考，因此不会过多说明

对于为什么使用该技术栈，这是因为该技术栈开发极为快速，且 CSR 的渲染适用于对 SEO 没有要求的网站，用来写管理系统是一个十分方便的选择

## 项目结构

下面我们将会对项目的 `src` 文件进行描述

### src/api

本项目中所有的 API 请求都会放在这里，这是为了集中请求，方便管理

需要注意的是，我们有四个封装好的 fetch 请求函数 fetchDelete, fetchGet, fetchPut, fetchPost

这四个函数位于 `src/utils/request.ts` 文件中

对于这些请求函数，我们在下面的文档中有过详细介绍

[Fetch](/kun-visualnovel-docs/v1/frontend/fetch)

### src/error

该文件非常简单，它的作用是当用户登陆过期时将用户导航到登陆页，错误时则输出错误信息

我们使用了 `window.history.pushState` 进行了组件外导航，因为 `react-router-dom` 似乎没有组件外的导航函数

如果您有更好的处理方法，欢迎联系我们

### src/layout

这是项目的布局，该布局是非常经典的 顶部导航栏 - 侧边栏 - 内容区 布局

关于该布局的编写，大部分截选自 Antd 的官网 - 布局 部分，可以直接查看 antd 的官网

### src/pages

这是项目的页面，该目录设计的非常直观，每一个文件夹就是每一个页面

其中的 `index.tsx` 则是每个页面的入口文件

### src/router

这是项目的路由，为了简单起见我们当前并没有将路由拆分到每个单独的目录中（类似于我们 Version 1 论坛 Vue3 项目的路由）

我们采用了路由懒加载，在点击进页面的时候才会加载该页面的代码

懒加载的逻辑主要在 `src/router/utils/lazyLoad.ts` 文件中

### src/store

这是项目的 store，该 store 目前只有用户的 store

我们的 store 使用了 `zustand` 作为 store，因此相关的方法全部遵循 `zustand` 官网的实践

由于用户的 store 需要持久存储，所以我们引入了 `persist` 这个 `zustand` 的中间件

后续我们或许会添加 `immer` 与 `zustand` 进行配合

### src/styles

本项目使用了 `tailwindcss` 和 `postcss` 来编写样式，因此该文件编写了部分 `tailwindcss` 的配置，以及一些预设样式

### src/types

该文件夹为本项目的 TypeScript 类型声明文件夹

目前，里面仅存放了少量公有的类型

### src/utils

该文件夹存放了部分项目部分的工具函数

### App.tsx

该项目的根组件，提供项目的基本配置，主题等

## 组件简介

本项目我们没有手写 UI，而是采用了现成的 UI 库，因为这是管理系统，不需要太过新颖的 UI，能用就可以

因此，项目的组件编写有大量涉及 Antd 的写法，这意味着查看 Antd 官网的文档将会非常容易理解项目

需要注意的是，由于我们的开发团队缺少 React 的开发经验，所以我们的代码不是最佳实践，如果您有更好的写法，欢迎 Pull Request，或者联系我们
