# Nuxt 3 + React + Koa 跨项目开发指南

## 说明

要实现管理系统的正常工作，您需要启动三个项目 `kun-galgame-nuxt3`, `kun-galgame-admin-react-awc`, `kun-galgame-admin-koa`

关于 admin 项目的启动，可以查看 [如何运行本项目的前后端](./run)

关于 Nuxt3 项目的启动，可以查看 [如何运行本项目](/kun-visualnovel-docs/v2/introduction/run)

## 新建用户

我们在 Version 2 的文档中提到过，在配置 Nuxt3 论坛项目的 `.env` 时，应该是没有配置论坛的邮件服务的

所以，无法使用注册时发送验证码的逻辑来注册用户

因此，要想注册用户，需要在用户点击发送验证码，后端生成验证码时，进行 `console.log()`  输出验证码，手动获取该验证码

请看到 `kun-galgame-nuxt3` 这个项目，根目录的 `/server/utils/generateRandomCode.ts` 文件，为该文件添加一行 `console.log(code)`

``` ts{8}
export const generateRandomCode = (length: number) => {
  const charset = '023456789abcdefghjkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    code += charset[randomIndex]
  }
  console.log(code)
  return code
}
```

此时，如果启动了 Nuxt3 项目，进行用户注册，发送验证码时就会在终端输出验证码，填写该验证码即可注册新用户

这里有一个细节，就是没有使用 `1`, `l`, `i` 等字符，这是为了避免混淆

## 用户 model 的 `roles` 字段解释


