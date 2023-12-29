# KUN Visual Novel Documentation

[KUN Visual Novel Forum](https://kungal.com), [鲲 Galgame 论坛](https://kungal.com) - 开发文档

## 概览

KUN Visual Novel (鲲 Galgame) 是一个 Visual Novel (Galgame) 论坛。它的设计初衷在于营造出一个和谐的、自由的讨论氛围，它的宗旨是

* 世界上最萌的 Galgame 论坛！
* 鲲 Galgame 以营造最良好的氛围为理念
* 鲲 Galgame 永远不会有广告
* 鲲 Galgame 永远不会收费

但是，它绝不是一个单纯的论坛，我想，它会在之后的版本更新出大量方便的功能，并与其他的 Galgame 网站进行合作，变成一个更加庞大、丰富、萌萌的 Galgame 集群。

**请注意，这里的萌萌代表世界上一切美好事物的集合，萌萌即美好**

## 目录

开发文档过多，下面以目录的形式展示

### 项目概述

* [项目目的和背景](overview/purpose)
* [技术栈介绍](overview/tech-stack)
* [主要功能和模块概览](overview/features)

### 开发环境配置指南（Node.js、Vite、Webpack等）

* [开发环境配置要求](configuration/setup)
* [数据库（MongoDB）和缓存（Redis）的安装和配置](configuration/db)

### 前端

* [Vite](frontend/vite)
* [Vue3](frontend/vue3)
* [Pinia](frontend/pinia)
* [Router](frontend/router)
* [Fetch API](frontend/fetch)
* [SCSS](frontend/scss)
* [i18n](frontend/i18n)
* [localforage / Indexdb](frontend/indexdb)
* [Milkdown](frontend/milkdown)

### 后端

* [Koa](backend/koa)
* [MVC](backend/mvc)
* [Route](backend/route)
* [MongoDB / Mongoose](backend/mongodb)
* [Redis](backend/redis)
* [JWT](backend/jwt)

### 部署

* [生产环境的配置指南](deploy/deploy-config)
* [构建前端和后端的指令或脚本](deploy/script)
* [数据库和缓存的部署和配置](deploy/db)
* [安全性考虑和最佳实践](deploy/security)
* [维护与扩展](deploy/maintenance)

### 代码结构和架构说明

* [前后端交互接口文档](structure/api)
* [数据库字段含义说明](structure/db)
* [错误处理](structure/error)

### 常见问题和解决方案

* [常见问题](issue/issue)

### 更新日志

* [记录每个版本的更新内容和改动](update/log)

## 非技术文档

上面的开发文档全部是技术相关，如果有朋友没有一定 Web 开发基础的话可能看不懂

因此，下面我们将从一般人，或者**产品经理**的角度出发，说一下这个论坛是被如何开发出来的

* [确定目标](others/aim)
* [分析、构思、设计](others/analyze)
* [拟定方案](others/all)
* 代码编写
* [网站维护](others/maintenance)

代码编写的角度技术文档说的很明白了，里面踩了无数的坑，代码经验是真真正正从零到一打拼出来的，看完会有收获的

截止到 12 / 14 / 2023，终于把目录上的各个方面全部写完了，但是还有很多没有写出来的，如果有任何的不懂，或者有想法，请联系我们

## 项目重构

12 / 25 / 2023，我们开始编写项目的重构文档

我们把上面写好的论坛，使用了 `Nuxt3` 框架进行了完全的重构，使其变得更加优秀。

### 重构概述

* [为什么要重构](refactoring/refactoring)

### 重构过程

* [新建 Nuxt3 项目并集成依赖](refactoring/setup)
* [迁移 Vue3 项目](refactoring)

### 性能展示

* SEO
* 首屏加载

## 未来前瞻

* [鲲 Galgame 论坛未来的计划是什么](future/plan)

## 发点牢骚？

不存在的。

难受的设计开发维护工作就交给我们吧，其他不好的东东也交给我们。

希望建好这个论坛之后，可以有人去用，分享自己的萌萌（美好），这就是对我们的最大支持了！

谢谢！
