# 构建前端和后端的指令或脚本

我们的前后端均为 `Typescript`，所以我们的脚本均在根目录的 `package.json` 文件内

## 前端

```json
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
```

我们这里的启动脚本非常简洁明了，这就是默认的 Vite 创建一个新的 `Vue3` 项目之后的脚本

可以使用 `dev` 来运行开发环境，我们的前端项目默认会启动在 `127.0.0.0:1007` 这个地址

可以使用 `vite build` 来打包资源，这会生成一个 `dist` 的打包产物文件夹

可以使用 `pnpm preview` 来预览打包后的资源，这是打包后的资源实际的呈现结果

### SSR

我们当前的前后端分离项目是尝试过 `SSR` 的，但是由于原生 `Vue + Vite` SSR 的坑点和难度实在太多太大，我们不得不放弃实现 `SSR`，这也是我们当前正在使用 Nuxt3 重构我们项目的理由

我们的 [GitHub repo](https://github.com/KUN1007/kun-galgame-vue/tree/SSR) 保留了 `SSR` 这个 branch

可以在这个 branch 的[倒数第二次提交](https://github.com/KUN1007/kun-galgame-vue/tree/8c4e97c6f1da899205caa1949e866b6c34068ada)看到我们最后一次 SSR 的项目

它的脚本是这样编写的

```json
  "scripts": {
    "dev": "ts-node-esm server-dev.ts",
    "prod": "ts-node-esm server-prod.ts",
    "build:client": "vite build --outDir dist/client --ssrManifest",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.ts",
    "build": "pnpm build:client && pnpm build:server"
  },
```

关于原生 `Vite + Vue` 实现 SSR，这个我们之后会专门研究，我们现在正在使用 Nuxt3 重构我们的项目 [kun-galgame-nuxt3](https://github.com/KUN1007/kun-galgame-nuxt3)，这是更加方便的实现


## 后端

```json
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack --watch --config ./config/webpack.config.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config ./config/webpack.config.prod.js",
    "build:dev": "cross-env NODE_ENV=development webpack --config ./config/webpack.config.prod.js",
    "start": "cross-env NODE_ENV=production pm2 start ecosystem.config.js",
    "kill": "pm2 delete kun-galgame-koa"
  },
```

需要注意的是，我们使用了 `cross-env` 来运行脚本，这是良好的实践，它可以保证在不同环境执行这些脚本是符合预期的，可以查看该 package 的 GitHub repo 查看更多细节

当 clone 好仓库，安装好 `node_modules` 之后，可以运行这些脚本

使用 `pnpm dev`，将会启动后端的开发环境，这会默认在 `127.0.0.1:10007` 启动服务

使用 `pnpm build`，将会使用 `webpack` 打包当前的项目，这会将当前的项目打包在一个 `dist` 文件夹里，这个文件夹中只有一个 `kun.js` 文件

使用 `pnpm build:dev`，将会按照开发环境的配置打包项目

使用 `pnpm start`，将会根据当前项目根目录的 pm2 配置(ecosystem.config.js)，启动一个当前项目的 pm2 服务

使用 `pnpm kill`，将会停止掉当前项目的 pm2 服务（如果该服务存在的话）
