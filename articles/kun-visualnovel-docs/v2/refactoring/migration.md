# 如何将 Vue3 项目迁移到 Nuxt3

需要说明的是，这一方面较为良好的实践是直接看我们在 GitHub 的 commit 记录，它会记录我们是怎么样将项目一步步的变成这样的

https://github.com/KUN1007/kun-galgame-nuxt3/commits/master/

## 迁移前端

我们不会细说代码到底怎么变更了，我们会指出项目目录是如何被更改到 Nuxt 的

首先，要明确的是，在原来的 Vue3 项目中，代码主要集中在 `src` 这个文件夹

在重构项目中，这些 src 中的代码均被迁移到了 Nuxt3 项目根目录的部分文件夹

我们参考 Vue3 的项目，依次分析这些文件夹，我们使用 `@` 表示根目录

下面的 A -> B，表示从 Vue3 -> Nuxt3

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

### @/src/router -> 

这里的路由需要注意，该路由在 Nuxt3 项目中并无直接体现

但是，我们前面提到过 Nuxt3 项目中的 `@/pages` 文件夹

> 该文件夹的结构一一对应我们项目整体的路由，关于该文件夹请查看 Nuxt3 官网对于路由的介绍

这就是 Nuxt3 的路由，它包含了我们在 Vue3 项目中 `@/src/router` 配置的一切

对于路由守卫，可以在 Nuxt3 项目中的 `@/middleware` 中体现

