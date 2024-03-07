# 新建 Nuxt3 项目并集成依赖

## 创建项目

https://nuxt.com/docs/getting-started/installation

创建项目之后会得到一个基本的 Nuxt3 项目结构

一个基本的 Nuxt3 项目结构可以在[这里](https://nuxt.com/docs/guide)的 Directory Structure 看到

### 开发者工具

Nuxt3 的开发者工具看着很帅，实际上使用起来有点鸡肋，有可能会导致浏览器错误请求路由然后在开发的时候报错，酌情使用

### `<NuxtWelcome>`

刚开始只有这个文件，这就是入口文件，删掉就可以，没有 index.ts 这种东东

## 安装依赖

我们原来的项目有两个项目 `kun-galgame-vue` 和 `kun-galgame-koa`，这两个项目都使用了 `Typescript` 编写

对于 vue3 的前端，它使用了 Vite 作为工程化的工具，对于 koa 的后端，它使用了 webpack 作为工程化的工具，这在我们 Version 1 的文档中有提及

不约而同的，它们都有一个 `package.json` 配置文件，我们现在要将原来的前端和后端全部迁移到 Nuxt3 的全栈项目中，这意味着我们需要在 Nuxt3 的项目中安装原来项目所有可以用到的依赖

迁移过后的 Nuxt3 项目依赖文件为

::: detail package.json

```json
  "devDependencies": {
    "@nuxt/devtools": "^1.0.8",
    "@nuxt/image": "^1.3.0",
    "@nuxtjs/color-mode": "^3.3.2",
    "@nuxtjs/eslint-config-typescript": "^12.1.0",
    "@nuxtjs/i18n": "8.0.0",
    "@pinia-plugin-persistedstate/nuxt": "^1.2.0",
    "@pinia/nuxt": "^0.5.1",
    "@types/bcrypt": "^5.0.2",
    "@types/js-cookie": "^3.0.6",
    "@types/node": "^20.11.10",
    "@types/nodemailer": "^6.4.14",
    "@types/nodemailer-smtp-transport": "^2.7.8",
    "@vite-pwa/nuxt": "^0.4.0",
    "dayjs-nuxt": "^2.1.9",
    "eslint": "^8.57.0",
    "husky": "^9.0.11",
    "nuxt": "^3.9.3",
    "nuxt-icon": "^0.6.8",
    "nuxt-schema-org": "^3.3.3",
    "nuxt-typed-router": "^3.5.1",
    "prettier": "^3.2.5",
    "sass": "^1.70.0",
    "vue": "^3.4.15",
    "vue-router": "^4.2.5"
  },
  "dependencies": {
    "@milkdown/core": "7.3.2",
    "@milkdown/ctx": "7.3.2",
    "@milkdown/plugin-clipboard": "7.3.2",
    "@milkdown/plugin-history": "7.3.2",
    "@milkdown/plugin-indent": "7.3.2",
    "@milkdown/plugin-listener": "7.3.2",
    "@milkdown/plugin-prism": "7.3.2",
    "@milkdown/plugin-tooltip": "7.3.2",
    "@milkdown/plugin-trailing": "7.3.2",
    "@milkdown/plugin-upload": "7.3.2",
    "@milkdown/preset-commonmark": "7.3.2",
    "@milkdown/preset-gfm": "7.3.2",
    "@milkdown/prose": "7.3.2",
    "@milkdown/transformer": "7.3.2",
    "@milkdown/utils": "7.3.2",
    "@milkdown/vue": "7.3.2",
    "@prosemirror-adapter/vue": "^0.2.6",
    "@types/jsonwebtoken": "^9.0.5",
    "animate.css": "^4.1.1",
    "aws-sdk": "^2.1547.0",
    "bcrypt": "^5.1.1",
    "js-cookie": "^3.0.5",
    "jsonwebtoken": "^9.0.2",
    "localforage": "^1.10.0",
    "mongodb": "^6.3.0",
    "mongoose": "^8.1.1",
    "nodemailer": "^6.9.8",
    "nodemailer-smtp-transport": "^2.7.4",
    "socket.io": "^4.7.4",
    "socket.io-client": "^4.7.4"
  }
```

:::

### 区别

我们注意到这和我们原来的项目依赖有变化，有很多依赖被移除了，这部分依赖都不再使用了，下面仅考虑新增的依赖

关于前端的方面

::: tip

对于 Nuxt3 来说，它前后端的区别不是特别明显，因为它的一个全栈框架，当然仅使用 Nuxt3 作为前端，享受 SSR 的好处也是可以的，不过本次我们连它的 Nitro 后端也一起使用了

:::

* Pinia. 对于 Nuxt3 来说，Pinia 对其 SSR 有专门的支持，我们需要安装适配了 Nuxt3 的 Pinia
* color-mode. 对于 Nuxt3 来说，要实现一个同构的主题适配较为困难，因此我们将原来的白天 / 黑夜适配改为了 Nuxt3 的官方主题库
* i18n. Nuxt 的 i18n 是对 vue-i18n 的封装，使其适配 Nuxt3
* @vite-pwa/nuxt. Nuxt3 的 PWA 支持
* nuxt-icon. 我们原来使用的 iconify 被 Nuxt 官方包含在了 nuxt-icon 中，直接使用
* nuxt-schema-org. 关于网站 schema-org 定义相关的库，有利于 SEO
* nuxt-typed-router. 可以自动生成路由的 `Typescript` 类型文件，方便开发

本次我们还对项目集成了 eslint 和 prettier，以及 husky，便于团队合作


关于后端的方面

对于 Nuxt3，它使用了 Nitro 作为后端，这也是一个 `nodejs` 相关的后端框架，它与 Nuxt3 天生集成

* aws-sdk. 这是 AWS 相关的 sdk，用于上传图片（这里不需要知道太多）
* socket.io 这是操作 websocket 相关的库，用于论坛的实时通知，关于这个之后会详细说明

我们仅新增了这两个依赖
