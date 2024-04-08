# 如何运行本项目的前后端

## 环境要求

本项目前端要求电脑上必须安装 `Node.js` 环境，建议 `Node.js 18` 以上

本项目后端要求电脑上必须安装 `Node.js`, `Redis`, `MongoDB` 环境

同时，我们建议使用 `NVM` 作为 `Node.js` 的版本管理器，`pnpm` 作为包管理器

安装方法请自行 Google

## 前端项目启动

首先，使用 git clone 前端项目

``` shell
git clone https://github.com/KUN1007/kun-galgame-admin-react-swc
```

打开本项目，可以看到项目根目录有一个 `.env.example` 文件

``` yaml
VITE_KUN_ADMIN_URL = http://127.0.0.1:10007/api
```

该文件是前端项目的配置文件，需要根据该文件，**自行在前端项目的根目录新建一个 `.env` 文件，填写 `VITE_KUN_ADMIN_URL` 配置**

当然，直接将我们的 example 文件中的配置复制进 .env 也没有问题

然后，在编写完 `.env` 配置后，我们需要安装包

``` shell
pnpm i
```

之后，启动项目

``` shell
pnpm dev
```

若项目启动无误，将会看到终端有以下输出

``` shell
❯ pnpm dev                        

> kun-galgame-admin-react-swc@0.0.0 dev /home/kun/code/kun-galgame-admin-react-swc
> vite

  VITE v4.5.0  ready in 153 ms

  ➜  Local:   http://127.0.0.1:8888/
  ➜  press h to show help
```

需要注意的是，此时打开浏览器的 `http://127.0.0.1:8888/`，不能进入系统，因为需要该项目的后端启动，以及 Nuxt3 论坛项目

## 后端项目启动

首先，使用 git clone 后端项目

``` shell
git clone https://github.com/KUN1007/kun-galgame-admin-koa
```

同样，打开本项目，可以看到项目根目录有一个 `.env.example` 文件

``` yaml
# -----------------------------------------------------------------------------
# KUNGalgame APP - Backend app address and port
# -----------------------------------------------------------------------------

APP_HOST = 127.0.0.1
APP_PORT = 10007

# -----------------------------------------------------------------------------
# CORS - Some domain which can be cors
# -----------------------------------------------------------------------------

ALLOW_DOMAIN = [http://127.0.0.1:9999]

# -----------------------------------------------------------------------------
# Mongodb - Connect to mongodb
# -----------------------------------------------------------------------------

MONGO_HOST = 127.0.0.1
MONGO_PORT = 27017
MONGO_USER = root
MONGO_PWD = 123456
MONGO_DB = "kungalgame"

# -----------------------------------------------------------------------------
# Redis - Connect to redis
# -----------------------------------------------------------------------------

REDIS_HOST = 127.0.0.1
REDIS_PORT = 6379
REDIS_USERNAME = kun
REDIS_PASSWORD = 191007
REDIS_DB = 0

# -----------------------------------------------------------------------------
# JWT - JWT secret code, to generate token
# -----------------------------------------------------------------------------

JWT_ISS = kungalgame
JWT_AUD = kungalgamer
JWT_SECRET = kunisthecutest!
```

该文件是后端项目的配置文件，需要根据该文件，**自行在项目的根目录新建一个 `.env` 文件，填写配置**

关于配置的含义，注释已经写的很明了了，需要注意的是

* 如果本地的 MongoDB 有密码，需要将 `MONGO_USER` 和 `MONGO_PWD` 换为本地的用户密码
* 如果本地的 Redis 有密码，需要将 `REDIS_USERNAME` 和 `REDIS_PASSWORD` 换为本地的用户密码
* JWT_SECRET 等 JWT 配置可以自己更改，保持 example 的配置也可以运行，在此之前需要了解 JWT

直接将我们的 example 文件中的配置复制进 .env 也没有问题，也是可以运行的，只是不建议在生产环境如此配置

然后，在编写完 `.env` 配置后，我们需要安装包

``` shell
pnpm i
```

之后，启动项目

``` shell
pnpm dev
```

若项目启动无误，将会看到终端有以下输出

``` shell
❯ pnpm dev                  

> kun-galgame-admin-koa@1.0.0 dev /home/kun/code/kun-galgame-admin-koa
> cross-env NODE_ENV=development webpack --watch --config ./config/webpack.config.dev.js

asset kun.js 379 KiB [emitted] (name: server)
runtime modules 937 bytes 4 modules
cacheable modules 67.8 KiB 58 modules
external "koa" 42 bytes [built] [code generated]
external "koa-body" 42 bytes [built] [code generated]
external "@koa/cors" 42 bytes [built] [code generated]
external "koa2-connect-history-api-fallback" 42 bytes [built] [code generated]
external "dotenv" 42 bytes [built] [code generated]
external "koa-combine-routers" 42 bytes [built] [code generated]
./src/routes/modules/ sync \.ts$ 726 bytes [built] [code generated]
external "node-schedule" 42 bytes [built] [code generated]
external "jsonwebtoken" 42 bytes [built] [code generated]
external "koa-router" 42 bytes [built] [code generated]
external "mongoose" 42 bytes [built] [code generated]
external "ioredis" 42 bytes [built] [code generated]
external "bcrypt" 42 bytes [built] [code generated]
webpack 5.90.2 compiled successfully in 2675 ms
[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): dist/kun.js
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node dist/kun.js`
redis: 127.0.0.1:6379 connection successful! 
MongoDB: mongodb://127.0.0.1:27017/kungalgame connection successful! 
```

此时，该管理后台的前后端可以正常联调

但是，**此时的 MongoDB 中应该是没有数据的，要在论坛项目注册用户才可以使用**，所以，请看下面的文档

[Nuxt 3 + React + Koa 跨项目开发指南](./guide)

