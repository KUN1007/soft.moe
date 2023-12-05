# Vue-router

## 介绍

任何一个前端框架都有自己的 router，我们使用了 Vue3，自然而然的使用了 Vue-router 的最新版本

## 结构

本项目的 router 位于 `src/router` 目录下，它的结构为

* guard. 路由守卫文件夹
* modules. 不同页面的单个路由（该页面下的路由都是私有的，需要登录才能进入，这是暂时的，以后我们会将大部分的路由全部公开）
* index.ts 创建 router
* router.ts 创建了路由白名单，以及动态路由的文件

### guard

这个文件夹下面主要有两个功能，可以在 `index.ts` 中发现，一个是 `createPageTitle`，用于创建页面的标题，该函数支持 `i18n`

还有一个是 `createPermission`，用于创建路由守卫，用来保护一些只有用户登录后才可以用的路由

在 `permission.ts` 文件中有一个关键的函数 `createPermission`，它使用了 `localStorage` 中保存的 `access-token` 和 router 的 `meta` 字段来鉴权

```typescript
export const createPermission = (router: Router) => {
  router.beforeEach(async (to, from) => {
    NProgress.start()

    const token = useKUNGalgameUserStore().getToken()
    const { uid, roles } = storeToRefs(useKUNGalgameUserStore())

    const isInWhitelist = whiteList.includes(to.name as string)
    // Get the required permissions for the target route
    const requiredPermissions = to.meta.permission
      ? (to.meta.permission as number[])
      : [1, 2, 3, 4]

    if (!token && !isInWhitelist) {
      NProgress.done()
      return { name: 'Login' }
    }

    ...

  })

  // Finish NProgress
  router.afterEach(() => {
    NProgress.done()
  })
}
```

在 `whiteList` 中的路由将会被跳过鉴权

需要注意的是，我们使用了 `return { name: '' }` 的写法而不是在 `router.beforeEach` 中使用 `next()` 函数进行跳转，这样会避免路由递归导致无限重定向，这是[官方推荐的写法](https://router.vuejs.org/guide/advanced/navigation-guards.html#Optional-third-argument-next)

我们还使用了 `NProgress` 这个包，它的作用是跳转页面的时候显示一个进度条

### modules

我们举例 `balance.ts` 文件

```typescript
import { type RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/KUNGalgameAPP.vue')

const balance: RouteRecordRaw[] = [
  {
    path: '/balance',
    component: Layout,
    children: [
      {
        name: 'Balance',
        path: '',
        component: () => import('@/views/balance/Balance.vue'),
        meta: {
          title: 'balance',
        },
      },
    ],
  },
]

export default balance
```

可以看到我们使用 `() => import()` 的方式引入组件，实现路由懒加载，这样将会导致 `Vite` 在打包时将这些页面分开打包，提高页面整体加载的细粒度

我们有一个 `Layout` 组件，它提供了背景图片和 `TopBar` 的支持，`modules` 中的路由都是有 `Layout` 的

### index.ts

```typescript
import { type RouteRecordRaw, createWebHistory, createRouter } from 'vue-router'
import { constantRoutes } from './router'
import { asyncRoutes } from './router'

// Create a Vue Router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes] as RouteRecordRaw[],
  // Scroll to the top of the page with a smooth animation on each page navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

export default router
```

这个文件的作用就是创建路由

`createWebHistory` 意味着我们的路由类型是 web 而不是 hash

`routes` 中放置了我们所有的路由，包括白名单和动态路由

`scrollBehavior` 是路由的滚动行为，这里定义的效果是每次页面加载时都滚动到顶部，带有滚动动画

### router.ts

这个文件的作用就是定义了一些不需要鉴权的路由，把它作为白名单路由

它还将 `modules` 文件夹中的路由全部取出组合成了一个动态路由数组，这个动态路由需要鉴权


## 安装

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { setupKUNGalgameRouterGuard } from '@/router/guard'

const app = createApp(App)

setupKUNGalgameRouterGuard(router)

app.use(router).use(i18n).mount('#app')
```

将在 `src/router/index.ts` 文件中创建的路由在 app 中 `use` 即可

需要注意的是，必须要先设置路由守卫，再挂载路由，这样路由守卫才会生效

## 使用

在本项目中，用到路由有以下几种情况

### RouterLink 标签

这是最常用的情况，一个经典的场景是

```Vue
<RouterLink :to="`/kungalgamer/${kun.uid}/info`">
{{ kun.name }}
</RouterLink>
```
这里直接使用 `ES6` 的模板字符串将某些参数作为 router params 传递，然后使用 `v-bind` 绑定路由的 `to` 属性实现动态路由匹配

大白话，给一个 id，能根据这个 id 跳到哪个页面，比如给一个 uid: 1，跳转到用户 1 的主页

### useRouter

观察到 `src/components/BackToPrevious.vue`

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
 
router.back()
```

这是本项目中最简单的一个使用情况了，本项目中我们一般使用 `useRouter` 来获取一个 `router` 实例，然后调用 `router` 上的各种方法，例如 `router.push('/')`，这里的 `back()` 是返回上一个路由

### useRoute

观察到 `src/views/kungalgamer/content/Topic.vue`

```typescript
import { useRoute } from 'vue-router'
const route = useRoute()

const tidArray = computed(() => {
  if (route.name === 'KUNGalgamerPublishedTopic') {
    return props.user.topic
  }
  if (route.name === 'KUNGalgamerLikedTopic') {
    return props.user.likeTopic
  }
  if (route.name === 'KUNGalgamerUpvoteTopic') {
    return props.user.upvoteTopic
  }
  return []
})
```

我们使用了 `useRoute` 获得了当前的路由实例，这个 `route` 可以访问当前页面路由的各种属性，这里使用的是 `name` 属性

