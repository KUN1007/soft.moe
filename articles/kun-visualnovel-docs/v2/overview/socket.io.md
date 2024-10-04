# Nuxt3 Socket.IO 实现实时聊天室

简单记录一下聊天室需要实现的功能, 因为代码逻辑比较多, 写着写着我自己都理不清了

## 功能概览

* 聊天室路由
* Nuxt3 layouts
* Nuxt3 使用 Socket.IO
* MongoDB 如何设计 ChatRoom Model 和 Chat Message Model
* 实时消息通知实现逻辑
* 消息持久化

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

### `/server/model/chat-message.ts`

``` typescript
import mongoose from 'mongoose'
import increasingSequence from '../utils/increasingSequence'
import type { ChatMessageAttributes } from './types/chat-message'

const ChatMessageSchema = new mongoose.Schema<ChatMessageAttributes>(
  {
    cmid: { type: Number, unique: true },
    crid: { type: Number, required: true },
    sender_uid: { type: Number, required: true },
    receiver_uid: { type: Number, default: 0 },
    content: { type: String, default: '', maxlength: 1000 },
    time: { type: Number, default: () => Date.now() },
    status: { type: String, default: 'pending' },
    is_recalled: { type: Boolean, default: false },
    recalled_time: { type: Number },
    read_by: {
      type: [
        {
          uid: { type: Number, required: true },
          read_time: { type: Number, required: true }
        }
      ],
      default: []
    },

    reactions: {
      type: [
        {
          uid: { type: Number, required: true },
          reaction: { type: String, required: true }
        }
      ],
      default: []
    }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

ChatMessageSchema.pre('save', increasingSequence('cmid'))

ChatMessageSchema.virtual('user', {
  ref: 'user',
  localField: 'sender_uid',
  foreignField: 'uid'
})

const ChatMessageModel = mongoose.model('chat_message', ChatMessageSchema)
export default ChatMessageModel
```

我们注意到这个 model, 有几点需要解释

`cmid` 和 `crid` 是每个 document 的唯一 id, 我们的项目为了保证纯净的 Url, 没有使用 MongoDB 的 _id

`content` 为聊天的消息内容, 目前不会支持 `Markdown`

`status` 为消息的状态, `pending` 为发送中, `sent` 为已发送, `read` 为已读

`is_recalled` 表示消息是否被撤回

`read_by` 是一个已读用户的数组, 标明这条消息被哪些用户已读 (这个功能似乎有点损害用户的隐私, 初版不会上线)

`reactions` 对消息的 `reactions`, 可以点赞这条消息等

### `/server/model/chat-room.ts`

``` typescript
import mongoose from 'mongoose'
import increasingSequence from '../utils/increasingSequence'
import type { ChatRoomAttributes } from './types/chat-room'

const ChatRoomSchema = new mongoose.Schema<ChatRoomAttributes>(
  {
    crid: { type: Number, unique: true },
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    type: { type: String, required: true },
    participants: { type: [Number], required: true },
    admins: { type: [Number], default: [] },
    last_message: {
      content: { type: String, default: '' },
      time: { type: Number, default: 0 },
      sender_uid: { type: Number, default: 0 },
      sender_name: { type: String, default: '' }
    }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

ChatRoomSchema.pre('save', increasingSequence('crid'))

const ChatRoomModel = mongoose.model('chat_room', ChatRoomSchema)

export default ChatRoomModel
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

当用户进入聊天页面的时候, 会为用户自动创建房间, socket 会发送一个 `joinChat` 的 event, 并携带被聊天用户的 uid 发送给后端的 socket 实例

同时还会调用一个 `getMessageHistory` 的函数, 用以检查用户是否有历史消息

如果有历史消息, `nextTick` 之后会将用户消息窗口滚动到新消息的位置

前端

``` typescript
onMounted(async () => {
  messages.value = await getMessageHistory()
  socket.emit('joinChat', uid)
  nextTick(() => scrollToBottom())
})
```

后端

``` typescript
  socket.on('joinChat', (receiverUid: number) => {
    const uid = socket.payload?.uid
    userSockets.set(uid, socket)

    if (uid) {
      const roomId = generateRoomId(uid, receiverUid)
      socket.join(roomId)
    }
  })
```

`socket` 检测到用户 `joinChat` 的 event, 获取到前端发送的被聊天用户 uid, 此时, 后端拥有了聊天用户和被聊天用户双方的 uid

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

  const newMessage = await $fetch(`/api/message/chat/private`, {
    method: 'POST',
    query: { receiverUid: uid },
    body: { content: messageInput.value },
    watch: false,
    ...kungalgameResponseHandler
  })

  if (typeof newMessage !== 'string') {
    messages.value.push(newMessage)
    socket.emit('sendingMessage', newMessage)
    messageInput.value = ''
  }

  nextTick(() => scrollToBottom())
}
```

用户先将消息发送给后端, 将消息创建好, 返回创建的消息

如果消息成功创建, 就从后端拿到刚刚创建好的消息, 使用 socket 的 `emit` 传递给后端 `sendingMessage` 事件, 并携带新创建的消息

`nextTick` 之后使用户的聊天容器滚动到最底部的位置

后端

``` typescript
  socket.on('sendingMessage', async (message: Message) => {
    const uid = socket.payload?.uid
    const sendingMessageUserSocket = userSockets.get(uid)

    if (sendingMessageUserSocket && uid) {
      const roomId = generateRoomId(uid, message.receiverUid)
      sendingMessageUserSocket.to(roomId).emit('receivedMessage', message)
    }
  })
```

监测到前端发送的 `sendingMessage` 事件, 从刚刚我们保存的 userSockets Map 中尝试获取用户的 socket, 如果获取到, 则使用这个 socket 向房间中发送传递过来的消息

这里重新生成了双方的 `chatroom-id` 然后使用 `to()` 方法送达了指定的 chatroom, 并向前端的 socket 发送 `receivedMessage` 事件, 携带了消息

需要注意的是, 这里使用到的是 `Socket.IO` 本身的特性, 具体来说就是

> 在 socket.io 中，当一个 socket 加入了某个房间（通过 `join(room)` 方法），如果该 socket 使用 `socket.to(room).emit(event, data)` 向这个房间广播消息，这个消息会发送给**除了发送者之外的所有已加入该房间的其他 socket**

具体来说

如果使用 `socket.emit(event, data)`, 消息只会发送给当前连接的客户端（即自身）

如果使用 `socket.to(room).emit(event, data)` 或者 io.to(room).emit(event, data)，消息会广播给加入了该房间的其他 socket，但不包括发送消息的这个 socket

所以，假如 socket A 加入了房间 room1，它发出 `socket.to('room1').emit('someEvent', someData)`，那么房间 room1 中除了 A 以外的其他 socket（比如 B 和 C）都会收到 someEvent 事件，而 A 自己不会收到这个事件

想知道更多直接去 socket.io 官网

### 另一个用户收到消息

根据上面的分析, 另一个用户肯定会收到消息, 我们已经在前端监听了 `receivedMessage` 这个 event

``` typescript
onMounted(async () => {
  socket.on('receivedMessage', (msg: Message) => {
    messages.value.push(msg)
    nextTick(() => scrollToBottom())
  })
  nextTick(() => scrollToBottom())
})
```

注意, 根据上面的分析, 刚才发送的 `receivedMessage` 这个 event, 只会被除了发送这个消息的用户之外的其它用户收到

当收到这个 event 之后, 我们将这个 event 携带的, 刚才另一个用户发送过来的 message, push 给当前用户已有的消息数组中, 并将当前用户的 message model 滚动, 然后就会出现一个神奇的效果

<video controls loop playsinline width="100%" src="https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202410041948002.mp4" />

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

TODO:

## 消息持久化
