# SSO 与 OAuth 2.0

## 介绍

`SSO` 指的是**单点登录**，允许用户使用一组凭证登录多个相关的应用或服务，而不需要每次都输入凭证。

用户在登录一个应用后，可以无需重新登录直接访问其他已授权的应用。

`SSO` 旨在提高用户体验和简化身份验证流程。

  

`OAuth` 是一个**开放标准**，用于授权用户让第三方应用访问其在另一个服务提供者上存储的私密资源，而无需提供其密码。

`OAuth` 不是单点登录的技术，而是一种授权机制，允许用户授权访问其在服务提供者上的受保护资源。



## 需求

目前我们开发的论坛 [KUN Visual Novel](https://kungal.com) 要编写一个后台管理系统，它将会使用 `Nextjs` 作为技术栈，我们计划将其部署在 `admin.kungal.com` 这个域名上

我们需要明确下面几个问题

* 管理系统和论坛使用同一套用户及话题数据
* 管理系统和论坛均使用 `JWT`
* 用户如果是管理员，只需要登录论坛，不需要再次登录管理系统即可使用管理系统

  

我们还需要考虑将来的扩展性问题

* 客户端不止一个，目前有 `Vue3` 和 `Nextjs` 技术栈，以后会有 `Nuxt3`, `Nextjs`, `Solid-start`, `Svelte-kit` 等
* 服务端暂时只有一个，以后必然会有多个服务端



但是这个需求带来了这么几个问题

* `JWT` 只能在 `kungal.com` 域名下进行认证（准确来说是 `www.kungal.com`），在 `admin.kungal.com` 会受到跨域影响，如何实现跨域鉴权认证
* 如何在用户不用再次登录的情况下，实现跨域鉴权认证
* 用户直接访问 `admin.kungal.com` 的时候，应该如何鉴权

  

实现这这些要求，`SSO` 和 `OAuth` 都可以做到，我们选择了 `OAuth`，理由是我们将来会有多个服务端

实际上，我们的需求完全不需要多个客户端多个服务端，为什么这么做呢？

~~我爱折腾，来打我呀~~



## 双 Token 认证

在我们目前的应用中，我们使用了 `access-token` 和 `refresh-token` 的双 token 认证方式，下面是它的基本原理

### JWT Payload

这个叫 `JWT` 的载荷，说人话就是给 `JWT` 一些自定义的信息，它可以通过 `JWT` 进行传递，并且进行解码

它的 interface 如下

```typescript
export interface JwtPayload {
    [key: string]: any;
    iss?: string | undefined;
    sub?: string | undefined;
    aud?: string | string[] | undefined;
    exp?: number | undefined;
    nbf?: number | undefined;
    iat?: number | undefined;
    jti?: string | undefined;
}
```

### 生成 Token

我们的 `Koa` 后端使用了以下方式签发 `JWT`

```typescript
export function generateToken(uid: number, name: string, expire: string) {
  const payload: Payload = { iss: env.JWT_ISS, aud: env.JWT_AUD, uid, name }
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: expire })

  return token
}
```

我们签发了这么几个属性

签发人：谁发放的 JWT

受众：JWT 发给谁

uid：用户的 ID

name：用户名

我们之后的鉴权都会使用这几个属性

这里需要注意**认证**和**鉴权**的区别，认证是证明**你是你自己本人**，鉴权是证明**你有哪些权限**

  

### 认证流程

下面的认证设置以下几个点

`Http-only Cookie`，仅在服务器端可访问，客户端不可通过 `Javascript` 访问该值，但是可以由用户本人在控制台的 `Cookie` 查看到，存放 `refresh-token`

`localStorage`，存放 `access-token`

鉴权步骤

* 用户登录成功，服务端生成两个 token，一个 `refresh-token` 放在 `Http-only Cookie`，还有一个 `access-token` 发送给客户端，客户端将其存放在 `localStorage`
* **`refresh-token` 的过期时间为 `7d`，`access-token` 的过期时间为 `60m`** 
* 之后用户请求任何后端 `API` 时均需在请求头带上 `Authorization: Bearer + access-token`
* 用户请求路由之前，先要经过一个 `authMiddleware`，这个 `authMiddleware` 会查看用户的 `Authorization` 头部是否有 `access-token`，并验证其是否有效
* 倘若验证无效（过期，签发人和受众不对等等）则返回 401
* 客户端收到 401 的响应，尝试请求刷新 `token` 的接口，向 `/api/auth/token/refresh` 发送 `POST` 请求
* 服务端收到刷新 `token` 的请求，检查当前的 `refresh-token` 是否有效。如果有效，则返回新的 `access-token` 给客户端。如果无效，则返回错误，客户端跳转到登陆界面提示用户重新登录。
* 客户端到新的 `access-token`，重新请求服务端资源，服务端重新检查 `access-token`，返回资源

  

经过上面的认证，可以实现的效果是

* 网站每过 60 分钟会自动刷新一次 `access-token`
* 每过一周，`refresh-token` 会失效，用户需要重新登陆

  

### 安全性

#### Http-only Cookie Token

这是存放 `refresh-token` 的地方，较为安全，因为客户端的 `Javascript` 不可访问，可以防止 `XSS`

但是防 `XSS` 也不是万无一失的，因为攻击者可以直接在 `XSS` 代码中发送请求，这样 `Http-only Cookie` 就没有意义了

还有就是它无法防止 `CSRF` 的攻击

#### localStorage Token

这是存放 `access-token` 的地方，`localStorage` 天生防 `CSRF` 攻击，但是它不防 `XSS`

需要注意的是，一旦 `refresh-token` 被盗，那么 `access-token` 也就没有任何用了

## SSO 的实现原理（JWT）

下面我说一下基于 `JWT` 是如何实现 `SSO` 的，感谢 [`yurzhang`](https://yurzhang.com) 对我的指点！

需要注意的是，本来的应用就已经使用了 `access-token` 和 `refresh-token` 的双 `token` 认证

  

### 鉴权过程

当用户通过 `用户主页 -> 管理论坛` 访问 `admin.kungal.com` 时

* 在 `kungal.com` 通过 `URL 参数` 的形式将 `localStorage` 中的 `access-token` 给 `admin.kungal.com`
* 在 `admin.kungal.com` 发送 `POST` 请求携带该 `access-token` 给 `/api/admin/login` 
* 服务器解码该 `access-token` ，获得用户权限，如果用户有权限，则返回一个新的 `admin-token` 给 `admin.kungal.com`。注意，`access-token` 中已经签发了标志用户权限的信息
* `admin.kungal.com` 拿到该 `admin-token`，通过该 token 访问服务器资源。该 `token` 可以作为访问 `admin.kungal.com` 的凭证，并可以访问某些 `admin` 专属的接口资源

  

当用户直接访问 `admin.kungal.com` 时，注意，此时用户并未处于 `kungal.com`

* 服务器先检查 `localStorage` 有没有 `admin-token`，没有则跳转到 `kungal.com`，例如 `kungal.com/sso?callback=admin.kungal.com/login`
* 用户现在处于 `kungal.com/sso`，服务器检查用户的 `refresh-token`，检查无误后签发 `admin-refresh-token`，并跳转回 `admin.kungal.com`，例如 `admin.kungal.com/login?jwt=xxx`
* 用户现在处于 `admin.kungal.com`，服务器接收到 `admin-refresh-token`，验证其有效性，验证无误后签发 `admin-token`，然后有客户端保存在 `localStorage`

需要注意的是，这里的 `admin-refresh-token` 过期时间很短，例如 30s，这样签发完 `admin-token` 后可以使其在短时间内失效，保证其安全性

  

## OAuth 的实现原理（JWT）

`OAuth` 是一种授权框架，它有四种授权模式，我们这里仅研究最流行的授权码授权模式

`OAuth` 的核心有三个主体，用户，授权服务器，资源服务器

下面的过程，我们模拟 `GitHub` 的 `OAuth` 流程

### 鉴权过程

当用户直接访问 `admin.kungal.com` 时

* 用户在 `admin.kungal.com` 点击登录
* 用户被 `admin.kungal.com` 重定向到 `kungal.com/oauth`
* `kungal.com/oauth` 展示关于 `admin.kungal.com` 的有关信息，并询问用户是否授权 `admin.kungal.com` 访问自己账户的有关信息
* 用户点击确认授权，`kungal.com/oauth` 将用户重定向到 `admin.kungal.com`，并在 URL 中携带授权码
* `admin.kungal.com` 使用该授权码向 `kungal.com/oauth`（授权服务器）请求访问 `token`
* `kungal.com/oauth` 验证 `admin.kungal.com` 的授权码，返回给 `admin.kungal.com` 一个 `admin-token`
* `admin.kungal.com` 使用该 `admin-token` 请求资源服务器
* 资源服务器验证该 `admin-token`，返回 `admin.kungal.com` 想要的数据

授权服务器负责验证用户身份、颁发令牌，而资源服务器负责存储受保护的资源，并根据令牌控制资源的访问。

  

### CSRF

这个过程中很容易受到 `CSRF` 攻击，需要添加一些防范措施

**在过程 `admin.kungal.com` 将用户重定向到 `kungal.com/oauth` 时，可能的 url 为**

https://www.kungal.com/oauth?client_id=XXXXXXXXXXXXXXX&redirect_uri=https://admin.kungal.com/auth?scope=uid&state=XXXXXXXXXXXXXXXXX

#### 客户端 ID（client_id）

`admin.kungal.com` 需要证明自己是自己，所以需要先在 `kungal.com` 的数据库中记录自己预注册的数据，例如，网站标志，网站介绍等。

#### 重定向地址 (redirect_uri)

重定向地址需要和 `kungal.com` 保存的 `admin.kungal.com` 预注册地址相等，否则，攻击者可以将 `redirect_uri` 换为自己的网站，让自己的网站拿到授权码

#### 授权范围（scope）

`admin.kungal.com` 需要访问用户的哪些权限，例如头像，uid，萌萌点，用户名等

#### 状态码（state）

这是为了防止 `CSRF` 攻击的，之后 `admin.kungal.com` 携带授权码向 `kungal.com/oauth` 获取 `admin-token` 时，可以验证这个请求的真伪

  

在过程用户确认授权之后， `kungal.com/oauth` 将用户重定向到 `admin.kungal.com` 时，可能的 url 为

https://admin.kungal.com/auth?code=XXXXXXXXXXXXXXXXXXXX&state=XXXXXXXXXXXXXXXXXXXXXXXX

#### 授权码（code）

这是认证服务器颁发给请求服务器的授权码，请求服务器之后会使用这个授权码向认证服务器请求 `admin-token`

整个过程的示意图大概是这样的

![img](http://f1.market.xiaomi.com/download/MiPass/0f45243d348759584109cd6820a4bfb517342805a/passport_oauth_authorization_code.png)

https://dev.mi.com/console/doc/detail?pId=711#_2_1

  

## 实现

目前我开发的论坛 [`KUN Visual Novel`](https://kungal.com) 需要上线一个后台管理系统，我想着是时候折腾这个东东了。

因为前端一个 `Vue3` 一个 `Nextjs`，可预见的将来会有多个服务端

这个实现。。。感觉好麻烦。。。

我研究研究吧