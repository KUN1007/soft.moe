# Route

前端有路由，后端当然也有，前端发送请求的那一串地址的指向，这就是后端定义的路由

本项目我们使用了 `koa-router` 作为 Koa 应用的路由，这是 Koa 官方的路由

## 介绍

我们的路由主要文件夹位于后端项目的 `src/routes` 文件夹下，它的结构为

* modules. 不同的路由
* routes.ts 路由的索引文件

我们在 `src/index.ts` 入口文件引入了 `routes.ts` 导出的路由配置函数，来使用 `koa-router`

### koa-combine-routers

在 `routes.ts` 中我们使用了 `koa-combine-routers` 这个包来将 `modules` 文件夹下的目录进行结合

传统的 `koa-router` 需要在 `index.ts` 文件中多次调用 `koa-router` 来使用路由，比较麻烦，使用了这个包之后只需要 `app.use()` 就可以搞定，非常方便

## REST API

REST API 是一种 API

