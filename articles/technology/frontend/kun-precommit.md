# 如何在提交时自动更新项目的版本号

## 问题描述

今天遇到一个需求，[论坛](https://www.kungal.com) Footer 的 Version 想要在每一次提交时更新一个小版本号，这个应该怎么实现呢

我们知道项目的版本号有三个部分，Major.Minor.Patch

| Name | Description |
| ---- | ---- |
| Major | Incremented when backward-incompatible changes are introduced to the public API. |
| Minor | Incremented when new, backward-compatible functionality is added or when public API functionality is marked as deprecated. |
| Patch | Incremented when only backward-compatible bug fixes are introduced. |

我们要将 Patch version 每次增加 0.0.1

## 解决问题

刚开始我做的感觉很灵车，灵车漂移，逻辑是这样的

1. 使用 husky 在 pre-commit 这个钩子执行一个 pnpm 脚本
2. 这个 pnpm 脚本将会执行 node ./.husky/scripts/updateAppVersion.js
3. 这个 js 文件执行后会将 .env 中的 `APP_VERSION` 数值增加 0.0.1
4. 在前端应用中使用 `APP_VERSION` 这个变量

::: details updateAppVersion.js

```javascript
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '..', '.env')

fs.readFile(envPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading .env file', err)
    return
  }

  const lines = data.split(/\r?\n/)

  const updatedLines = lines.map((line) => {
    if (line.startsWith('KUN_VISUAL_NOVEL_VERSION')) {
      const versionComponents = line
        .split('=')[1]
        .split('.')
        .map((component) => component.replace(/[^0-9]/g, ''))

      if (versionComponents.length === 3) {
        const patch = parseInt(versionComponents[2], 10) + 1
        const newVersion = `'${versionComponents[0]}.${versionComponents[1]}.${patch}'`
        return `KUN_VISUAL_NOVEL_VERSION = ${newVersion}`
      }
    }
    return line
  })

  const updatedData = updatedLines.join('\n')

  fs.writeFile(envPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing .env file', err)
      return
    }
    console.log('KUN_VISUAL_NOVEL_VERSION updated successfully.')
  })
})
```

:::


### 错在哪里

我下意识就觉得这个解决方案非常阴间，怎么能直接读 .env 呢，感觉像在灵车漂移，~~但是你就说实现没实现这个功能吧~~

我考虑到一个问题，其它人在使用这个项目的时候，如何得知项目的版本，只有打开网站看一眼才能配自己的 .env，这会对其它人的提交造成困惑

必然有其它我不知道的严重后果，如果你发现了，请一定要告诉我

## 解决方案

我发现 `package.json` 有一个 `version` 字段，读这个看起来比读 .env 靠谱一点，所以下面的方法是读取 version 然后更改它的值的

### 思路

思路和最初是一样的，在提交时执行一个 js 脚本更改 `package.json` 中 `version` 的值

修改一下要执行的 js 脚本文件


::: info bumpAppVersion.js

```javascript
const fs = require('fs')
const path = require('path')

const packagePath = path.join(__dirname, '..', '..', 'package.json')

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const versionParts = packageJson.version
  .split('.')
  .map((part) => parseInt(part, 10))

versionParts[2] += 1

packageJson.version = versionParts.join('.')
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')

```

:::


值得一提的是有一点不同，在 Nuxt3 项目中，可以通过根目录的 `nuxt.config.ts` 文件读到 `package.json` 文件中的 `version` 值

它大概是这样的

::: info nuxt.config.ts

```typescript
import fs from 'fs'
import path from 'path'

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)
const appVersion = packageJson.version

export default defineNuxtConfig({
  ...

  runtimeConfig: {
    ...

    public: {
      ...

      KUN_VISUAL_NOVEL_VERSION: appVersion
    }
  },
  
  ...

})

```

:::

这样读取到的值可以直接在应用中使用 Nuxt3 的 `useRuntimeConfig()` 读取到，打包时会被硬编码到页面中

然后我们在 commit 的时候就可以看到 `package.json` 中的 `version` 自动增加了 0.0.1 了
