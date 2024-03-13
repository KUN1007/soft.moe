# 如何运行本项目

本项目是由 Nuxt3 编写的，首先确保查看 Nuxt3 的官网，对此有基本的认识

## .env

在上一篇文档我们介绍了

[.env.example](/kun-visualnovel-docs/v2/introduction/structure#env-example)

我们提到了首先要根据该文件创建属于自己的 .env 文件，我们对 `.env.example` 中的字段进行解释

``` yaml

# 静默处理 AWS SDK 的警告信息，我们没有研究透 S3 api 的 V3 用法，使用了 V2 的用法，因此会提示让我们迁移到 V3
AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1"

# 本地 mongodb 的连接
MONGODB_URL = 'mongodb://127.0.0.1:27017/moemoemoe'

# 网站连接，保持即可
KUN_GALGAME_URL = 'https://www.kungal.com'

# API 请求地址，保持即可
KUN_GALGAME_API = 'http://www.kungal.com/api'

# Redis 的 host 和 port 配置
REDIS_HOST = '127.0.0.1'
REDIS_PORT = '6379'

# 发送邮件的配置，不设置也可以运行项目，但是无法发送验证码。这个配置项需要使用 smtp 服务，需要自己寻找配置
KUN_VISUAL_NOVEL_EMAIL_FROM = "KUN VISUAL NOVEL"
KUN_VISUAL_NOVEL_EMAIL_HOST = "KUN VISUAL NOVEL MOE EMAIL HOST"
KUN_VISUAL_NOVEL_EMAIL_ACCOUNT = "KUN VISUAL NOVEL MOE EMAIL ACCOUNT"
KUN_VISUAL_NOVEL_EMAIL_PASSWORD = "KUN VISUAL NOVEL MOE EMAIL PASSWORD"

# 图床的配置，不设置也可以运行项目，但是无法上传图片。这个配置需要使用图床的 API，需要自己寻找或开发
KUN_VISUAL_NOVEL_IMAGE_BED_ACCESS_KEY = "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
KUN_VISUAL_NOVEL_IMAGE_BED_SECRET_KEY = "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
KUN_VISUAL_NOVEL_IMAGE_BED_ENDPOINT = "https://image.kungal.com/kun"
KUN_VISUAL_NOVEL_IMAGE_BED_URL = "https://image.kungal.com"

# JWT 的相关配置，保持这个配置也可以，详细描述可以去 JWT 的官网查看
JWT_ISS = 'KUN VISUAL NOVEL ISS'
JWT_AUD = 'KUN VISUAL NOVEL KUNGALGAMER'
JWT_SECRET = 'KUN VISUAL NOVEL SECRET'

```

注意，必须要配置这个文件，否则项目无法运行

## 环境要求

本地环境即可，目前在 Windows, Ubuntu, Archlinux 上测试无误

Node.js 18 以上的环境

MongoDB 环境

Redis 环境

注意，我们仍然推荐使用 `nvm` 安装 `node`，使用 `pnpm` 进行项目启动，关于二者可以查看[这里](/technology/frontend/kun-frontend#作为一名-web-开发人员-学习路线是什么)

## 安装启动

具备了以上环境之后，请您将终端切换到项目的根目录，执行以下命令

安装包

``` shell
pnpm i
```

启动项目

``` shell
pnpm dev
```

如果项目正常启动，您将会看到以下内容

``` shell
❯ pnpm dev              

> kun-galgame-nuxt3@2.5.18 dev /home/kun/code/kun-galgame-nuxt3
> nuxt dev

Nuxt 3.9.3 with Nitro 2.8.1                                                                                                  1:51:55 PM
                                                                                                                             1:51:55 PM
  ➜ Local:    http://127.0.0.1:1007/
  ➜ Network:  use --host to expose

✔ Router autocompletions generated 🚦                                                                                       1:51:58 PM
ℹ Vite server warmed up in 3518ms                                                                                           1:52:02 PM
ℹ Vite client warmed up in 4581ms                                                                                           1:52:03 PM
✔ Nitro built in 1115 ms                                                                                              nitro 1:52:03 PM
redis: 127.0.0.1:6379 connection successful! 
MongoDB: mongodb://127.0.0.1:27017/kungalgame connection successful! 

```

现在，在浏览器中访问 `local` 中提示的 `http://127.0.0.1:1007/` 地址即可看到项目

