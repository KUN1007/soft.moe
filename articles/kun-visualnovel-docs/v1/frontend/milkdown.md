# Milkdown (WYSIWYG Markdown Editor)

## 介绍

文本编辑器是论坛的灵魂，我们在之前尝试过[多款编辑器](/kun-visualnovel-docs/overview/tech-stack.html#milkdown)，由于 Vue 在对富文本的支持上没有任何符合我们需求的编辑器, 故而我们没有采用富文本编辑器

最终经过种种踩坑我们使用了 `Milkdown` 这款 `Markdown` 编辑器

我们的开发原则是一切以官网为准，Milkdown 的使用也是这样

[Milkdown 官网](https://milkdown.dev/)

## 结构

我们的编辑器位于 `src/components/milkdown` 目录下，它的结构为

* components. 一些我们自定义的 Milkdown 扩展组件，和我们自定义的编辑器有关，不涉及 Milkdown
* plugins. 根据官方的 plugins 写法编写的一些插件，需要用到 Milkdown
* MilkdownEditor.vue 编辑界面的编辑器体
* MilkdownEditorWrapper.vue 适配 Milkdown 至 Vue 的组件
* ReadOnlyMilkdown.vue 话题详情界面的编辑器，实际上就是话题的展示区域，它本身也是一个编辑器，只不过它是只读的

## 插件

Milkdown 官方提供了很多插件，我们选用了其中的部分插件

* @milkdown/core, @milkdown/ctx. Milkdown 的核心
* @milkdown/plugin-clipboard, 支持剪切板复制 Markdown
* @milkdown/plugin-history, 支持 Ctrl + Z
* @milkdown/plugin-indent, 支持 Tab 缩进
* @milkdown/plugin-listener, 支持编辑器监听事件
* @milkdown/plugin-prism, 代码高亮
* @milkdown/plugin-tooltip, 鼠标选中工具提示
* @milkdown/plugin-trailing, 编辑区域结束自动插入一行
* @milkdown/preset-commonmark, commonmark 支持
* @milkdown/preset-gfm, gfm 支持
* @milkdown/prose, Milkdown 适配
* @milkdown/transformer
* @milkdown/utils, Milkdown 的工具函数包
* @milkdown/vue,@prosemirror-adapter/vue. Milkdown 的 Vue 适配

## 自定义插件

请看 `src/components/milkdown/components/MilkdownMenu.vue`

我们引入了一些 Milkdown 的 `Command`，然后在合适的时机调用了它们，这就是最简单的插件

```vue
<script setup lang="ts">
import type { CmdKey } from '@milkdown/core'
import { callCommand } from '@milkdown/utils'
import {
  toggleStrongCommand,
} from '@milkdown/preset-commonmark'

const call = <T>(command: CmdKey<T>, payload?: T) => {
  return get()?.action(callCommand(command, payload))
}
</script>

<template>
  <div class="menu">
    <button
      aria-label="kun-galgame-bold"
      @click="call(toggleStrongCommand.key)"
    >
      <Icon icon="material-symbols:format-bold-rounded" />
    </button>
  </div>
</template>
```

所有的代码都可以在官方的网站看到参考实现，根据官网的改编即可

