# Vue

## 介绍

> 为什么使用 Vue？

你猜，如果是技术要素上的话我必然不用 Vue

## 概览

本项目总体使用了最新的 `Vue3 Composition API + Setup + Typescript` 的现代写法

因此，一个 Vue 组件的基本结构应该是这样的

``` vue
<script setup lang='ts'>

</script>

<template>

</template>

<style lang='scss' scoped>

</style>
```

请注意，和 `React` 项目有所区别，我们将样式文件直接写在了 `style` 区域

## 核心

请看一遍本项目的 `KUNGalgameSettingPanel.vue` 组件，这是本项目的设置面板实现，它位于 `src/components/KUNGalgameSettingPanel.vue`

这个组件的实现几乎囊括了本项目所有的核心要点，这个组件下还有一个 `components` 文件夹，包含了该组件的组件

* Background. 背景设置组件 (background.ts 文件是一些预设背景的图片描述)
* CustomBackground. 自定义背景上传组件
* Font. 字体设置组件
* Loli. 看板娘组件（？我再三强调一下，莲不是萝莉）
* Mode. 白天 / 黑夜切换组件
* PageWidth. 页面宽度调整组件
* SwitchLanguage. 语言切换组件

我们可以看出本项目前端最重要的一点 —— 组件化思想

以及，本项目中的所有函数，全部使用 `箭头函数`

### Background.vue

<br>

**Vue 内置指令**

``` typescript
import { onMounted, ref } from 'vue'

const imageArray = ref<string[]>([])

onMounted(async () => {
  for (const background of backgroundImages) {
    const backgroundURL = await getBackground(background.index)
    imageArray.value.push(backgroundURL)
  }
})
```
上面的代码体现了几点基本思想

使用 `ref` 创建了一个响应式的变量，以供 `onMounted` 生命周期函数获取异步数据

这是本项目中最常用的异步数据获取方式，并且，它保证了响应式

<br>

**全局组件**

``` typescript
import Message from '@/components/alert/Message'
import BackgroundImageSkeleton from '@/components/skeleton/settings-panel/BackgroundImageSkeleton.vue'
```

`Message` 是本项目中最常用的全局通知组件。

它利用 Vue 的 `h` 函数实现了响应式，并且实现了 `i18n`，这是一个很关键的 `函数组件`

下面是它的声明，函数的注释已经充分说明了它的用法

``` typescript
/**
 * @param {string} messageEN - Message in English
 * @param {string} messageCN - Message in Chinese
 * @param {type} type - Type of the message, can be one of `warn`, `success`, `error`, or `info`
 * @param {number} duration - Display duration of the message, optional, default is 3 seconds
 */
export default (
  messageEN: string,
  messageCN: string,
  type: MessageType,
  duration?: number
) => {}
```

`BackgroundImageSkeleton` 是背景图片的骨架屏实现，在图片未加载完成时显示骨架屏，提升用户体验

所有的骨架屏组件位于 `src/components/skeleton`

**store**

我们在本项目中使用了 `Pinia`，这是 `Pinia` 的使用方法，本项目中的 `Pinia` 一律使用这种方法

``` typescript
import { useKUNGalgameSettingsStore } from '@/store/modules/settings'
import { storeToRefs } from 'pinia'

const { showKUNGalgameBackground, showKUNGalgameCustomBackground } =
  storeToRefs(useKUNGalgameSettingsStore())
```

对任何 `store` 的定义，我们均写为 `use XXX store`，例如 `useKUNGalgameSettingsStore`，这是良好的命名习惯

`storeToRefs` 是 `Pinia` 的一个内置函数，将 Pinia 的 Store 解构赋值，会导致其失去响应式，我们需要使用 `storeToRefs` 来使其恢复响应性，这类似于 Vue 的 `toRefs`

**hook**

``` typescript
import {
  getBackgroundURL,
  restoreBackground,
} from '@/hooks/useBackgroundPicture'
```

本项目中的 `hook` 使用较少，但是这两个函数可以作为很好的例子

`hooks` 的本质就是函数，它是为了把逻辑拆分的更细更方便重用而诞生的，读取背景图的逻辑较多，因此放在了 `hook` 中

并且，对于本项目，项目的 `src` 文件夹只有 `api` 和 `hooks` 文件夹允许使用 `request.ts` 封装好的 `fetch` 来获取数据


**v-bind, v-on, directives**

``` html
<li
    v-for="kun in backgroundImages"
    :key="kun.index"
    v-tooltip="{ message: kun.message, position: 'bottom' }"
>
    <img
        v-if="kun"
        :src="imageArray[kun.index - 1]"
        @click="handleChangeImage(kun.index)"
    />

    <BackgroundImageSkeleton v-if="!imageArray[kun.index - 1]" />
</li>
```

项目中使用了大量的 vue 指令，以及自定义指令

自定义的 `v-tooltip` 指令是一个用于展示 tooltip 的指令，它是通过对页面元素样式的操作实现的，极为简洁

使用 `@click` 时，命名以 `handle XXX click` 命名，这是良好的命名习惯

需要注意的是，不推荐将 `v-for` 与 `v-if` 一起使用，另外，本项目中规定 `v-for` 时必须制定 `:key`

**style**

``` scss
/* Background settings */
.kungalgame-background-container {
  margin: 0;
  padding: 0;

  /* Font for the title of the background container */
  span {
    height: 30px;
  }
}

.bg-settings {
  margin: 10px 0;
}
```

本项目使用 `SCSS` 作为样式处理，没有使用 `tailwindcss`, `unocss` 等

规定，嵌套写法不同元素间必须留出一行空行，以保持良好的代码可读性，例如上面代码中 `span` 上面留有空格，`.bg-settings` 与 `.kungalgame-background-container` 之间有空格

居中魔法，本项目大量使用

``` scss
display: flex;
justify-content: center;
align-items: center;
```

### PageWidth.vue

<br>

**useRoute**

``` typescript
import { useRoute } from 'vue-router'
const routeName = computed(() => route.name as string)
```

`useRoute` 是 `vue-router` 内置的函数，它的目的是获取当前的路由实例，它和 `useRouter` 是完全不同的

`useRoute` 函数可以获得一个 `route` 对象，它包含了当前路由的 `params`, `name` 等信息

在这里的作用是通过当前路由的名字判断是否可以调整页面的宽度

注意 `computed`，这是一个良好的实践，将一些复杂的计算或重用的计算使用 `computed` 包裹以缓存其内容，或者使其具备响应式

**watch**

``` typescript
watch(
  () => pageWidth.value,
  () => {
    if (pageNameArray.includes(routeName.value)) {
      showKUNGalgamePageWidth.value[routeName.value] = pageWidth.value
    }
  }
)
```

这里 `watch` 的作用是监听单个 `pageWidth` 的宽度来更改对应页面 `store` 内的宽度，以此来实现响应性

本项目中的 `watch` 写法只有一种

``` typescript
watch(() => value, callback(), { configuration })
```

`value` 是 watch 监听的值，这是一个函数，函数返回的值不是响应式包裹的，注意，对于 `ref` 包裹的值，此方法必须要监听 `.value`

`callback()` 是 `watch` 的回调函数

`configuration` 是 `watch` 的配置，例如 `immediate`, `deep`

或许我们还有没有更改的以下写法

``` typescript
watch(value, callback(), { configuration })
```

该方法的 `watch` 没有监听一个回调函数，而是监听了一个响应式包裹的变量

不同的地方是，这里的 `value` 如果使用了 `ref` 包裹，那么它不可以使用 `.value` 访问，否则监听会失败

**i18n**

项目中使用了 `vue-i18n` 来进行网站的 `i18n` 支持

主要有下面的几个用法

``` typescript
$tm('key')
```

``` typescript
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })
```

``` typescript
import i18n from '@/language/i18n'
18n.global.tm(`router.${title}`)
```

对于这三种方法

第一种方法是最常用的，它是一个全局注册的 `tm` 函数（[为什么不是 `t` ？](kun-visualnovel-docs/overview/tech-stack.html#i18n)），这个函数可以将在 `src/language` 中配置好的语言文件进行读取翻译

第二种方法用于全局更改 `i18n` 的地区，用于语言切换

第三种方法用于在 `Vue` 组件外使用 `i18n`，例如上面在路由跳转时改变页面的 title i18n

### KUNGalgameSettingPanel.vue

<br>

``` typescript
import Loli from './components/Loli.vue'
import Mode from './components/Mode.vue'
import SwitchLanguage from './components/SwitchLanguage.vue'
import PageWidth from './components/PageWidth.vue'
import Font from './components/Font.vue'
import Background from './components/Background.vue'
```

注意组件引入的方式，由于我们使用了 `setup` 的写法，所以我们的组件名就是 `.vue` 后缀文件的文件名

需要注意的是，本项目中的组件一律使用大驼峰命名

``` typescript
const emits = defineEmits<{
  close: [showKUNGalgamePanel: boolean]
}>()

const handelCloseSettingsPanel = () => {
  emits('close', false)
}
```

在这里，我们定义了一个 `emits`，用于自组件给父组件传递信息，在本项目中这种写法很常见

需要注意的是我们 `defineEmits` 的 `typescript` 声明使用了[官网的最新实践](https://vuejs.org/guide/typescript/composition-api.html#typing-component-emits)，实现非常简洁

说句题外话，那天我闲得没事干跑去 `vue` 的官方 `GitHub repo` 中回答了两个 `issue`，结果挨了几个踩，现在钉上耻辱柱

https://github.com/vuejs/core/issues/9541

https://github.com/vuejs/core/issues/9546

<br>

### CustomBackground.vue

``` typescript
const props = defineProps<{
  isMobile?: boolean
}>()
```

需要注意这里的 `defineProps` 用法，这里使用了 `props` 接收了 `defineProps` 返回的 `props`，也可以使用 `$props` 在 `<template>` 中直接使用 `props`

我们也有可能使用 `computed(() => props.value)` 的形式接收 `props` 的值，使其保持响应性，因为 `props` 的响应式只有一层，在多层组件中传递会失败

同样的，我们的 `defineProps` 函数类型声明使用官网的最新实践

为什么不使用 `provide / inject` 跨组件传递？

因为大多数情况下这种跨多层组件的数据是异步的，然而经过我的研究，`provide / inject` 仅友好支持同步数据，如果您有更好的实践，欢迎点击右上角联系我

## 内置组件

Vue3 带来了几个内置组件，在我们的项目中均有涉及，这里介绍一下

需要注意的是，Vue3 为了和现代框架的写法相似，将内置组件推荐全部以大驼峰命名，所以我们遵循这个实践

本项目应用关键在 `src/layout/KUNGalgameAPP.vue` 这个组件

### <RouterView />

路由的出口

它还可以这样使用

``` vue
<template>
  <!-- #default is shorthand for v-slot, route is the route, Component is a v-node -->
    <RouterView #default="{ route, Component }">
      <Transition
        :enter-active-class="`animate__animated ${route.meta.transition}`"
      >
        <!-- ATTENTION! You must include a key here; otherwise
          , Vue Router won't recognize page updates for the same page
          , causing the page not to refresh -->
        <Component :is="Component" :key="route.fullPath"></Component>
      </Transition>
    </RouterView>
</template>
```

需要注意的是，#default 是 v-slot 的缩写，它可以把一个 `<Component>` 放入 `<RouterView>`

这个方法可以应用于路由的过渡特效，可以通过在路由的 meta 区域添加某些字段来应用不同的过渡效果

尤其需要注意的是，请给 `<Component>` 加上 `:key`，以表示其唯一性，否则 `vue-router` 将会识别不到路由的变化，导致页面不更新

### RouterLink

```vue
<template>
    <RouterLink :to="{ path: kun.router }">
      {{ $tm(`header.${kun.name}`) }}
    </RouterLink>
</template>
```

本项目中 `<RouterLink>` 用于路由的跳转，这个操作应该被称为动态路由匹配

大白话就是根据页面的唯一路径来跳转到指定的页面

项目中有两种用法，一是上面的用法，还有一种常见的用法是直接使用 `ES6` 模板字符串指定 `<RouterLink>` 的 `to` 参数，例如 `:to="/topic/${tid}"`

上面提到了 `useRoute` 函数，和 `<RouterLink>` 相关的函数为 `useRouter`，这个函数会返回一个 `Router` 实例

注意，不是 `Route` 实例，本项目中的 `Router` 实例一般用于 `router.push()`

### Transition

```vue
<template>
  <Transition name="order" mode="out-in">
  </Transition>
</template>

<style lang="scss" scoped>
.order-enter-active,
.order-leave-active {
  transition: all 0.25s ease-out;
}

.order-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.order-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

```

`Transition` 组件是 Vue 内置的动画组件，用于对单个组件过渡

上面的用例是本项目根据 vue [官方案例](https://vuejs.org/guide/built-ins/transition.html#transition-modes)改编的，遵循 Vue 官网最佳实践，样例位于 `src/views/ranking/components/TopicFrom.vue`

本项目将 `<Transition>` 组件与 `animate.css` 一起使用，典型用法为

```vue
<template>
    <Transition
      enter-active-class="animate__animated animate__fadeInUp animate__faster"
      leave-active-class="animate__animated animate__fadeOutDown animate__faster"
    >
    </Transition>
</template>
```

### TransitionGroup

`<TransitionGroup>` 是 Vue 较新的一个过滤动画组件，它的作用是将一组元素整体进行过渡

本项目中的 `<TransitionGroup>` 均为 Vue3 官网 `<TransitionGroup>` 的示例改编而来

```vue
<template>
  <TransitionGroup name="item" tag="div">
    <div class="item" v-if="isShowPageWidth">
      <PageWidth />
    </div>

    <div class="item" v-else-if="!isShowPageWidth">
      <Font />
    </div>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.item-move,
.item-enter-active,
.item-leave-active {
  transition: all 0.5s ease;
}

.item-enter-from,
.item-leave-to {
  opacity: 0;
  transform: translateY(77px);
}

.item-leave-active {
  position: absolute;
}
</style>
```

### KeepAlive

本项目中的 `<KeepAlive>` 组件仅用了一次，位于 `src/components/top-bar/KUNGalgameTopBar.vue`

```vue
<template>
  <KeepAlive :exclude="['PageWidth', 'Font']">
    <KUNGalgameSettingsPanel
      v-if="showKUNGalgamePanel"
      @close="showKUNGalgamePanel = false"
    />
  </KeepAlive>
<template>
```

它的主要目的是缓存页面数据，~~其实这里的数据感觉缓存不缓存无所谓，但是我就想用一下~~

完了。。。我现在突然想到用户主页用这个不是挺香的。。晚上回去改。。

### Teleport

这也是 Vue3 的新组件，本项目中用到的场景比较多

```vue
<template>
  <Teleport to="body" :disabled="showAlert">
    <Transition name="alert">
      <div v-if="showAlert" class="mask">
      </div>
    </Transition>
  </Teleport>
</template>
```

例如上面的代码，通过 `disabled` 来决定是否显示面板，本项目中的项目都是这个原理

参考的是 [Vue 官网的案例](https://vuejs.org/examples/#modal)

`<Teleport>` 的组件存放于 `App.vue` 中，保证全局可用，还有一个 `Teleport` 组件是 `ReplyPanel`




