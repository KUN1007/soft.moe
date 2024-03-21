# 对 Vitepress 的介绍与使用 - 基于当前 blog

首先我们要看一下它的官网

https://vitepress.dev

我们当前的 blog 也是基于 vitepress，它可以作为一个良好的参考

https://github.com/KUN1007/soft.moe

## 简介

`Vitepress` 是一个 `Vite & Vue Powered Static Site Generator`

这里需要说明的是 `Static Site Generator(SSG)`，这意味着使用 Vitepress 生成的结果文件全部是 HTML 文件，HTML 可以被浏览器直接渲染，这意味着它的加载速度有着无可匹敌的优势

还有一点，仅仅是针对 Vitepress 的，它页面切换的速度极快，快到不可思议，体验良好

它的基于 Vite 和 Vue 的，这意味着我们需要有 Vite 和 Vue 的基本知识，最起码需要知道如何启动项目

## 如何安装

可以查看官网

https://vitepress.dev/guide/getting-started

按照该步骤即可安装成功

### 安装向导

我们假设使用 pnpm 安装，并且运行安装向导 `pnpm vitepress init`，并且，我们这样编写向导

```shell
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  .
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◆  Theme:
│  ○ Default Theme
│  ● Default Theme + Customization
│  ○ Custom Theme
└
```

如你所见的初始化流程，我们之所以选择了 `.` 作为文档的根目录，是因为按照 `.docs` 进行初始化的话，写文章的话要多套一层文件夹，很麻烦，我们直接将存放文章的文件夹放在根目录

初始时会有三个文件 `api-examples.md`, `index.md`, `markdown-examples.md`，这是默认的几个 Markdown 文件，用于让用户熟悉 Vitepress 中 Markdown 的写法

我们新建一个 `articles` 文件夹，将这几个 Markdown 文件都放进去

与此同时我们在 Theme 这里选择第二个，以便以后对其进行扩展

### 安装包

新建完项目之后，切换到项目的根目录，执行 `pnpm i` 进行包的安装，完成之后，会看到根目录出现一个 `node_modules` 文件夹

这是一大堆 Node.js 的包，这是不必要提交到 git 的依赖，我们在根目录新建一个 `.gitignore` 文件，将这个文件夹放进 git 的忽略文件中

### 启动项目

安装成功后，使用 `pnpm docs:dev` 进行项目启动，如果看到提示的地址中有 Blog，那么就完成了第一步

`pnpm docs:dev` 这个命令太长了，我们在项目根目录的 `package.json` 文件中将这个命令改为 `pnpm dev`

再三强调，官网的说明非常淋漓尽致

## 如何使用

按照上面的步骤操作完成之后，应该会得到下面的项目结构

``` shell
└── toya.moe
    ├── articles
    │   ├── api-examples.md
    │   ├── index.md
    │   └── markdown-examples.md
    ├── package.json
    ├── pnpm-lock.yaml
    └── README.md
    └── .vitepress
        ├── config.mts
        └── theme
            ├── index.ts
            └── style.css
```

下面我们对其进行讲解，我们主要解释 `.vitepress` 这个文件夹

### .vitepress/config.mts

这是 vitepress 的配置文件

``` typescript
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Toya's Blog",
  description: "Toya's moe blog, Just a chaotic doom",
  base: '/',
  srcDir: 'articles',
  outDir: './dist',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})

```

**base**

这是指的 vitepress 的项目根目录位于哪里，这样写就可以

**srcDir**

这指定了 vitepress 的文章资源目录在哪里，我们在创建项目的时候将其改为了 `articles`，所以这里这么写

其他的配置，官网均有详细介绍，不容易弄混

值得注意的是，`sidebar` 的配置之后会非常长，可以参考当前这个 blog 的项目将其分开配置，或者搜索一些自动生成路径的包

### .vitepress/theme/index.ts

可以在这里对 vitepress 的页面进行扩展

例如，可以参考当前这个 blog，对主页的 footer 下面加上朋友链接

该配置在 vitepress 的官网有详细介绍。需要注意，如果想要自己编写页面的话，需要具备一定的 Vue3 知识

### .vitepress/theme/style.css

这是整个项目的一些 css 变量配置，可以在这里设置固有页面的样式

例如，可以像这个 blog 一样，对页面的颜色进行自己的配置

### articles/index.md

这个文件需要注意，它是主页的配置文件

它的编写方法也十分简单直观，可以参考当前这个 blog 的写法编写

## 注意事项

### articles 路径
articles 下面的文件夹都可以被 vitepress 渲染，但是想让它呈现在 `sidebar` 上，需要在刚才的 `config.mts` 中进行配置

如果参考了我们当前的 blog，那么直接在 `.vitepress/config/sidebar.ts` 中进行配置即可

注意，我们的 `srcDir` 是根目录下的 `articles`，这意味着 `/` 在所有的文件中都表示 `/articles` 这个文件夹

所以，在我们指定文章的路径时，需要以 `/articles` 为根目录而不是 `/`

### 公共资源路径

对于图片、音频、视频这些文件，都被视作静态文件

例如，我们要改掉网站的图标，就可以用这些静态文件

我们可以在 `/articles` 目录下新建一个 `public` 文件夹，以后我们所有的图片等静态资源文件都可以被放在这个文件夹

使用的时候直接使用即可，例如要使用 `kun.webp` 只需要

``` html
<img src="/kun.webp"/>

```

这时，不需要指出全部的路径

注意，如果有任何资源的路径找不到，都可以参考我们当前的 blog 项目

## 部署

我们已经事先编写好了一份 GitHub Actions 的配置文件，可以将这个项目部署到 GitHub pages 上

它位于 `.github/workflows/deploy.yml`，这是配置了一个 GitHub 的工作流

结合域名以及 `Cloudflare` 的服务，我们可以很方便的搭一个网站，这个步骤比较多，我们以后再说 ~~，咕咕咕咕咕咕咕咕咕~~

如果有任何的问题，欢迎点击右上角联系我们
