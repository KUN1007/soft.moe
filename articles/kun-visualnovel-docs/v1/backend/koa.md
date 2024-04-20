# Koa 的基本使用和中间件配置

## 介绍

`Koa` 是一个 Nodejs 后端框架，[官网地址](https://koajs.com/)

我们本项目的后端使用 Koa 编写，并集成了 Koa 的各种特性，例如 `Application`, `Context`, `Request`, `Response` 等，这些内容官网都有详细介绍

## 项目结构

首先看到项目根目录

* .vscode vscode 配置文件。我们使用了 `cSpellCheck` 这个 vscode 插件，用来检查单词拼写错误，这是一些字符的定义
* config `Webpack` 的配置文件
* docs 一些项目文档和说明
* scripts 线上有时候需要操作数据库，例如给用户 schema 新加一个 field，这是一些常见操作
* src 项目代码
* uploads 静态资源上传文件夹

再看到项目的 src 文件夹

* config. `dotenv` 和 `redis` 的配置文件夹
* controller. 控制层
* db. `mongodb` 数据库的连接文件夹
* error. 统一的错误处理及定义
* middleware. `Koa` 自身的中间件
* models. `Mongoose` 的 `Model` 定义文件夹
* routes. Koa 路由
* service. 服务层
* types. 某些全局的类型定义
* utils. 某些工具函数
* index.ts `Koa` 应用的入口文件

## 使用

由于本项目中我们集成了 `webpack` 等打包工具，因此为了方便起见，我们 `Koa` 的所有代码均在 `src` 文件夹下

请看到 `src/index.ts` 文件，这个文件是一个 Koa 项目的入口点

```typescript
import Koa from 'koa'
import env from '@/config/config.dev'
import router from '@/routes/routes'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import serve from 'koa-static'
import mount from 'koa-mount'
import historyApiFallback from 'koa2-connect-history-api-fallback'
import { kungalgameAuthMiddleware } from '@/middleware/authMiddleware'
import { useKUNGalgameTask } from '@/utils/schedule'
import { kungalgameErrorHandler } from '@/error/kunErrorHandler'
```

### Koa

Koa 是 Koa 实例的构造函数，用于创建一个 Koa 实例并返回

我们使用到的方法有

* app.proxy 开启 Koa 的代理
* app.use() 使用 Koa 中间件
* app.on() Koa 出现错误时处理错误
* app.listen 指定 Koa 实例监听的端口

需要注意到 `app.proxy`，这是因为我们使用了 `nginx` 进行反向代理，所以需要在 `Koa` 应用中开启代理才可以识别到用户的 `ip`

### env

env 是 `dotenv` 这个库的配置文件，这个库的作用是读取项目根目录下的 `.env` 文件中的变量

读取后我们可以使用这些变量，用来掩盖一些敏感信息不在代码中出现，例如账户密码，JWT Secret 等

### router

Koa 应用的路由

### KoaBody

请求的 Body 需要经过解析之后才能拿到 Body 中携带的信息，这是 Koa 解析请求体的中间件

```typescript
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: env.TEMP_FILE_PATH,
      keepExtensions: true,
      maxFieldsSize: 1007 * 1024,
    },
    onError: (err) => {
      console.log('koa-body: err', err)
    },
  })
)
```

注意到我们这里配置了 `multipart`, 这是为了启用 `formidable`

一般在 `Nodejs` 后端中, `FormData` 需要经过特殊处理才能拿到，这就要用到 `formidable`

我们这里的配置就是制定了一个 `FormData` 的上传文件夹，并保持扩展名，限制最大文件大小

### cors

这是 Koa 用于处理跨域的包，需要注意这个包要安装 ts 的声明文件才能支持 ts

### serve, mount

为了挂载一个 `uploads` 文件夹作为 `Koa` 的文件上传目录

```typescript
app.use(mount('/uploads', serve('./uploads')))
```

本项目用户头像也存放在这里

### historyApiFallback

解决前端页面刷新 404 的问题，这个问题出现的原因是由于前后端路由不匹配导致的

但是我们目前是使用了 Nginx 反向代理解决的，这个中间件似乎没有用

我还尝试了其他几个 `historyApiFallback` 的中间件，因为有好几个类似的 `npm` 包，但是都没有用，奇怪的是在 `express` 中我可以这么解决刷新 404 的问题

### kungalgameAuthMiddleware

自己编写的鉴权中间件，使用了 jwt 作为基本的鉴权手段

### useKUNGalgameTask

定时任务，这是包的作用是每天定时执行某个任务

本项目中用来在每天晚上 12: 00 来重置用户发表的话题数量

### kungalgameErrorHandler

错误处理，用来捕获全局的已知错误

