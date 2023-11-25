# Nextjs

今天看看 `nextjs` 在讲什么，写点理解

https://nextjs.org/docs

emmm，我自己的理解，不一定对



## 创建项目

```bash
npx create-next-app@latest
```

创建好之后删掉 `lock-file`, 然后 `pnpm i && pnpm dev`

emmm，这个打开速度好慢，比起 `Vite` 来说的话

我继承了 `Typescript` 和 `tailwindcss`



## 项目结构

https://nextjs.org/docs/getting-started/project-structure

Nextjs 这个项目结构介绍的好明了，最开始学 Vue 的时候为了安排一个合理的项目结构费了我几天时间。。

emmm，因为我最开始还不知道诸如 `utils`, `components`, `types` 之类的文件夹里面的结构应该怎么安排好，啊哈哈哈

---

貌似在创建项目的时候会提示是否需要 `src` 文件夹，我点了需要，然后把 `app` 文件夹嵌套在 `src` 文件夹里面了，现在看来这个决定是正确的

Nextjs 应该还是用的 `webpack`，也可以在 `next.config.js` 里面配置

官网的这个 [Parallel and Intercepted Routes](https://nextjs.org/docs/getting-started/project-structure#parallel-and-intercepted-routes) 我还不是很理解

动态路由的话它的写法是 `[folder]`, 这个写法还是第一次见



## 路由

### 定义路由

它这个定义居然是类比了树的结构

貌似这一节解释清楚了什么是平行路由和拦截路由了

[Advanced Routing Patterns](https://nextjs.org/docs/app/building-your-application/routing#advanced-routing-patterns)

并行路由就是多个页面在同一时间在不同的部分同时展示，在当前页面中显示其他路由的内容，而无需完全切换到新的页面，比如编辑的时候打开其它地方的内容在当前页面看一看

拦截路由就是把路由拦截住导航到指定的地方了，比如提醒用户保存草稿。

啊？这样理解对吗？我也不知道啊，因为我今天刚开始看



### 页面和布局

#### 页面

Nextjs 的每个页面，就是 `app` 文件夹下面的 `page.tsx` 文件，然后这个文件夹的路径名就是它的路由

意思就是随便创建一个文件夹 `kun`，然后在 `kun` 文件夹新建一个 `page.tsx` 文件，这样访问 `/kun` 的时候就会返回 `page.tsx` 的内容

怎么这么简单。。Vue 还要在路由里面配。。

#### 布局

每个页面里面还可以放一个 `layout.tsx` 文件，这个文件是布局文件，将会在这个路由下面所有页面共享

这个用的话把 `TopBar` 和 `Aside` 放到根布局不就蛮好的嘛

根目录必须有 `<html>` 和 `<body>` 标签

  

布局是不会被重新创建的，它只会被创建一次，并在路由跳转时保留状态

这个倒是很好理解

#### 模板

每个页面中还可以放一个 `template.tsx` 文件，这是模板文件

这个东东和布局的不同在于切换页面时它会被重新创建一次，不保留状态

#### 修改 `<head>`

改一下利于 `SEO`

```typescript
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Next.js',
}
 
export default function Page() {
  return '...'
}
```



### 链接和导航

和 Vue 怎么这么像。。。

Next 是 `Link` 和 `useRouter()`

用法就是 `<Link href={}>`, `const router = useRouter()` ，哦天哪，简直一模一样



### 路由组

把文件夹命名成 `(kun)` 这样的形式就行

这个有什么用呢

文件夹的名字都要服从于根目录的共有布局，要脱离这个布局就可以这么用，这个一般用于组织路由



### 动态路由

这个概念貌似哪里都有

比如 `topic/:tid`

在 `nextjs` 里面写法就是

```tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>
}
```

这是 `page.tsx` 文件嘛，我们上面说过的



### 加载 UI 和流式处理

这个就是骨架屏一类的效果，官网说的非常明白

https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

讲的是 `React` 的 `Suspense` 组件在 `Nextjs` 里面怎么用

一般来说水合要等到全部结束之后才会呈现页面，然后这么用的话就会逐渐呈现页面，提升用户体验



### 错误处理

每个页面还能放一个 `error.tsx` 文件，这个文件就是错误处理文件

用处就是保持页面细粒度以及重载页面

什么是细粒度

这个问题 `Solidjs` 貌似讲的更加清楚，通俗的说就是精准的找到出错的那个地方，不影响其它的界面

#### 原理

这个错误处理会把这个错误的组件用一个 `<ErrorBoundary>` 包装一下，然后呈现一个预设的 `<Error>` 页面，这个 `<Error>` 页面可以在回调函数中定义

这个错误可能是暂时的，所以还有一个 `reset()` 函数，调用一下成功的话就会把错误界面替换为渲染成功的界面

处理根组件的错误需要命名为 `global-error.tsx`

这个组件不会处理 `layout.tsx`, `template.tsx` 这种重要组件的错误

#### 服务器错误

服务端错误时这个错误会被脱敏并被抛出到一个最近的 `error.tsx` 文件中呈现

脱敏时为了保护重要的服务端敏感信息



### ...