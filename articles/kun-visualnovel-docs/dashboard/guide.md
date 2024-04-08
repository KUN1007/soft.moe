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

用户的 model（一般在我们项目的 `model` 文件夹中的 `user.ts`）中有一个字段 `roles`

``` ts
const UserSchema = new mongoose.Schema<UserAttributes>(
  {
    ...

    roles: { type: Number, default: 1 },

    ...
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```

在目前的项目版本 `2.6.5` 中，它有三个值

* roles = 1 用户
* roles = 2 管理员
* roles = 3 超级管理员

为了登录管理系统，需要手动将用户的 roles 字段改为 2 或 3，这样才能登录管理系统

我们建议将用户 roles 字段设为 3 以使用管理系统的全部功能

这里区分权限的目的主要是，我们有部分操作是直接**彻底删除数据**的，而不是仅仅改个字段，为了避免这些危险操作，我们开放了超级管理员

### 如何更改 roles 字段

如果本地有任何操作 MongoDB 的 GUI 功能，直接操作即可

如果没有的话，可以使用 `mongosh` 连接到 MongoDB 手动操作，例如

``` shell
mongosh

test> show dbs
admin                40.00 KiB
config               72.00 KiB
kungalgame            8.43 MiB
local               160.00 KiB
test> use kungalgame
switched to db kungalgame
kungalgame> db.users.updateOne( { uid: 1 }, { $set: { roles: 3 } )
```

## 登录管理系统

此时，本地的 MongoDB 数据库中应该已经有了部分数据，并且有了一个权限为 3 的用户

直接进入 `kun-galgame-admin-react-swc` 项目的浏览器地址，输入用户密码进行登录即可

不过登录完成后应该也没有任何数据，我们之后会提供部分的测试数据供开发使用
