# Redis

## 介绍

Redis 用作缓存，主要用来缓存一些访问量较大的数据查询，以减轻数据库的查询压力

官网的描述是

> Redis is an open source (BSD licensed), in-memory data structure store used as a database, cache, message broker, and streaming engine.

[Redis Documentation](https://redis.io/docs/about/)

## 使用

在本项目中，我们使用了 ioredis 这个库，这是使用 `Nodejs` 来操作 Redis 的良好实践

Redis 的配置文件在 `src/config/redisConfig.ts` 文件下

```typescript
import Redis from 'ioredis'
import env from '@/config/config.dev'

const redisClient = new Redis({
  port: parseInt(env.REDIS_PORT),
  host: env.REDIS_HOST,
})

redisClient.on('connect', () => {
  console.log(
    `redis: ${env.REDIS_HOST}:${env.REDIS_PORT} connection successful! `
  )
})
```

和前面的 `Mongoose` 操作 `Mongodb` 一样，我们使用了 `.env` 文件中的环境变量

`.env` 文件中读取出来的 key-value 都是 `string` 类型，所以我们将 `REDIS_PORT` 转换为 `number`

我们将 Redis 的基本操作封装为了三个函数便于操作

## RedisInsight

如果不喜欢 Redis-cli 直接操作 redis，可以使用 Redis 官方的 GUI 操作工具 `RedisInsight`

[RedisInsight Offical Website](https://redis.com/redis-enterprise/redis-insight/)

官网的描述为

> The best Redis GUI

## 例子

在我们的项目中，Redis 主要在下面几个地方用到

### 登陆冷却时间

可以看到 `src/controller/userController.ts` 中的 `login` 这个类成员函数

```typescript
const loginCD = await getValue(`loginCD:${name}`)

if (loginCD) {
    ctx.app.emit('kunError', 10112, ctx)
    return
} else {
    setValue(`loginCD:${name}`, name, 60)
}
```

这里我们借助 Redis 的失效时间实现了登陆冷却时间，如果有其他地方有这个需求也可以用类似的方法实现

### JWT 有效时间

可以看到 `src/service/authService.ts` 中的 `generateTokens` 这个类成员函数

```typescript
    await setValue(`refreshToken:${uid}`, refreshToken, 7 * 24 * 60 * 60)
```

这里将 token 在 `redis` 中留存一份，便于后续的操作

### 验证码有效时间

可以看到 `src/service/authService.ts` 中的 `sendVerificationCodeEmail` 这个类成员函数

同样的，它是利用 Redis 的过期时间实现的
