# Route

前端有路由，后端当然也有，前端发送请求的那一串地址的指向，这就是后端定义的路由

本项目我们使用了 `koa-router` 作为 Koa 应用的路由，这是 Koa 官方的路由

## 介绍

我们的路由主要文件夹位于后端项目的 `src/routes` 文件夹下，它的结构为

* modules. 不同的路由
* routes.ts 路由的索引文件

我们在 `src/index.ts` 入口文件引入了 `routes.ts` 导出的路由配置函数，来使用 `koa-router`

### koa-combine-routers

在 `routes.ts` 中我们使用了 `koa-combine-routers` 这个包来将 `modules` 文件夹下的目录进行结合

传统的 `koa-router` 需要在 `index.ts` 文件中多次调用 `koa-router` 来使用路由，比较麻烦，使用了这个包之后只需要 `app.use()` 就可以搞定，非常方便

## REST API

[REST API](https://www.ibm.com/topics/rest-apis#:~:text=A%20REST%20API%20is%20an,sometimes%20referred%20to%20RESTful%20APIs.) 是一种 API 设计标准，在本项目中，它有如下体现

* API 请求路径中不含有动词
* 请求同一路径时根据请求方法的不同而进行不同的操作
* 直观定义该资源属于哪个路径

需要注意的是，上面的说法是为了方便理解而解释的，定义还是看[更加专业的定义](https://restfulapi.net/)

### 举例

请看到 `src/routes/modules/topicRouter.ts`

```typescript
import Router from 'koa-router'
import TopicController from '@/controller/topicController'

const router = new Router()

router.prefix('/api/topics')

router.post('/', TopicController.createTopic)

router.get('/:tid', TopicController.getTopicByTid)

router.put('/:tid', TopicController.updateTopic)

router.put('/:tid/upvote', TopicController.updateTopicUpvote)
```

可以看到我们使用 `tid` 这个唯一 ID 标识了资源的唯一路径

我们的 getTopicByPid 和 updateTopic 都指向了 `/api/topic/:tid` 这个路径，但是通过请求方式的不同我们合理的区分了 API

注意到 `router.prefix()`，我们将路由的开头都加上了特定的前缀，并且以 `/api` 开头

