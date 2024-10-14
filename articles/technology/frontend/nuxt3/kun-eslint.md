# 记录最新版 Nuxt3 ESLint 的配置方式

## 问题

原本在我的项目 [kun-galgame-nuxt3](https://github.com/KUN1007/kun-galgame-nuxt3) 中是有 `ESLint` 配置的，但是这个配置在 ESLint 版本升级之后出现了问题

原因是新版 ESLint 使用了 `flat config system`，这是一个新的配置方式，这意味着以前的 `.eslintrc`, `.eslintignore` 都没有用了

Blog: https://eslint.org/blog/2022/08/new-config-system-part-2/

Documentation: https://eslint.org/docs/latest/use/configure/migration-guide

## 解决方案

### 升级项目的全部依赖

``` shell
pnpm update --latest
```

全部更新为最新，防止其它问题出现，然后运行 `pnpm dev` 看看项目是否仍然可以正常运行

### 执行迁移命令

https://eslint.nuxt.com/packages/module#quick-setup

``` shell
npx nuxi module add eslint
```

执行完之后会在目录下创建一个 `eslint.config.mjs` 文件

### 删除之前的配置

此时可以删除 `.eslintrc`, `.eslintignore`

可以在 `eslint.config.mjs` 中写入

``` typescript
ignores: ['/.node_modules', '/.DS_Store', '/.nuxt', ...]
```

以便忽略到不用检查的文件夹，似乎不写也可以

### 移动配置

我的 `eslint.config.mjs` 配置为

``` typescript
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    'comma-spacing': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/attributes-order': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-v-html': 'off',
    'import/order': 'off',
    'import/no-named-as-default-member': 'off',
    'arrow-parens': ['error', 'always'],
    'space-before-function-paren': 'off',
    'func-call-spacing': 'off',
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true }
    ]
  }
})

```

相对于之前的代码，去除了

``` typescript
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
```

`flat config system` 似乎不再使用 `root: true` 这个配置了

### 写入运行脚本

在 `package.json` 中写入

``` json
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
```

### 运行测试

``` shell
~ pnpm lint:fix

> kun-galgame-nuxt3@2.18.20 lint:fix E:\MySite\kun-galgame-nuxt3
> eslint . --fix
```

什么输出都没有即为检查通过
