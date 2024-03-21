# 如何将 Vue3 项目迁移到 Nuxt3

需要说明的是，这一方面较为良好的实践是直接看我们在 GitHub 的 commit 记录，它会记录我们是怎么样将项目一步步的变成这样的

https://github.com/KUN1007/kun-galgame-nuxt3/commits/master/

## 迁移前端

我们不会细说代码到底怎么变更了，我们会指出项目目录是如何被更改到 Nuxt 的

首先，要明确的是，在原来的 Vue3 项目中，代码主要集中在 `src` 这个文件夹

在重构项目中，这些 src 中的代码均被迁移到了 Nuxt3 项目根目录的部分文件夹

我们参考 Vue3 的项目，依次分析这些文件夹

下面的 A -> B，表示从 Vue3 -> Nuxt3，@ 表示 Vue3 项目的 src 目录，Nuxt3 的根目录

### @/src/api -> @/server/api

我们在前面的项目中，我们提到了

> 原来 Version 1 文档所说的 `route`, `Controller`, `Service`，现在通通合在一起了

这就是合在一起的 api

### @/src/assets -> @/assets

### @/src/components -> @/components

### @/src/directives -> @/plugins

### @/src/hooks -> @/composables

### @/src/language -> @/language

### @/src/layout -> @/components/kun/Layout.vue

前面也提到了，我们将原来的 layout 全部转为了这一个组件，这就是该组件

### @/src/router -> 

这里的路由需要注意，该路由在 Nuxt3 项目中并无直接体现

但是，我们前面提到过 Nuxt3 项目中的 `@/pages` 文件夹

> 该文件夹的结构一一对应我们项目整体的路由，关于该文件夹请查看 Nuxt3 官网对于路由的介绍

这就是 Nuxt3 的路由，它包含了我们在 Vue3 项目中 `@/src/router` 配置的一切

对于路由守卫，可以在 Nuxt3 项目中的 `@/middleware` 中体现

### @/src/store -> @/store

### @/src/styles -> @/assets/css

### @/src/types -> @/types

### @/src/utils -> @/utils

### @/src/views -> @/pages

### @/App.vue, @/index.ts -> app.vue

在 Nuxt3 的项目中，没有 index.ts 的体现

这一点被 Nuxt3 自己在背后做到了，关于这一点可以查看官网

## 迁移后端

我们在前面提到了多次，Nuxt3 的后端就是根目录中的 `server` 部分，接下来我们对其进行介绍

我们以原来 Version 1 的 Koa 后端进行参考

下面的 A -> B，表示从 Vue3 -> Nuxt3，@ 表示 Koa 项目的 src 目录，Nuxt3 的根目录

### @/config -> @/server/env, @/server/plugins

原来的 Koa 项目中，`config` 用于环境变量的读取和 Redis 的连接

在我们当前的 Nuxt3 项目中

* env 环境变量可以在 @/server/env 读取，这里的读取指的是 server 读取。使用 `useRuntimeConfig()` 读取也是可以的，只是后端有些情况下会读取不了
* Redis 的连接被我们迁移到了 @/server/plugins 中，这也是官方推荐的做法

### @/controller -> @/server/api

我们前面的文档提到过多次，这里不再多说

### @/db -> @/server/plugins

这里主要的操作是连接 `MongoDB`，我们也对其进行了迁移，符合 Nuxt3 最佳实践

::: info

我们当前的项目有一个 BUG，现在对其进行描述

请看我们当前项目的 `@/server/api/home/topic.get.ts`，我们在 BUG 的上方做了 `TODO` 标记

> Schema hasn't been registered for model 'user'

该问题似乎是在网站第一次加载主页话题的时候，`user` 这个 model 还没有被加载到 Nuxt3 的应用中

这造成的后果是主页话题没有被加载，但是当随机访问完任何一个和 `user` model 有关的 API 时，主页的话题就会被加载

我们目前采用的，不优雅的解决方案是在加载主页话题时进行一次空查询，使 `user` 这个 model 被加载

但是，令人困惑的是，经过我们的研究，在请求 `topic.get.ts` 这个 API 时，`user` 这个 `model` 已经被加载，因为我们成功的在第一次请求时获取到了 user model

我们甚至了解到，在整个 Nuxt3 应用被启动时，整个 `@/server/model` 中的 `model` 就会被自动加载到应用中

在这样的环境下，依然会报错，这让我们难以理解，如果您知道这是哪里的问题，请一定要评论，或者直接联系我们！谢谢！

:::

### @/error -> @/server/utils/kunError

### @/middleware -> @/server/utils/increasingSequence

increasingSequence 这个函数其实属于数据库相关的函数，作用我们在 Version 1 的文档讲过了，本次我们将其放在了 utils 中

值得注意的是 `auth` 中间件，在原来的应用中，我们对除了白名单之外的所有路由都进行了中间件鉴权，这导致了我们的论坛不登陆是不能使用的

但是，对于一个论坛而言，不登陆不能使用意味着闭合、封闭，这和我们开放的理念不符

本次版本中，我们开放了大部分的应用接口，这意味着免登陆也可以查看论坛的大部分内容，只是无法发布内容和点赞等

所以，鉴权中间件体现在了我们重构后的应用整体，只对需要鉴权的 API 鉴权，鉴权手法也是类似的

我们使用 `@/server/utils` 中的 `getCookieTokenInfo` 获取 `cookie` 中的 token payload，我们一旦获取到了 payload，这就证明用户是有效的

这种 JWT 鉴权在 Version 1 的文档中被详细介绍过，这里不再介绍

### @/models -> @/server/models

### @/routes -> @/server/api

在 Nuxt3 中，server 端的 API route 也是基于文件目录的，这意味着文件路径即为请求路径

### @/service -> 

我们提到过多次 Controller 和 Service 等合并的问题了

### @/types -> @/types

我们在前面的文档中提到过，我们使用了 `nuxt-typed-router` 这个包，它会自动生成路由类型

所以我们的 types 只是为了更加规范

### @/utils -> @//server/utils

### @/index.ts ->

前面提到过，在 Nuxt3 的项目中，没有 index.ts 的体现，这一点被 Nuxt3 自己在背后做到了

这一点在 server 中也是一样的，关于这一点可以查看官网

