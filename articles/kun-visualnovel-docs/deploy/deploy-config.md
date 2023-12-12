# 生产环境的配置指南

本项目目前是使用 `Nginx` 和 `pm2` 实现部署的，我们已经在后端项目中写好了 pm2 的配置文件

```javascript
const path = require('path')

module.exports = {
  apps: [
    {
      name: 'kun-galgame-koa', // Application name
      script: './dist/kun.js', // Startup script (compiled JavaScript file)
      cwd: path.join(__dirname), // Application directory
      instances: 1, // Number of instances to start
      autorestart: true, // Automatically restart
      watch: false, // Watch for file changes and auto-restart
      max_memory_restart: '1G', // Restart when memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production', // Set environment variable
      },
    },
  ],
}
```

注释已经说明了我们的配置

## 前端生产环境部署

我们将前端项目 clone 下来，安装好包，然后在终端执行 `vite build` 命令，前端的所有文件将会被打包进根目录的 `dist` 文件夹内

这个 `dist` 文件夹内目前应该含有以下内容

* kun. 资源文件夹，包含了打包后的 css 以及 js 等文件
* index.html 程序的入口文件
* robots.txt 爬虫的索引文件

部署的时候，需要将入口的 html 文件请求使用 nginx 转发给后端

## 后端生产环境部署

我们已经配置好了 `Webpack` 打包配置，需要做的是运行 `pnpm build` 来使用我们在 `package.json` 中定义的脚本

目前我们定义了这些脚本

```json
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack --watch --config ./config/webpack.config.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config ./config/webpack.config.prod.js",
    "build:dev": "cross-env NODE_ENV=development webpack --config ./config/webpack.config.prod.js",
    "start": "cross-env NODE_ENV=production pm2 start ecosystem.config.js",
    "kill": "pm2 delete kun-galgame-koa"
  },
```

可以看到我们根目录下的 `config` 文件夹，这是 `Webpack` 的配置文件夹，里面有四个文件

* utils.js 一些工具函数和变量
* webpack.config.base.js webpack 的基本配置项，这些项目在生产环境和开发环境是的打包是通用的
* webpack.config.dev.js webpack 的开发配置项，这些配置仅作用于开发环境
* webpack.config.prod.js webpack 的生产配置项，这些配置仅在生产环境生效

### 步骤

在了解了上面的介绍后，可以通过以下方法配置后端生产环境

* pnpm build - 这将会产生一个 dist 文件夹，里面有一个叫 `kun.js` 的文件，这就是后端的启动程序
* pnpm start - 这将会使用 pm2 根据 `kun.js` 启动一个服务，这个服务会一直运行，可以使用 pm2 查看服务目前的状态


## Nginx

由于涉及到服务器端的部署，Nginx 的部署不便于展示，如果想要学习，请加入我们的开发群组

部署的核心就是请求转发和反向代理，配置也都是基础的 nginx 配置，Google 以下 `Nginx with pm2` 就可以学习了
