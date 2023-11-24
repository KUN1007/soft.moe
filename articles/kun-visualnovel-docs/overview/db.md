# 数据库（MongoDB）和缓存（Redis）的安装和配置

## 安装

安装过程可以很轻松的 google 找到

安装成功后，理论上可以直接启动项目，因为初始的 `Mongodb` 是没有密码的

## 配置

### Mongodb

Mongodb 的配置文件位于 `src/db/connection.ts` 文件中

有以下两个连接

``` typescript
// const DB_URL = `mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_HOSTNAME}:${env.MONGO_PORT}/${env.DB_NAME}`
const DB_URL = `mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}`
```

连接是通过环境变量读取环境中的 `Host`, `Port` 等配置信息来建立连接的，需要在项目根目录的 `.env` 文件中定义对应的变量名

第一个连接是带用户名和密码的连接，可以根据需求定义

### Redis

Redis 的配置文件位于 `src/config/redisConfig.ts` 文件中

同样，需要在 `.env` 文件中定义以下两个变量，可以根据自己的需求扩展连接配置

``` typescript
const redisClient = new Redis({
  port: parseInt(env.REDIS_PORT),
  host: env.REDIS_HOST,
})
```

---

我们在 `redisConfig.ts` 文件中封装了三个方法，`getValue`, `setValue`, `delValue`

分别对应 Redis 的常用三个基本操作
