# 安全性考虑和最佳实践

任何的部署都是有安全风险的，为了让我们的部署更加安全，我们可以考虑以下一些措施

## 使用 rsa 密钥连接 ssh

在 ssh 登陆部署的服务器时不采用密码，而采用密钥的形式，这会更加安全

一个基本的示例应该是这样的

```shell
ssh -i ~/.ssh/id_rsa root@107.107.107.107
```

关于如何生成 rsa 密钥，请 Google

## Mongodb 和 Redis 设置密码

默认情况下 `Mongodb` 和 `Redis` 都是没有密码的，但是建议在生产环境还是加上密码，更加保险

~~当然，不加也行，咕咕咕咕咕咕~~

## .env 文件的管理

在后端我们使用了 `dotenv`，它是一个读取文件夹根目录 `.env` 文件变量的库

我们的 `JWT Secret` 等重要信息都是保存在这个文件内的，所以该文件是需要妥善保管的

建议在生产环境将 `JWT Secret` 设置的尽可能复杂，几十位就可以

## 防火墙

有的时候访问不了我们想要的服务，这可能是因为开发服务器没有在防火墙开启对应的端口

在开放端口时请注意

## 用户密码

在任何时候我们都不能将用户密码以明文返回，以明文存储

## 数据库备份

请在合适的时间段内备份 `mongodb`
