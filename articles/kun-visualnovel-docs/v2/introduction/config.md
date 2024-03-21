# Nuxt3 项目配置

对于 Nuxt3，很重要的一部分在于它的配置文件 `nuxt.config.ts`，该文件位于根目录

现在我们对其解释

``` TypeScript
// 下面的代码主要是用作更新 package.json 的 version，目的我们在前面的文档已经介绍
import fs from 'fs'
import path from 'path'

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)
const appVersion = packageJson.version

// 下面的文件是整个 Nuxt3 App 的配置
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 关闭 devtools,因为它比较鸡肋
  devtools: {
    enabled: false
  },
  // 自定义开发服务器配置
  devServer: {
    host: '127.0.0.1',
    port: 1007
  },
  // 与 Nuxt3 相关的 modules
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@pinia-plugin-persistedstate/nuxt',
    'dayjs-nuxt',
    'nuxt-icon',
    '@vite-pwa/nuxt',
    'nuxt-typed-router',
    'nuxt-schema-org',
    '@nuxtjs/color-mode',
    // 这个 module 是我们自定义的 module,在以前的文档中提到过
    './modules/socket/module'
  ],
  // 运行时配置，在项目代码中使用 useRuntimeConfig() 可以获取这些变量
  runtimeConfig: {
    MONGODB_URL: process.env.MONGODB_URL,

    KUN_GALGAME_API: process.env.KUN_GALGAME_API,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    JWT_ISS: process.env.JWT_ISS,
    JWT_AUD: process.env.JWT_AUD,
    JWT_SECRET: process.env.JWT_SECRET,

    public: {
      KUN_GALGAME_URL: process.env.KUN_GALGAME_URL,
      KUN_VISUAL_NOVEL_VERSION: appVersion
    }
  },
  // Nuxt3 的自动导入，这些文件夹中所 export 的一切内容，无需手动 import xxx form 'xxx'，可以直接使用
  imports: {
    dirs: ['./composables', './utils', './store/**/*.ts']
  },

  // 前端相关的配置

  // 指定预加载 scss 相关的目录
  css: ['~/assets/css/index.scss'],
  // vite 相关的配置
  vite: {
    esbuild: {
      // 打包时去掉 console 和 debugger
      drop: ['console', 'debugger']
    }
  },
  // piniaPersistedstate 的配置
  piniaPersistedstate: {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict'
    }
  },
  // nuxt-i18n 相关配置
  i18n: {
    langDir: './language',
    locales: [
      {
        code: 'en-us',
        iso: 'en-US',
        file: 'en.json'
      },
      {
        code: 'zh-cn',
        iso: 'zh-CN',
        file: 'zh.json'
      }
    ],
    baseUrl: process.env.KUN_GALGAME_URL,
    defaultLocale: 'en-us',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'kungalgame-language',
      redirectOn: 'root'
    }
  },
  // nuxt-color-mode 相关配置
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__KUNGALGAME_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: 'kun-',
    classSuffix: '-mode',
    storageKey: 'kungalgame-color-mode'
  },
  // PWA 相关配置
  pwa: {
    registerType: 'autoUpdate',
    // Disable pwa in development environment
    disable: process.env.NODE_ENV === 'development',
    manifest: {
      name: 'KUN Visual Novel',
      short_name: 'KunGal',
      theme_color: '#218bff',
      icons: [
        {
          src: 'pwa/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,png,webp,svg,ico}'],
      navigateFallback: null
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  }
})

```

该文件可以直接使用，无需修改，可以查看 Nuxt 官网和某些插件的官网进行自定义配置

