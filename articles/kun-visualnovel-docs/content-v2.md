# KUN Visual Novel Documentation V2 | 鲲 Galgame 开发文档 Version 2

::: tip

本文档为 Nuxt3 第二版本论坛实现，是目前 `kungal.com` 上线的版本，下面为第一版本 Vue3 + Koa 技术栈实现的论坛开发文档

[鲲 Galgame 论坛 Version 1 文档](content-v1)

12 / 25 / 2023，我们开始编写项目的重构文档

**注意，Version 2 版本文档有大量的内容依赖于 Version 1，如果可以的话，可以先看看 Version 1 的文档**

:::

## 项目重构

我们把原来写好的论坛，使用了 `Nuxt3` 框架进行了完全的重构，使其变得更加优秀。

* [为什么要重构 Vue3 的项目](v2/introduction/refactoring)
* [Nuxt3 项目结构总览](v2/introduction/structure)
* [如何运行本项目](v2/introduction/run)
* [Nuxt3 项目配置](v2/introduction/config)

## 重构过程

* [新建 Nuxt3 项目并集成依赖](v2/refactoring/setup)
* [如何将 Vue3 项目迁移到 Nuxt3](v2/refactoring/migration)

## 要点概览

* [Nuxt3 项目路由](v2/overview/router)
* [Nuxt3 Socket.IO 实现实时聊天室](v2/overview/socket.io)

## 性能提升

* [Nuxt3 SEO 最佳实践](v2/performance/seo)
* [Nuxt3 首屏加载](v2/performance/load)
