# Pinia

## 介绍

`Pinia` 是 Vue 官方最推荐的状态管理库，我们在本项目中理所当然的使用了 `Pinia`

在 Vue 中，Pinia 一般用来做全局的数据传递

本项目的 `Pinia` 位于 `src/store` 目录

## pinia-plugin-persistedstate

这是使 `Pinia` 的存储变得持久化的 `Pinia` 插件，持久化后的 `Pinia` store 会被存放在 `localStorage` 中

## 结构

本项目的 `src/store` 目录有以下几个项目

* modules. 持久化存储过的 pinia，里面配置的 store 都是在 `localStorage` 中持久化过的
* temp. 临时的 store，未持久化，使用默认的 Pinia
* types. store 的 `Typescript` 类型支持
* utils. 一些用于 store 的工具函数
* index.ts 用于安装 `Pinia` 和重置 `Pinia` 的索引

我们在 `src/api` 文件夹中定义的 `api`，在 `store` 中会重新定义一次，一是为了更简洁的命名，二是为了便于 store 和 api 交互数据

### modules

我们举例 `home.ts`

```typescript
import { defineStore } from 'pinia'
import type { HomeStorePersist } from '../types/home'

export const usePersistKUNGalgameHomeStore = defineStore({
  id: 'KUNGalgameHome',
  persist: true,
  state: (): HomeStorePersist => ({
    isActiveMainPageAside: true,

    searchHistory: [],
  }),
})
```

我们使用了 `use XXX store` 作为命名的良好规范，并且，在配置了 `persist: true` 的前提下，我们写为 `usePersist XXX store`

`defineStore` 是 `Pinia` 的内置函数，用于定义一个 store

`HomeStorePersist` 是该 store 的 `interface`，它的定义为

```typescript
export interface HomeStorePersist {
  // Other stores
  // Whether to activate the left interactive panel of the main page
  isActiveMainPageAside: boolean

  // Storage for search history
  searchHistory: string[]
}
```

### temp

我们举例 `edit.ts`，注意，这里的 store 都配置为 `persist: false`

```typescript
import { updateNewTopicApi } from '@/api'

import type {
  EditUpdateTopicRequestData,
  EditUpdateTopicResponseData,
} from '@/api'

import { checkTopicPublish } from '@/store/utils/checkTopicPublish'
```

我们导入了在 `src/api` 中定义的接口，以及接口参数和返回的类型，导入了检查话题发布是否合法的函数 `checkTopicPublish`

我们在 `actions` 配置了下面两个函数

```typescript
// Update a topic
async rewriteTopic(): Promise<EditUpdateTopicResponseData | undefined> {
},

// Reset data for re-editing a topic
resetRewriteTopicData() {
},
```

`rewriteTopic` 是对导入接口的封装，它增加了一些验证的函数，并且确保了数据的流入，使用的时候只需要传入个别参数就可以

`resetRewriteTopicData` 用于重置 store 的状态，这和 `Pinia` 自带的 `$reset()` 是不同的，`$reset()` 会重置掉当前函数所有的 store 项目，自定义的可以确保哪些状态不会被重置

### types

我们举例 `edit.d.ts`

```typescript
export interface EditStorePersist {
  editorHeight: number
  textCount: number

  title: string
  content: string
  tags: Array<string>
  category: Array<string>

  // Whether to display hot keywords
  isShowHotKeywords: boolean
  // Whether to save the topic
  isSaveTopic: boolean
}

export interface EditStoreTemp {
  tid: number
  title: string
  content: string
  tags: Array<string>
  category: Array<string>

  textCount: number
  // Whether the topic is being rewritten
  isTopicRewriting: boolean
}
```

我们的规范是，使用 export 直接导出，不在结尾使用 `export {}` 导出

关于命名，持久的 store 我们使用 `XXX storePersist`，不持久的使用 `XXX storeTemp`

### utils

里面存放的两个函数用于检查话题发布和回复发布的合法性

### index.ts

我们需要注意下面的函数

```typescript
export function setupKUNGalgamePinia(app: App<Element>) {
  store.use(piniaPluginPersistedstate)
  app.use(store)
}
```

这个函数用于设置好 `Pinia` 以及 `pinia-plugin-persistedstate`

它将会在 `src/main.ts` 文件中创建 Vue 实例时被启用

```typescript
import { setupKUNGalgamePinia } from '@/store/index'

const app = createApp(App)

setupKUNGalgamePinia(app)
```

以及重置 store 的函数

```typescript
export function kungalgameStoreReset() {
  const editStore = useKUNGalgameEditStore()

  ...

  editStore.$reset()

  ...
}
```

它将会在用户退出登录的时候被调用

## storeToRefs

`Pinia` 的 store 在取出时并不是响应式的，所以我们需要使用 `Pinia` 自带的 `storeToRefs` 函数将 store 变成响应式的，这样才能在状态改变时引起其他地方状态的变化

```typescript
import { useKUNGalgameSettingsStore } from '@/store/modules/settings'
import { storeToRefs } from 'pinia'

const { showKUNGalgameBackground, showKUNGalgameCustomBackground } =
  storeToRefs(useKUNGalgameSettingsStore())
```

