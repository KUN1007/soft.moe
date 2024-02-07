# tRPC

今天看了一下 `tRPC` 的官网，了解了一下这个东东

https://trpc.io/docs/getting-started

我们的目的是在我们论坛的 `Nuxt3` [重构项目](https://github.com/KUN1007/kun-galgame-nuxt3)上使用 `tRPC`

## Concepts

RPC is short for "Remote Procedure Call". It is a way of calling functions on one computer (the server) from another computer (the client). With traditional HTTP/REST APIs, you call a URL and get a response. With RPC, you call a function and get a response.

```
// HTTP/REST
const res = await fetch('/api/users/1');
const user = await res.json();

// RPC
const user = await api.users.getById({ id: 1 });
```

tRPC (TypeScript Remote Procedure Call) is one implementation of RPC, designed for TypeScript monorepos. It has its own flavor, but is RPC at its heart.

这是核心，关键点就是

`RPC` 不用 `await.json()` 了，允许直接从前端调用后端的函数，而 `tRPC` 是 `RPC` 的 `Typescript` 实现。方便理解这么理解也可以，核心是这么个道理

## Quickstart

由于我们要用 `trpc-nuxt` 所以这里就不用官网的安装了，我们用 [`tRPC-nuxt` ](https://trpc-nuxt.vercel.app/)

https://trpc-nuxt.vercel.app/get-started/installation

先安装依赖

```shell
~ pnpm add @trpc/server @trpc/client trpc-nuxt zod
```

安装好之后在 `nuxt.config.ts` 里面加一个

```typescript
  build: {
    transpile: ['trpc-nuxt']
  }
```



## Zod

[官网](https://zod.dev/)

Zod is a TypeScript-first schema declaration and validation library. I'm using the term "schema" to broadly refer to any data type, from a simple `string` to a complex nested object.

它是一个用于创建 ts 类型和验证的库

类似的 Validators 还有

https://trpc.io/docs/server/validators

## 使用

在 Nuxt3 项目的 server 目录建一个 trpc 文件夹，新建一个 `trpc.ts`

```typescript
/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

export const router = t.router;
export const middleware = t.middleware;
```

  

---

  

我发现了一个问题。。。nuxt-trpc 的有关东东怎么这么少。。不研究了。。