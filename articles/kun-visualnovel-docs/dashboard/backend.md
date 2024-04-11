# Koa 后台管理系统后端简介

## 项目简介

我们管理系统的后端是经典的前后端分离式开发，该后端服务于管理系统前端

该后端非常类似于我们 Version 1 论坛版本的后端，所以**具体开发细节完全可以参考 Version 1 论坛的后端文档**

我们在开发该管理系统后端时，直接将论坛的后端 copy 了一份，然后进行了部分的更改，这就是目前的管理系统后端

## 项目结构

如果已经看过前面的启动项目，那么应该已经知道项目的启动过程，建立了自己的 .env 文件

### 入口点

对于我们目前的 Koa 项目，它的入口点在 `src/index.ts` 文件

对于该文件，和下面的文档描述基本一致

[Koa的基本使用和中间件配置](../v1/backend/koa)

我们项目的结构已经囊括在了该文档中，不再赘述

## 项目区别

管理系统的后端项目，和论坛的后端项目相比，有两点主要区别

### JWT

本项目不再使用双 Token 机制，因为管理系统的使用人员受信任，不需要过多约束

关于双 Token 刷新机制，可以查看下面的文档

[SSO 与 OAuth 2.0 # 双-token-认证](/technology/backend/kun-sso-oauth#双-token-认证)

取而代之的，仅发放一个 token，用于用户鉴权，有效期为 7 天

### 响应处理

在我们 Version 1 论坛项目的后端中，响应处理会在每一个 `Controller` 中被定义返回

这造成了大量的代码和逻辑冗余，因此我们在本项目中统一处理响应，避免了大量的代码冗余

原来的处理

``` TypeScript
    ctx.body = ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
```

当前使用了一个 `response` 中间件，它位于 Koa 管理后端项目的 `src/middleware/response.ts` 文件

``` TypeScript
import { type Context, type Middleware } from 'koa'

export const kungalgameResponseMiddleware = (): Middleware => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()

      if (ctx.status === 233) {
        return
      }

      ctx.status = 200
      ctx.body = {
        data: ctx.body,
        code: 200,
        message: 'OK'
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: ctx.message || 'ERROR',
        data: {}
      }
    }
  }
}
```

可以看到该相应处理文件将所有 `Controller` 分为了三种，200, 233, 500

对于 200，这是所有成功的相应，我们目前所有成功的响应均被定义为 200

对于 233，这是所有已知错误的响应，它会和 `app.emit` 配合，交付给前端一些错误代码。233 这个响应是我们自定义的

对于 500，这是所有错误的相应，这意味着可能发生了我们预料之外的错误

### 其他区别

我们的管理系统需要留下操作记录，因此，为部分 `Controller` 编写了记录功能

例如

``` TypeScript
    await AdminInfoService.createAdminInfo(
      user.uid,
      'post',
      `${user.name} created a todo\nContent: ${contentEn}`
    )
```

另外，我们的管理员受到信任，因此缺失了很多检测用户输入是否合法的逻辑，这是为了简单起见
