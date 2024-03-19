# Nuxt3 项目路由

对于我们 Version 2 的重构项目来说，路由毫无疑问是更改最大的地方之一

## 原来的路由

对于我们原来的路由，在 Version 1 的文档中已经详细介绍过了

它是使用 vue-router 原生的方法，经过自行的扩展得来的

## Nuxt3 的路由

我们建议先查看 Nuxt3 的官网，路由这一部分的内容

Nuxt3 有一个基于文件系统的路由，它在我们的项目中体现在 `pages` 文件夹下

这个文件夹的文件结构是什么样的，那么本项目的路由就是什么样的

## 路由鉴权

在我们 Version 1 的项目中，详细介绍过路由的鉴权，不在路由白名单内的路由均会被鉴权

但是，我们也提到过，Version 1 对所有的路由都进行了鉴权，这对于一个论坛来说是封闭的

在我们当前的项目中，我们仅在前端对某些需要鉴权的路由进行了鉴权

### 前端鉴权

对于 Nuxt3 的前端鉴权，我们使用了一个 `auth` 中间件，它位于 `/middleware/auth.ts`

``` typescript auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { moemoeAccessToken } = useKUNGalgameUserStore()

  const nuxt = useNuxtApp()

  if (!moemoeAccessToken) {
    useMessage(
      'You need to login to continue your operation',
      '您需要登录以继续操作',
      'warn',
      5000
    )
    return navigateTo(nuxt.$localePath('/login'))
  }
})
```

这是一个直观的代码，它仅对前端的点击进行了限制

这意味着，用户随便自己填一个 token，就可以进入这个页面

不过**仅对于我们的项目来说**，这是无所谓的。因为我们的页面上并不会展示出敏感信息

在使用时，仅需要在对应的页面编写

``` typescript
definePageMeta({
  middleware: 'auth'
})
```

这一点可以参考我们的 `edit` 页面

### 后端鉴权

后端鉴权才是我们的主要手段，主要是针对用户的 `POST`, `PUT`, `DELETE` 等可能影响到论坛数据库的操作

例如，点赞、发布话题、删除消息等

对于我们后端的鉴权，我们会在用户进行这些操作的时候，使用一个函数获取用户 `token` 中的 `payload`，根据 `payload` 中的信息对用户进行鉴权，未获取到就说明不是用户或者登陆过期

关于 `JWT` 相关的信息，可以在这里找到: [SSO 与 OAuth 2.0 # 双-token-认证](/technology/backend/kun-sso-oauth#双-token-认证)

这个函数在 `/server/utils/getCookieTokenInfo.ts`，它结合 `jwt.verify` 和 `redis` 实现了上面的需求

当未获取到 `payload` 时，将会返回一个 `205` 的响应，例如

``` typescript
  const userInfo = await getCookieTokenInfo(event)
  if (!userInfo) {
    kunError(event, 10115, 205)
    return
  }
```

关于 `205`，我们在 Version 1 文档中有提到过，这是因为我们在避免控制台报错，所以没有使用 `401`

### 如何在后端鉴权失败时将用户重定向到登陆页面

上面已经说到，在鉴权失败时，会返回一个 205，这需要前端的配合

::: info 自定义 `useFetch`

我们自定义了 Nuxt3 的 `useFetch` 函数，将其响应变为了我们自定义的响应处理函数

注意，这里之所以我们没有把整个 `useFetch` 都进行自定义，是因为官方的 `useFetch` 已经封装的很完善了

还有一个重要的原因是，我们使用了 `nuxt-typed-router` 这个包，它会提供 Nuxt 路由的补全

我们自己封装的 `useFetch` 函数，虽然功能正常，但是由于未知原因，Nuxt3 自带的类型提示全部消失了，我们进行了一番取舍，所以仅对其响应做了封装

:::

我们封装的 `useFetch` 响应处理函数位于 `/utils/responseHandler.ts`

``` typescript
export const onResponse = (context: KunOnResponseContext) => {
  if (context.response.status === 205) {
    const navigateCookie = Cookies.get('kungalgame-is-navigate-to-login')
    if (!navigateCookie) {
      kungalgameStoreReset()
      useMessage(
        'Login expired, please login again',
        '登录过期, 请重新登陆',
        'error',
        7777
      )

      const nuxt = useNuxtApp()
      navigateTo(nuxt.$localePath('/login'))
      Cookies.set('kungalgame-is-navigate-to-login', 'navigated')
      return
    }
  }

  if (context.response.status === 233) {
    kungalgameErrorHandler(context.response.headers.get('Kun-Error') || '')
  }
}
```

可以注意到，当响应为 `205` 时证明失效，会被重定向到登陆页

这个名为 `kungalgame-is-navigate-to-login` 的 Cookie 的作用是，仅导航一次，后续如果再返回 `205` 时，就不导航用户到登陆页了，只是提示即可，保证用户体验。该 Cookie 会在用户登陆成功时刷新

这个名为 `233` 的响应就代表可预测的错误，这证明后端捕获到了已知错误，交付前端处理，同样，这也是我们自定义的响应码
