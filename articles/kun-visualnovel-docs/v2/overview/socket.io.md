# Nuxt3 Socket.IO 实现实时聊天室

简单记录一下聊天室需要实现的功能, 因为代码逻辑比较多, 写着写着我自己都理不清了

## 功能概览

* 聊天室路由
* Nuxt3 layouts
* Nuxt3 使用 Socket.IO
* MongoDB 如何设计 ChatRoom Model 和 Chat Message Model
* 实时消息通知实现逻辑
* 消息持久化
* 错误处理
* 已读消息（咕咕咕中）
* 消息 Reactions（咕咕咕中）
* 撤回消息（咕咕咕中）
* 群聊（咕咕咕中）

## 聊天室路由

聊天室路由被设置为

* /message - 默认消息界面
* /message/notice - 论坛消息通知（收到用户点赞，评论等）
* /message/system - 论坛全体消息通知（管理员发布的消息通知）
* /message/user/[chatroom-id] 私聊聊天室（chatroom-id 根据两个用户的 uid 拼接生成）
* /message/group/[group-id] 群聊聊天室（开发中）

刚开始我本来想把路由设计成像 `Telegram` 的 `t.me/kungalgame` 那样干净的路由

但是我发现实现起来过于困难, 因为路由传参不好实现, 目前的设计更加符合直觉, 也方便之后的扩展, 于是就沿用这个路由了

其中 `chatroom-id` 通过一种简单的方式生成了用户双方独有且符合直觉的 chatroom-id

``` typescript
export const generateRoomId = (uid1: number, uid2: number): string => {
  const sortedUids = [uid1, uid2].sort((a, b) => a - b)
  return `${sortedUids[0]}-${sortedUids[1]}`
}
```

这会形成形如 `1-2`, `10-1007` 这样的 `chatroom-id`, 并且双方用户进入聊天使用的是同一个聊天室

不会出现一个用户创建聊天室之后, 另一个用户, 又进入了一个由相同用户的两个 uid 生成的但是顺序不同的 `chatroom-id` 这种情况

例如 `2-1`, `1007-10`

## Nuxt3 layouts

### 介绍

Nuxt3 有 [layouts](https://nuxt.com/docs/guide/directory-structure/layouts) 的用法, 可以轻易的定义出符合页面设计特性的通用的布局

本次我们也使用了这个布局, 在我们项目的 `/layouts/message.vue` 文件中

在 `pages` 下想要使用的页面中写入

``` typescript
definePageMeta({
  layout: 'message'
})
```

即可使用这个布局

### 问题

不过这个布局有些坑, 那就是不能使用 `<NuxtPage />` 传递参数, 经过我们的多此实验, 发现对于 Nuxt 来说, `layouts` 的加载渲染是要快于 `pages` 的

然而我们的用户界面布局也是可以重用的, 且必须要传递 uid 这个参数, 否则会造成数倍的数据库查询代价

有一个简单的方法是解决这个问题, 那就是使用 `defineNuxtRouteMiddleware` 定义一个 Nuxt route middleware 来辅助传递 params

可以参考 https://stackoverflow.com/questions/76127659/route-params-are-undefined-in-layouts-components-in-nuxt-3

对于我们的项目我们在 `/middleware` 文件夹下新建一个 `deliver-uid.ts` 文件, 写入

``` typescript
export default defineNuxtRouteMiddleware((to) => {
  useState('routeParamUid', () => to.params.uid)
})
```

然后在想要使用这个 middleware 的页面中写入

``` typescript
definePageMeta({
  middleware: 'deliver-uid'
})
```

这样就可以实现效果了, 但是！。。还是有问题

我们的页面是可以通过直接输入用户的 uid 访问的, 类似于 `https://www.kungal.com/kungalgamer/1/info` 这样的路由

然而, 当我们直接使用页面的固定链接访问页面时, 这个中间件并没有生效

这其实是预期之内的结果, 因为中间件仅会在指定了 `definePageMeta` 为 `deliver-uid` 的页面使用

可以将 `deliver-uid.global.ts` 以便其在全局生效, 但是由于我们的 uid 并不是全局的, 所以也无法使用

用户页面中的 uid 获取方法为

``` typescript
const uid = computed(() => {
  return parseInt((route.params as { uid: string }).uid)
})
```

这个 uid 是根据 route params 计算出的, 而不是根据页面的 `Url` 动态计算得出的, 我记得远古的时候根据 `Url` 计算似乎会导致奇怪的水合错误

所以。。懒得折腾用户页面的布局了, 沿用现在的路由设计

我们的消息界面当然是要用户登录之后才能使用的, 所以必须加上前端的鉴权 middleware

``` typescript
definePageMeta({
  middleware: 'auth'
})
```

然后在 `/public/robot.txt` 中写入 `Disallow: /message` 以免影响网站 SEO

## Nuxt3 使用 Socket.IO

### 介绍

Socket.IO 是一个用于实时通信的库 Realtime application framework (Node.JS server)

为什么选用它是因为对于 Nuxt 来说, `WebSocket` 直接使用起来貌似比 `Socket.IO` 还要麻烦一些（~~根据我们工具库都靠自己造的原则来说~~）

实际上 Nuxt3 使用的 server 框架 `nitro` 原生支持 `websocket`, 它使用了 `crossws`, 不过实在是找不到什么参考, 用起来太吃力了, 还是换回了 `Socket.IO` （~~nitro 性能居然比 hono 还要好一点~~）

还有就是 `Socket.IO` 兼容性比较好, 浏览器环境不支持 `WebSocket` 时会自动切换到 `pooling` 等方式上

~~但是意义不是很大, 因为这都什么年代了还有浏览器不支持 ws 吗~~

### 官方用法

这个实际上官方说明了 Nuxt3 如何使用 Socket.IO, 但是实际操作中有一些问题

Socket.IO 的文档: https://socket.io/how-to/use-with-nuxt

Nitro 的文档: https://nitro.unjs.io/guide/websocket

crossws 的文档: https://crossws.unjs.io/guide

但是这会带来一些问题, 诸如在 `/server/api` 中定义的 route 无法使用 `io` 实例等等

### 我们的用法

首先安装一下必要的依赖（虽然我们坚持不使用多余的包, 例如 ui 库, VueUse, Lodash 等, 但是这种包还是要安装的）

``` sh
pnpm i socket.io socket.io-client engine.io
```

然后在 `/server/plugins` 文件夹下新建一个 `socket.io.ts` 的文件, 编写下面的代码

``` typescript
import env from '../env/dotenv'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie-es'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
import { handleSocketRequest } from '~/server/socket/handleSocketRequest'
import type { NitroApp } from 'nitropack'
import type { Socket } from 'socket.io'
import type { KUNGalgamePayload } from '~/types/utils/jwt'

export interface KUNGalgameSocket extends Socket {
  payload?: KUNGalgamePayload
}

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  io.use((socket: KUNGalgameSocket, next) => {
    const token = parse(socket.request.headers.cookie || '')
    const refreshToken = token['kungalgame-moemoe-refresh-token']

    try {
      const payload = jwt.verify(
        refreshToken,
        env.JWT_SECRET || ''
      ) as KUNGalgamePayload
      socket.payload = payload
      next()
    } catch (error) {
      return error
    }
  })

  io.on('connection', handleSocketRequest)

  nitroApp.router.use(
    '/socket.io/',
    defineEventHandler({
      handler(event) {
        // event.node.req.context = event.context
        // @ts-expect-error private method
        engine.handleRequest(event.node.req, event.node.res)
        event._handled = true
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method
          const nodeContext = peer.ctx.node
          const req = nodeContext.req

          // @ts-expect-error private method
          engine.prepare(req)

          const rawSocket = nodeContext.req.socket
          const websocket = nodeContext.ws

          // @ts-expect-error private method
          engine.onWebSocket(req, rawSocket, websocket)
        }
      }
    })
  )
})
```

需要说明的是, 在 `plugins` 下似乎无法使用我们已有的工具函数 `getCookieTokenInfo`, 需要重新编写一遍鉴权的逻辑

`io.use` 这里就是使用了 `Socket.IO` 的鉴权中间件

`io.on` 这里的 `connection` 事件需要执行我们的消息首发逻辑, 过程比较多, 我们在 `/server` 下新建一个 `socket` 目录, 新建 `handleSocketRequest.ts` 重新编写我们的处理消息逻辑

鉴权好之后用户的 jwt payload 会被放在 socket 实例中的 payload 属性中

## MongoDB 如何设计 ChatRoom Model 和 Chat Message Model

我们需要考虑到的不只是一个简单的聊天功能, 我们尝试将聊天功能与 `Telegram` 这样美观先进的 chat-app 对标,因此我们的 db-model 需要设计的更加功能强大、易于扩展（~~但是更多的功能是否会咕咕咕我就不知道了~~）

考虑到我们要兼容一下 `private chat` 和 `chat group` 这两种类型的聊天, 我们需要新建两个 MongoDB model

### `/server/model/types/chat-message.d.ts`

``` typescript
import type { UserAttributes } from './user'

export interface MessageRead {
  uid: number
  read_time: number
}

export interface MessageReaction {
  uid: number
  reaction: string
}

export interface ChatMessageAttributes {
  cmid: number
  chatroom_name: string
  sender_uid: number
  receiver_uid: number
  content: string
  to_uid: number
  time: number
  status: 'pending' | 'sent' | 'read'
  is_recalled: boolean
  recalled_time: number
  read_by: MessageRead[]
  reactions: MessageReaction[]

  user: UserAttributes[]

  created: Date
  updated: Date
}
```

我们注意到这个 model, 有几点需要解释

`cmid` 和 `crid` 是每个 document 的唯一 id, 我们的项目为了保证纯净的 Url, 没有使用 MongoDB 的 _id

`content` 为聊天的消息内容, 目前不会支持 `Markdown`

`status` 为消息的状态, `pending` 为发送中, `sent` 为已发送, `read` 为已读

`is_recalled` 表示消息是否被撤回

`read_by` 是一个已读用户的数组, 标明这条消息被哪些用户已读 (这个功能似乎有点损害用户的隐私, 初版不会上线)

`reactions` 对消息的 `reactions`, 可以点赞这条消息等

### `/server/model/types/chat-room.d.ts`

``` typescript
interface LastMessage {
  sender_uid: number
  sender_name: string
  content: string
  time: number
}

export interface ChatRoomAttributes {
  crid: number
  name: string
  type: 'private' | 'group'
  avatar: string
  participants: number[]
  admins: number[]
  last_message: LastMessage

  created: Date
  updated: Date
}
```

用户每新建一个与其它用户的聊天, 或者创建一个群组, 都是新建了一个 `chatroom`

`type` 表明这个 `chatroom` 的类型, `private` 为私聊, `group` 为群聊（~~也许还有 `channel` 为频道, 咕咕咕咕咕咕咕~~）

`participants` 表示这个 `chatroom` 中有哪些用户, 如果是私聊的话这个数组中只有私聊用户两人的 uid

`admins` 表示 `chatroom` 的管理员, 仅对群组生效

`last_message` 表示 `chatroom` 的最后一条消息, 用于消息界面左侧的预览

### 可扩展性

例如如果要增加一个禁止用户私聊, 或者封禁群组的功能

只需要在这些 model 上面新建一个 `status` 的字段即可

### 为什么要用 last_message

一是快速, 如果要获取用户所加入的所有聊天室, 并根据聊天的时间进行排序, 那么只需要根据 `last_message.time` 对 documents 进行排序即可

二是方便, 经过我们的实践, 发现这个方法比使用 `virtue key` `populate` 出 message 都要方便

## 实时消息通知实现逻辑

整个消息的收发逻辑是这样的

### 用户加入聊天

当用户进入聊天页面的时候, 会为用户自动创建房间, socket 会发送一个 `private:join` 的 event, 并携带被聊天用户的 uid 发送给后端的 socket 实例

同时还会调用一个 `getMessageHistory` 的函数, 用以检查用户是否有历史消息

如果有历史消息, `nextTick` 之后会将用户消息窗口滚动到新消息的位置

前端

``` typescript
onMounted(async () => {
  socket.emit('private:join', uid)
  messages.value = await getMessageHistory()
  nextTick(() => scrollToBottom())
})
```

后端

``` typescript
  socket.on('private:join', (receiverUid: number) => {
    const uid = socket.payload?.uid
    userSockets.set(uid, socket)
    const roomId = generateRoomId(uid, receiverUid)
    socket.join(roomId)
  })
```

`socket` 检测到用户 `private:join` 的 event, 获取到前端发送的被聊天用户 uid, 此时, 后端拥有了聊天用户和被聊天用户双方的 uid

根据我们最前面提到的 `generateRoomId` 的逻辑, 两个用户互相聊天生成的 `chatroom-id` 的唯一的, 所以我们可以这么做

* 将用户 1 的 { uid: socket } 加入 userSockets 这个 Map
* 将用户 1 的 socket 实例 join 进 roomId 这个唯一的房间

同理, 用户 2 乃至用户 n 都会被加入 `roomId` 这个房间

由于用户自己的 uid 是通过 jwt payload 获取到的, 这意味着用户发送的消息不可能被假冒, 实现了鉴权的功能

由于用户双方生成的 `chatroom-id` 是唯一的, 这意味着不可能有其它用户发送的消息进入两个用户私聊的房间, 实现了私聊的功能

### 用户发出消息

前端

``` typescript
const sendMessage = async () => {
  if (!messageInput.value.trim()) {
    return
  }
  socket.emit('message:sending', uid, messageInput.value)
}
```

这里直接创建一个 `message:sending` 的 event 用于发送消息

后端

``` typescript
  socket.on('message:sending', async (receiverUid: number, content: string) => {
    const uid = socket.payload?.uid
    const sendingMessageUserSocket = userSockets.get(uid)

    const message = await sendingMessage(uid, receiverUid, content)

    const roomId = generateRoomId(uid, receiverUid)
    sendingMessageUserSocket.emit('message:sent', message)
    sendingMessageUserSocket.to(roomId).emit('message:received', message)
  })
```

1. 监测到前端发送的 `message:sending` 事件, 从刚刚我们保存的 userSockets Map 中尝试获取用户的 socket, 如果获取到, 则使用这个 socket 向房间中发送传递过来的消息

这里重新生成了双方的 `chatroom-id` 然后使用 `to()` 方法送达了指定的 chatroom, 并向前端的 socket 发送 `message:received` 事件, 携带了消息

需要注意的是, 这里使用到的是 `Socket.IO` 本身的特性, 具体来说就是

> 在 socket.io 中，当一个 socket 加入了某个房间（通过 `join(room)` 方法），如果该 socket 使用 `socket.to(room).emit(event, data)` 向这个房间广播消息，这个消息会发送给**除了发送者之外的所有已加入该房间的其他 socket**

1. 如果使用 `socket.emit(event, data)`, 消息只会发送给当前连接的客户端（即自身）

2. 如果使用 `socket.to(room).emit(event, data)` 或者 io.to(room).emit(event, data)，消息会广播给加入了该房间的其他 socket，但不包括发送消息的这个 socket

所以，假如 socket A 加入了房间 room1，它发出 `socket.to('room1').emit('someEvent', someData)`，那么房间 room1 中除了 A 以外的其他 socket（比如 B 和 C）都会收到 someEvent 事件，而 A 自己不会收到这个事件

想知道更多直接去 socket.io 官网

### 另一个用户收到消息

根据上面的分析, 另一个用户肯定会收到消息, 我们已经在前端监听了 `receivedMessage` 这个 event

``` typescript
  socket.on('message:received', (msg: Message) => {
    if (msg.receiverUid === currentUserUid && msg.sender.uid === uid) {
      messages.value.push(msg)
      replaceAsideItem(msg)
      nextTick(() => {
        scrollToBottom()
      })
    }
  })
```

注意, 根据上面的分析, 刚才发送的 `message:received` 这个 event, 只会被除了发送这个消息的用户之外的其它用户收到

当收到这个 event 之后, 我们将这个 event 携带的, 刚才另一个用户发送过来的 message, push 给当前用户已有的消息数组中, 并将当前用户的 message model 滚动, 然后就会出现一个神奇的效果

<video controls loop playsinline width="100%" src="https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202410041948002.mp4" />

### 更新侧边栏的消息

左侧的最新一条消息的预览当然要随着收到消息和发布消息一同变化, 这个功能的实现可以通过简单的替换左侧的 asideItems array 实现, 因为发送的消息 `Message` 类型都可以直接在本地被构建

上面的代码中, 注意到我们有一行 `replaceAsideItem()`, 这个函数实现了这个功能

```typescript
import type { AsideItem, Message } from '~/types/api/chat-message'

export const asideItems = ref<AsideItem[]>([])

export const replaceAsideItem = (message: Message) => {
  const targetIndex = asideItems.value.findIndex(
    (item) => item.chatroomName === message.chatroomName
  )

  if (targetIndex !== -1) {
    asideItems.value[targetIndex].content = message.content
    asideItems.value[targetIndex].time = message.time
    asideItems.value[targetIndex].count++
  }

  asideItems.value.sort((a, b) => b.time - a.time)
}
```

这里的核心是使用了 `findIndex` 这个方法, 使得响应式数组内容被替换的同时保持数组的响应性

对于最后的排序这一步, 如果有多个用户同时给此用户发消息, aside 的项目会根据发送的时间重新排列

而我们做到以上的步骤不需要任何新的请求, 这在目前看来是较为合理的

对于 Nuxt3 / Vue3 来说, 有一个叫 `<TransitionGroup>` 的组件, 本来我想到这里可以用到, 但是使用后却不生效, 原因未知, 它的效果大概是这样的

https://vuejs.org/examples/#list-transition

### 用户离开聊天

前端

``` typescript
const onKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    await sendMessage()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  socket.emit('leaveChat')
})
```

这里的 onKeydown 是用户按下 enter 发送消息的 event, 对于 `Vue` 来说可以在 `onBeforeUnmount` hook 上移除事件以免内存泄漏

然后我们向后端 socket 发送 `leaveChat` 这个 event

看起来的话, 是当用户切换到与另一个用户的聊天时, 视为退出与另一个用户的聊天

后端

``` typescript
  socket.on('leaveChat', async () => {
    const uid = socket.payload?.uid

    if (uid) {
      userSockets.delete(uid)
    }
  })
```

我们这里直接从刚才的 userSockets Map 中移除用户对应的 socket, 实现用户退出聊天的效果

注意, 我们其实没有必要这样写

``` typescript
socket.on('leaveChat', async (message: Message) => {
  const uid = socket.payload?.uid
  const sendingMessageUserSocket = userSockets.get(uid)

  if (sendingMessageUserSocket && uid) {
    const roomId = generateRoomId(uid, message.receiverUid)
    sendingMessageUserSocket.leave(roomId)
    userSockets.delete(uid)
  }
})
```

既然用户的 socket 都已经被移除了, 那么也就没有必要让用户的 socket 进行 leave 操作了

但是如果之后我们开发出更加复杂的聊天机制, 这样设计将会是必要的

### 加载历史消息

目前我们设置的是一次加载 30 条消息, 采用点击加载的方式

因为虚拟滚动的无限列表我还不会写, 写不好这个东东, 不想用现成的轮子

所以等以后我技术提高一些再做吧

前端

```typescript
const handleLoadHistoryMessages = async () => {
  if (!historyContainer.value) {
    return
  }

  const previousScrollHeight = historyContainer.value.scrollHeight
  const previousScrollTop = historyContainer.value.scrollTop

  pageData.page += 1
  const histories = await getMessageHistory()

  if (histories.length > 0) {
    messages.value.unshift(...histories)

    nextTick(() => {
      if (historyContainer.value) {
        const newScrollHeight = historyContainer.value.scrollHeight
        historyContainer.value.scrollTo({
          top: previousScrollTop + (newScrollHeight - previousScrollHeight)
        })
      }
    })
  } else {
    isLoadHistoryMessageComplete.value = true
  }
}
```

我们设计的是在消息的值变化时, 会自动将聊天容器滚动到底部, 但是在加载历史消息的时候我们并不需要这一点

我们需要的是让容器的滚动停留在加载历史消息的那个位置, 以便用户看到以前的消息和新加载出来的消息, 所以需要记录一下以前容器滚动了多高的距离

然后我们获取消息, 将旧的消息插入在当前已有消息的前面, 并滚动容器（这时是将容器滚动到当前保存的位置, 我们没有使用 `behavior: smooth` 的选项, 以便用户看起来页面是不动的）

同时判断消息是否加载完毕, 若加载完毕则停止加载

后端

```typescript
export default defineEventHandler(async (event) => {
  const userInfo = await getCookieTokenInfo(event)
  if (!userInfo) {
    return kunError(event, 10115, 205)
  }
  const uid = userInfo.uid

  const { receiverUid, page, limit }: MessageHistoryRequest = getQuery(event)
  if (!receiverUid || !page || !limit) {
    return kunError(event, 10507)
  }
  if (parseInt(receiverUid) === userInfo.uid) {
    return kunError(event, 10401)
  }
  if (limit !== '30') {
    return kunError(event, 10209)
  }
  const roomId = generateRoomId(parseInt(receiverUid), uid)

  const room = await ChatRoomModel.findOne({ name: roomId }).lean()
  if (!room) {
    await ChatRoomModel.create({
      name: roomId,
      type: 'private',
      participants: [uid, receiverUid],
      last_message: { time: Date.now() }
    })

    return []
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const histories = await ChatMessageModel.find({ chatroom_name: roomId })
    .sort({ cmid: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'uid avatar name', UserModel)
    .lean()

  const cmidArray = histories
    .filter((message) => !message.read_by.some((read) => read.uid === uid))
    .map((message) => message.cmid)
  if (cmidArray.length > 0) {
    await ChatMessageModel.updateMany(
      { cmid: { $in: cmidArray }, 'read_by.uid': { $ne: uid } },
      { $push: { read_by: { uid, read_time: Date.now() } } }
    )
  }

  const messages: Message[] = histories.map((message) => ({
    cmid: message.cmid,
    chatroomName: message.chatroom_name,
    sender: {
      uid: message.user[0].uid,
      name: message.user[0].name,
      avatar: message.user[0].avatar
    },
    receiverUid: parseInt(receiverUid),
    content: message.content,
    time: message.time,
    status: message.status
  }))

  return messages.reverse()
})
```

我们接受了 `receiverUid`, `page`, `limit` 这三个查询参数, 然后根据分页的信息查询出了对应的 histories, 最后调用 `reverse()` 将其返回, 因为消息的发送是从旧到新的

我们在向前端返回这些消息的同时已读了消息, 这样不用多次请求

我尝试用 `IntersectionObserver` 写过根据窗口内可见消息数量已读消息的逻辑, 但是太过复杂, 第一版本暂时去掉实时已读的功能

## 消息持久化

发出去的消息当然是要保存的, **我们目前并不会承诺将用户的聊天记录永久保存**, 因为之后可能会有大的变动导致消息全部丢失

但是这种不可逆的破坏性更改, 可能性较低

### 聊天室持久化

当用户点击另一个用户主页的聊天按钮时, 会触发聊天, 这时会初始化一个聊天室

如果聊天室里没有任何消息, 双方都是看不到聊天室的

在我们上面获取历史消息的代码中, 存在下面的代码

```typescript
  const roomId = generateRoomId(parseInt(receiverUid), uid)

  const room = await ChatRoomModel.findOne({ name: roomId }).lean()
  if (!room) {
    await ChatRoomModel.create({
      name: roomId,
      type: 'private',
      participants: [uid, receiverUid],
      last_message: { time: Date.now() }
    })

    return []
  }
```

在进入另一个用户聊天界面时, 会获取一次消息, 如果没有房间, 会自动为两个用户之间创建一个聊天室

这其实是群聊的雏形, 我们在设计时就考虑好了以后扩展的可能性

### 发送消息持久化

我们在上面用户发送消息, 调用 `message:sending` 的时候, 就可以将用户发送的消息保存在数据库中了

上面的 `message:sending` 中间有一句 `const message = await sendingMessage(uid, receiverUid, content)`, 它的实现是这样的

```typescript
import UserModel from '~/server/models/user'
import ChatRoomModel from '~/server/models/chat-room'
import ChatMessageModel from '~/server/models/chat-message'
import type { Message } from '~/types/api/chat-message'

export const sendingMessage = async (
  uid: number,
  receiverUid: number,
  content: string
) => {
  const user = await UserModel.findOne({ uid }).lean()

  const roomId = generateRoomId(receiverUid, uid)
  await ChatRoomModel.findOneAndUpdate(
    { name: roomId },
    {
      last_message: {
        content,
        time: Date.now(),
        sender_uid: uid,
        sender_name: user!.name
      }
    }
  )

  const message = await ChatMessageModel.create({
    chatroom_name: roomId,
    sender_uid: uid,
    receiver_uid: receiverUid,
    content,
    status: 'sent'
  })

  const responseData: Message = {
    cmid: message.cmid,
    chatroomName: message.chatroom_name,
    sender: {
      uid: user!.uid,
      name: user!.name,
      avatar: user!.avatar
    },
    receiverUid: receiverUid,
    content: message.content,
    time: message.time,
    status: message.status
  }

  return responseData
}
```

可以看到, 我们在发送消息时, 首先更新了两个用户所在的聊天室的最后一条消息的信息, 然后创建了消息并返回

我们目前的还不是完整版, 之后还会加入撤回消息的功能

## 错误处理

`Socket.IO` 在是不会返回数据的, 数据仅存在与回调函数中, 这意味着错误处理也需要使用 socket.io 本身来处理

在完整的 `message:sending` event 中, 有下面的代码

```typescript
    if (!uid) {
      socket.emit(ERROR_CODES.MISSING_UID)
      return false
    }
    if (uid === receiverUid) {
      socket.emit(ERROR_CODES.CANNOT_SEND_MESSAGE_TO_YOURSELF)
      return false
    }
    if (!sendingMessageUserSocket) {
      socket.emit(ERROR_CODES.INVALID_SOCKET)
      return false
    }
```

由于错误的类型目前较少, 我们采用简单的对象 key-value 存储错误信息, 然后使用 socket 返回给前端

注意这里 `emit` 没有 `to`, 这意味着会返回错误给消息的发布人

前端我们也可以使用一个简单的对象映射来解决错误处理

``` typescript
const ERROR_MESSAGES = {
  'socket:error:1': {
    'en-us': 'User ID is missing, please log in again.',
    'ja-jp': 'ユーザーIDが見つかりません。再度ログインしてください。',
    'zh-cn': '用户 ID 丢失，请重新登录。',
    'zh-tw': '使用者 ID 遺失，請重新登入。'
  },
  'socket:error:2': {
    'en-us': 'Invalid user socket, please refresh the page.',
    'ja-jp': '無効なユーザー接続です。ページを更新してください。',
    'zh-cn': '无效的用户连接，请刷新页面。',
    'zh-tw': '無效的使用者連線，請重新整理頁面。'
  },
  'socket:error:3': {
    'en-us': 'Cannot send a message to yourself.',
    'zh-cn': '不能给自己发送消息。',
    'ja-jp': '自分にメッセージを送信することはできません。',
    'zh-tw': '不能傳送訊息給自己。'
  }
}

export const useSocketIOErrorHandler = () => {
  const socket = useSocketIO()

  onMounted(() => {
    socket.on('socket:error:1', () =>
      useMessage(ERROR_MESSAGES['socket:error:1'], 'error')
    )

    socket.on('socket:error:2', () =>
      useMessage(ERROR_MESSAGES['socket:error:2'], 'error')
    )

    socket.on('socket:error:3', () =>
      useMessage(ERROR_MESSAGES['socket:error:3'], 'error')
    )
  })
}
```

这可以成为一个简单的 `composables` 以用于任何组件中

其中 `useMessage` 的签名为

``` typescript
/**
 * @param {number} messageData - Message i18n object
 * @param {type} type - Type of the message, can be one of `warn`, `success`, `error`, or `info`
 * @param {number} duration - Display duration of the message, optional, default is 3 seconds
 * @param {boolean} richText - Whether the message text support html
 */
export const useMessage = (
  messageData: number | KunLanguage,
  type: MessageType,
  duration?: number,
  richText?: boolean
) => {}
```

它是可以接受一个 `KunLanguage` 对象作为参数直接实现 i18n 的, 无需使用 `$t()`, 这在一定程度上增加了便利

## 已读消息（咕咕咕中）

这个功能较为复杂, 需要考虑下面的点

1. 如何设计已读消息的逻辑
2. 数据库层面如何实现已读消息
3. 用户在发表消息时, 如果另一个用户也在看着这个用户发表的消息, 如何让这个用户立即知道他的消息已读了
4. 用户在切换到与别的用户的聊天页面时, 有别的用户同时给他发消息, 侧边栏的消息计数如何更新
5. 用户会将窗口向上滚动以阅读消息, 如何在用户阅读消息时立即让另一名用户知道他的消息已读
6. 还有很多细节...

上面这些我已经实现了, 但是还是存在细微的错误, 于是。。。~~还是把已读功能咕咕咕掉吧~~

## 消息 Reactions（咕咕咕中）

类似于 Telegram 的 Message Reactions, 现代聊天软件应该普遍支持

## 撤回消息（咕咕咕中）

## 群聊（咕咕咕中）

~~这个是真的有可能彻底咕咕咕了~~
