# Vite

## 介绍

我们在前端项目中使用了 `Vite` 作为创建项目的工具，前面我们说了，这有以下几个好处

* 对 Vue 的第一优先级支持
* 快

有关 Vite 的更多信息可以去 Vite 官网查看

## 创建项目

这个项目的结构是这么创建的

``` shell
pnpm create vite --template vue-ts
```

创建之后会有一个基本的项目结构

## 项目介绍

Vite 的配置文件为 `vite.config.ts`，我们的配置文件为

``` typescript
import { PluginOption, defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
// Import Rollup Plugin Visualizer for bundle visualization
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), visualizer() as PluginOption],
  /* Set the 'src' alias to '@' */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    // Dist dir name
    assetsDir: 'kun',
  },
  server: { host: '127.0.0.1', port: 1007 },
  // Suppress i18n warnings
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
})
```

我们可以发现这些点

* 引入 Vue 的支持
* 引入 `rollup-plugin-visualizer` 插件，在打包时根目录会生成一个 HTML 文件，里面是打包时各个 `module` 的占
  比
* 将 `src` 文件夹的别名设置为 `@`，在项目中引入模块会更加方便
* Vite 基于 `ESBuild`, 将 `console` 和 `debugger` 等调试信息全部移除
* 将构建后的资源文件夹名称设为 `kun` （你问为什么？答案是我喜欢，啊哈哈哈）
* 将本地 `server` 的启动地址变为 `127.0.0.1:1007`
* 最后的 define 目的是消除 `vue-i18n` 的警告，不用太在意

为什么是 1007？

因为我抽到鲲是 10 月 7 日

