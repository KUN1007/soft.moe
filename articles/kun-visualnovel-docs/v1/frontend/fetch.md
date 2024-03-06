# Fetch

## 介绍

`fetch` 是浏览器原生的 `API`，不需要安装任何的包，这是它最大的优点

性能和 `axios` 不相上下，甚至在某些方面优于 `axios`，可以 Google 一下 `fetch vs axios`

> 为什么不用 `axios`？

`axios` 都被用烂了，天天封装封装，好烦。还有一个原因是我的一个好朋友讨厌 `axios`

它的缺点是不支持 `axios` 那样的拦截器（不算是缺点，但是对于这个项目而言它是缺点，也有可能是我还没找到更好的解决方案）

## 结构

本项目中的 `fetch` 封装在 `src/utils/request.ts` 文件中（哎。。。还是封装了一下），它导出了五个函数

fetchGet, fetchPost, fetchPut, fetchDelete, fetchPostWithFormData

其中第五个函数是用于上传用户头像的，所以需要 `formData`，其他的字面意思

本项目约定只会在 `src/api` 和 `src/hooks` 这两个文件夹中调用这五个 `fetch` 函数

## 错误处理

本项目中的错误处理暂时仅有 `fetch`，它位于 `src/error` 目录

`errorHandler.ts` 是根据后端返回的错误码显示对应的错误信息

`errorI18n.ts` 是将错误信息对应后端的错误码进行输出展示给用户，支持 `i18n`

`onRequestError.ts` 是一个错误处理函数，当请求出现错误时它会被触发

## token 无感知刷新

本项目中使用了无感刷新 `token` 的技术，可以在 `src/utils/request.ts` 以及 `src/utils/requestRefresh.ts` 中看到

无感刷新我们在这篇文章中提到过: [SSO 与 OAuth 2.0](/technology/backend/kun-sso-oauth#双-token-认证)

## request.ts

这是对 `fetch` 的基本封装，它主要实现了下面几个功能

* 在请求时带上 `Authorization` 头部，携带 `token` 给后端认证
* 配置 `credentials: 'include'` 以允许后端携带凭据，设置了这个后后端设置的 `cookie` 才能被保存到前端浏览器（大坑！）
* 配置 `baseUrl` 和 `fullUrl`，请求时路径更加方便
* 将 `fetch` 分为 `'GET' | 'POST' | 'PUT' | 'DELETE'` 几种基本功能，使逻辑更加清晰
* 错误处理集成

### kunFetchRequest

这是对 `fetch` 的基本封装，除了上面提到的几点外，需要注意的是

```typescript
if (response.status === 205) {
    const newResponseData = await requestRefresh(fullUrl, options)
    const data: T = await newResponseData.json()
    return data
} else if (!response.ok) {
    // Handle some known backend error
    await onRequestError(response)
    return {} as T
} else {
    const data: T = await response.json()
    return data
}
```

这里的作用其实仅为了在 `token` 过期时无感刷新 `token`，由于设置为错误会在控制台输出错误（实际上没有错误，只是在请求 token 的过程中发生了一次预料之中的错误），这里为了美观就在后端把状态设置为 205 了，这也是成功请求，所以不会报错

当响应为 205 时，会尝试刷新 `access-token`，若 token 刷新成功则会重新获取数据并返回

注意，这里的 `205` 是和后端约定好的（我就不想看到控制台报错，来打我呀～）

### fetchGet

这是对 `kunFetchRequest` 的 `GET` 请求封装

```typescript
const fetchGet = async <T>(
  url: string,
  headers?: Record<string, string>
): Promise<T> => {
  const options: FetchOptions = {
    method: 'GET',
    credentials: 'include',
    headers: headers,
  }

  return await kunFetchRequest<T>(url, options)
}
```

下面的几个请求用的也是同样的手法

## requestRefresh

该文件位于 `src/utils/requestRefresh.ts`

它的作用就是在请求响应为 205 的时候尝试刷新 token

如果刷新 token 成功，它就会携带新的数据返回，如果刷新 token 失败，则将用户跳转到登录页面


## 使用

举例 `src/api/balance/index.ts` 中的例子

```typescript
import { fetchGet } from '@/utils/request'
import type * as Balance from './types/balance'
// Function to convert an object to query parameters
import objectToQueryParams from '@/utils/objectToQueryParams'

// Get income
export async function getIncomeApi(
  requestData: Balance.BalanceIncomeRequestData
): Promise<Balance.BalanceIncomeResponseData> {
  const queryParams = objectToQueryParams(requestData)
  const url = `/balance/income?${queryParams}`

  const response = await fetchGet<Balance.BalanceIncomeResponseData>(url)
  return response
}
```

可以看到使用 `fetch` 时仅需要将 `url` 传入即可返回后端的数据

## hooks

除了在 `src/api` 中使用 `fetch`，我们还在 `src/hooks` 中使用了 `fetch`

用法是一样的，这里就不多说了
