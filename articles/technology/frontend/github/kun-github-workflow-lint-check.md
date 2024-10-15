# 为项目添加 ESLint 和 typecheck 的 GitHub 工作流

## 目的

提交代码时直接执行 `pnpm lint` 和 `pnpm check` 以保证代码质量

``` json
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
```

## 代码

/.github/workflows/lint-check.yml

``` yml
name: Lint

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

permissions:
  contents: read

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # enable pnpm
      - run: corepack enable

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run ESLint
        run: pnpm run lint

      - name: Run Type Checking
        run: pnpm run typecheck
```

## 注意的点

这里我们使用了 `pnpm`，然而 `actions/setup-node@v4` 是没有 pnpm 的，我们需要添加 `- run: corepack enable` 来启用 pnpm

官方文档: https://nodejs.org/api/corepack.html

然后在 `package.json` 中添加一项

``` json
  "packageManager": "pnpm@9.12.1",
```

### 问题

`pnpm@9.12.1` 这里写死了, 怎么自动更新呢

答案是使用一下 `renovate`

在 `/.github` 文件夹下新建一个 `renovate.json`, 写入

``` json
{
  "packageRules": [
    {
      "managers": ["npm"],
      "packageNames": ["pnpm"],
      "enabled": true,
      "rangeStrategy": "bump"
    }
  ]
}
```

然后到 GitHub 的项目中给项目开启一下 [renovate bot](https://github.com/apps/renovate) 就可以了

## 感谢凑妈的指导

感谢我的好朋友[凑妈](https://asukaminato.eu.org/)的指导

肯定还有不对或者尚待改进的地方，欢迎联系我指出我的错误，大家的每一次纠错都是对我的最大帮助，谢谢

