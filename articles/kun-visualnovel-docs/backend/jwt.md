# JWT (JSON Web Token)

## 介绍

由于我们的项目是一个论坛，所以我们需要鉴权手段，这里我们使用了 `JWT` 作为鉴权手段

JWT 是一种很常见的令牌生成方案，这是它的官网

[JWT Documentation](https://jwt.io/introduction)

## 使用

本项目中使用了双 token（access-token + refresh-token） 作为鉴权手段

关于双 token 的实现，我们可以在下面的文章中找到

[SSO 与 OAuth 2.0 # 双-token-认证](/technology/backend/kun-sso-oauth#双-token-认证)

上面的文章已经非常详细的介绍了本项目的 JWT 双 Token 实现原理，这里不再赘述
