# 如何将一个现有的 Vue3 项目改写为 Nuxt3 项目

## 自动导入

Nuxt3 内置了自动导入的功能，我目前发现了这么几个规则

* Nuxt 只会导入 `~` 目录的 `composables`, `components`, `utils`, 以及 `server` 目录的 `utils` 文件夹
* `components` 目录的自动导入是递归的
* 导入的 `components` 中的组件名可能与其文件名不同，因为这里我们是使用的 `setup` 写法

通过在 `nuxt.config.ts` 中配置

```typescript
  imports: {
    autoImport: false
  }
```

即可禁用自动导入

## 前端举例

目前我已经将四个主要页面 `Login`, `Home`, `Edit`, `Kungalgamer` 由 Vue3 改写为了 Nuxt3, 现在我要改写 `Topic` 这个目前最复杂的页面，记录过程

### 一，改写路由

Nuxt3 是基于文件夹名称的路由，原本 Vue3 项目的 `/topics/:tid` 路由现在变更为在 `pages` 文件夹下新建 `topic` 文件夹，继续在 `topic` 文件夹下新建文件夹 `[tid]`，在 `[tid]` 文件夹下新建 `index.vue` 文件

### 二，移动组件

将原本 Vue3 项目 `topic` 目录顶层的 `KUNGalgameTopicPage.vue` 原封不动的复制至 `index.vue`

将原本 Vue3 项目 `topic` 目录下的 aside 和 components 文件夹全部移动到 Nuxt3 项目的 `components/topic` 文件夹下，并进行文件名简化，例如 `AsideActive.vue` 变为 `Active.vue`

将原本的目录扁平化，在 `components` 文件夹下只允许嵌套两层文件夹，因为我们用了自动导入，过长的话会导致组件名过长

### 三，移动 ts 函数

为了使项目逻辑更加清晰，我避免了在单个 Vue 文件中写过多的 ts 代码（超过 100 行），因此我将部分可重用或者可分离的代码放进了单独的 ts 文件中，例如此处的 `asideItem.ts` 文件，我们在 `components/topic` 新建一个 `utils` 文件夹，将这个文件放在这里，以后其它类似的 ts 文件也这么处理

不要忘记在移动之后改变 import

### 四，检查报错

关闭 vscode 重新打开会更加保险，因为有的时候 vscode 是检查不到突然大量新增的文件的，ts-server 也会崩溃

逐个点击 `components/topic` 下的 `.vue` 文件，查看报错

一般这时候会先解决一些可预见的报错，例如文件找不到，将它们更改即可

### 五，删除引入

我们使用了 Nuxt3 自带的自动引入，并进行了扩展，现在我们会自动引入 Nuxt3 项目根目录的 `components`, `composables`, `store`, `utils` 文件夹下暴露的所有函数

并且，Nuxt3 将会自动引入 Vue3 的所有自带函数，例如 `ref`, `computed`，因此，我们要删掉 Vue 文件中出现的大量重复引用，例如

```typescript
import { Icon } from '@iconify/vue'
import TopicOtherTag from './TopicOtherTag.vue'
import TopicMaster from './TopicMaster.vue'
import KUNGalgameFooter from '@/components/KUNGalgameFooter.vue'

import { useTempReplyStore } from '@/store/temp/topic/reply'
import { storeToRefs } from 'pinia'

import { asideItem, sortItem } from './asideItem'
import type { SortField, SortOrder } from './asideItem'
```

  

#### 删除引入导致的问题

* 注意 `KUNGalgameFooter` 等组件，删除它们的引入时，需要用自动引入的文件名使用它们，例如 `KUNGalgameFooter` 现在的名字是 `KunFooter`

* `Icon` 组件是 `iconify` 的，但是 Nuxt 的 Icon 将 `icon` 改为了 `name`，删掉之后这些小变动也需要更改
* 暂时无法更改的地方，全部注释掉，之后解决

#### 哪些不能删除

* 通过 `defineAsyncComponent` 引入的组件不要移除，这会导致异步引入失效
* `animate.css` 的引入不要删除，它不会被自动引入
* `Milkdown` 编辑器相关，例如 `MilkdownProvider` 等等，这些不会被自动导入
* `editor/index.scss` 这个文件的路径需要更改，因为 Nuxt3 最佳实践是将字体和 css 都放置在 `~/assets`

  

### 六，将 RouterLink 改为 NuxtLink

全局替换所有的 `<RouterLink/>` 组件为 `<NuxtLink/>`，Nuxt3 封装了 Router 组件，使其更符合 Nuxt3 的设计，那么为什么不用呢

RouterView 也可以全部替换为 NuxtPage

### 七，将 $tm() 替换为 $t()

在 Vue3 项目中我们的 i18n 的字典是封装在 ts 文件中并作为一个对象导出的

现在看来这似乎是一个不好的实践，因为它没有 `i18n-ally` 的友好提示，在新项目中我们将 `nuxt-i18n` 的翻译字典文件全部放在了 `JSON` 文件中，并且使用 $t() 函数而不是 $tm()，这使得 `i18n-ally` 有了良好的提示

并且，如果沿用原来的 $tm 方法，在 Nuxt3 项目中会导致翻译不出来，所以这里就使用 $t

`Nuxt-i18n` 是对 `vue-i18n` 的封装，它提供了一些新的功能，我们在之后的文档中会详细编写

### 八，将 Message 改为 useMessage

在 Vue3 项目中，我们将 Message 作为了一个函数组件使用

在 Nuxt3 中，我们将这个函数组件变更为了一个 composables，并使用 useMessage 来使用

### 九，移除 showKUNGalgameLanguage

原来的项目中我们使用了 `showKUNGalgameLanguage` 这个变量来控制网站整体的语言，但是 Nuxt3 是一个 SSR 友好的框架，这意味着我们难以使用浏览器的 `localStorage` 来记住用户的语言偏好

我们使用了 `Nuxt-i18n` 自带的存储用户语言的方式，一个 cookie 变量，因此无需 `showKUNGalgameLanguage` 这个引入了

取而代之的是，我们可以使用下面的方式访问当前的语言

```typescript
const { locale, setLocale } = useI18n()
```

这里的 `local` 就是当前语言的值，它是 SSR-friendly 的，类型为 `WritableComputedRef<string>`

### 十，更改样式

原来的项目中，我们有几处使用了 ` justify-content: end;` 的写法，但是这是不正规的，正确的写法是

```scss
  justify-content: flex-end;
```

现在将所有出现的地方全部替换

### 十一，删除所有注释

在 Nuxt 项目的 `HTML` 部分编写注释不是好的实践，在 `<template>` 顶层编写注释有概率导致水合错误，虽然是心理作用，保险起见我们将 `<template>` 中的注释全部去除

另外已经有 Vue3 项目的注释了，因此在 Nuxt3 项目中我们会删除一切我们感到没有必要的注释

## 后端举例

前端迁移过后，后端的 API 自然也要由原来的 Koa 换成 Nitro

### 一，更改路由

将 Koa 的路由更改为 Nitro 的路由，Nitro 的路由是基于文件的，写法与 Nuxt3 是相似的

原 Koa 路径 `topic/:tid` 将会被变更为，topic 文件夹下新建 [tid] 文件夹，[tid] 文件夹下新建 `index.get.ts`

其中 get 意味着请求方式，路径参数 tid 可以通过下面的方式拿到

```typescript
const tid = getRouterParam(event, 'tid')
```

具体写法

```typescript
export default defineEventHandler(async (event) => {
  const tid = getRouterParam(event, 'tid')
})
```

建议直接看代码，一看就懂了

### 二，更改请求

原来使用了自定义的 `fetchGet` 函数来请求，现在直接使用 Nuxt3 的 `useFetch` composable 就可以

```typescript
const { data: topicData, refresh } = await useFetch(`/api/topic/${tid.value}`, {
  method: 'GET',
  watch: false,
  onResponse({ request, response, options }) {
    if (response.status === 233) {
      kungalgameErrorHandler(response.statusText)
      return
    }
  },
})
```

写法上，`onResponse` 的一个拦截器，这里设置响应 233 的时候触发已知错误

这里的 data 是 SSR-friendly 的，在页面上用可以直接被渲染
