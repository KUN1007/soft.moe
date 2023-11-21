# 开发环境配置要求

## 前端

前端项目需要电脑具有 `nodejs` 环境

我们推荐使用 [`NVM`](/technology/frontend/kun-frontend#作为一名-web-开发人员-学习路线是什么) 安装 `Node`

电脑安装 `Nodejs` 后, 我们推荐全局安装 `pnpm`

```shell
npm i -g pnpm
```

接着使用以下步骤启动项目

```shell
git clone https://github.com/KUN1007/kun-galgame-vue
cd kun-galgame-vue
pnpm i
vite dev
```

项目默认会在 `127.0.0.1:1007` 这个地址启动，可以去 `vite.config.ts`  文件中自行调整端口

:::note
注意，我们项目使用最新技术栈，保证与最新版本的包兼任，您无需担心包版本问题
:::
