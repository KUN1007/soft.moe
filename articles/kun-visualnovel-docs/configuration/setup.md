# 开发环境配置要求

## 前端

## 概览

前端项目需要电脑具有 `nodejs` 环境

我们推荐使用 [`NVM`](/technology/frontend/kun-frontend#作为一名-web-开发人员-学习路线是什么) 安装 `Node`

## 配置

前端项目的基本请求变量位于 `.env.development` 文件中

项目根目录中还应有一个 `.env.production` 文件, 配置与 `.env.development` 文件相同

## 安装启动

电脑安装 `Nodejs` 后, 我们推荐全局安装 `pnpm`

```shell
npm i -g pnpm
```

::: tip
注意，我们项目使用最新技术栈，保证与最新版本的包兼任，您无需担心包版本问题
:::

接着使用以下步骤启动项目

```shell
git clone https://github.com/KUN1007/kun-galgame-vue
cd kun-galgame-vue
pnpm i
vite dev
```

项目默认会在 `127.0.0.1:1007` 这个地址启动，可以去 `vite.config.ts`  文件中自行调整端口

如果没有错误，您会看到控制台输出以下成功信息

::: info
  VITE v4.3.8  ready in 243 ms

  ➜  Local:   http://127.0.0.1:1007/
  
  ➜  press h to show help
:::

::: tip
Vite 目前更新到 5 了, 但是我还没研究过，以后会更新
:::

## 后端

### 概览

后端项目需要电脑具有 `Nodejs`, `Mongodb`, `Redis` 环境

我们依然推荐使用 [`NVM`](/technology/frontend/kun-frontend#作为一名-web-开发人员-学习路线是什么) 安装 `Node`

我们推荐安装 `Mongosh` 作为 `Mongodb` 的 shell, 您可以根据自己的喜好选择是否安装 `Robo3T` (`Mongodb` 的 `GUI` 工具)

我们推荐安装 `RedisInsight` 作为 `Redis` 的 GUI 工具，更加方便，当然您可以直接用 `redis-cli` 操作 redis

## 配置

我们使用了 `dotenv` 来读取环境变量，您需要根据 `.env.example` 文件中的配置项目, 新建一个 `.env` 文件，在 `.env` 文件中配置自己的配置

## 安装启动

电脑安装 `Nodejs` 后, 我们推荐全局安装 `pnpm`

```shell
npm i -g pnpm
```

接着使用以下步骤启动项目

```shell
pnpm i
pnpm dev
```

如果没有错误, 您会看到控制台输出以下成功信息

::: info
webpack 5.89.0 compiled successfully in 2949 ms

[nodemon] 3.0.1

[nodemon] to restart at any time, enter `rs`

[nodemon] watching path(s): dist/kun.js

[nodemon] watching extensions: js,mjs,cjs,json

[nodemon] starting `node dist/kun.js`

server is running on http://127.0.0.1:10007

redis: 127.0.0.1:6379 connection successful! 

MongoDB: mongodb://127.0.0.1:27017/kungalgame connection successful!
:::

