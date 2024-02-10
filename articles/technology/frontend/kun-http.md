# 关于 http1.1 与 http2 中 statusText 区别认识 (响应拿不到 statusText)

## 结论

http2 中去掉了 `statusText` 这个响应字段，它变成了一个空字符串

然而 http1.1 中是有 `statusText` 这个响应字段的

## 描述

今天碰到一个问题，在 Nuxt3 项目的服务端，有这样的代码

```typescript
export default defineEventHandler(async (event) => {

  ...

  event.node.res.statusMessage = code.toString()

  ...
})
```

然后前端页面拿到这个 `event` 的值，之后完全找不到 `statusMessage` 的值，经过多次排查，确定 `statusMessage` 是一个空字符串

本机是 `Windows`，使用 `pm2`, `nginx` 测试可以拿到 `statusMessage`，然而生产环境 `Ubuntu` 使用完全一样的配置，却拿不到 `statusMessage`

并且除了 `statusMessage` 之外，响应的其它地方完全一样

## 分析

在 Nuxt3 中，使用了 `Nitro` 作为服务端，而 `Nitro` 又使用了 `h3` 这个请求库，所以这个 `event` 的类型是 `H3Event`

它大概是长这个样子的

```typescript
declare class H3Event<_RequestT extends EventHandlerRequest = EventHandlerRequest> implements Pick<FetchEvent, "respondWith"> {

    ...

    node: NodeEventContext;

    ...
}

interface NodeEventContext {
    req: IncomingMessage & {
        originalUrl?: string;
    };
    res: ServerResponse;
}

class ServerResponse<Request extends IncomingMessage = IncomingMessage> extends OutgoingMessage<Request> {
    
    ...
    
    /**
     * When using implicit headers (not calling `response.writeHead()` explicitly),
     * this property controls the status message that will be sent to the client when
     * the headers get flushed. If this is left as `undefined` then the standard
     * message for the status code will be used.
     *
     * ```js
     * response.statusMessage = 'Not found';
     * ```
     *
     * After response header was sent to the client, this property indicates the
     * status message which was sent out.
     * @since v0.11.8
     */
    statusMessage: string;

    ...
}
```

这个 `serverMessage` 是 `node:http` 里面的一个 `ServerResponse` 的一个属性，`ServerResponse` 来自于 `node:http`

然后我翻了一下 h3 这个库的源码，发现

```typescript
export async function _handlePlainRequest(app: App, request: PlainRequest) {

  ...

  return {
    statusText: nodeRes.statusMessage,
  };
}
```

类似于这样的地方还有很多，原来这个 `statusMessage` 就是 `statusText`

接着我去翻了一下 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText
)，然后惊奇的发现

> Note that HTTP/2 does not support status messages.

原来 `statusText` 这个属性已经被 http2 废弃了，怪不得前端找到死都找不到这个属性

本机环境我看了一下，请求是用 `http1.1` 发过去的，服务器端由于 `nginx` 配置了 ssl，所以用 http2 发过去了，这就导致了拿不到 `statusText`

## 解决方案

原本这个 `statusText` 是我用来做自定义错误码的，但是既然 `statusText` 用不了，这就意味着我整个网站的错误处理机制全部瘫痪（非常严重。。。修了大半天）

然后我查找了资料，发现一般情况下似乎这种信息可以直接写在响应头里

于是更改了一下后端请求

```typescript
export default defineEventHandler(async (event) => {

  ...

  event.node.res.setHeader('Kun-Error', code.toString())

  ...
})
```

前端直接使用

```typescript
if (context.response.status === 233) {
    kungalgameErrorHandler(context.response.headers.get('Kun-Error') || '')
    return
}
```

然后完美解决问题（

