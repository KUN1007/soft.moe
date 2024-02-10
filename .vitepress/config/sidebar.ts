import type { DefaultTheme } from 'vitepress'

export const sidebarConfig: DefaultTheme.Sidebar = [
  {
    text: 'Animations',
    collapsed: true,
    items: [
      {
        text: 'Waifu',
        collapsed: false,
        items: [
          {
            text: '2023 智乃生日快乐！',
            link: '/animations/waifu/kun-chino-2023',
          },
        ],
      },
    ],
  },
  {
    text: 'KUN Visual Novel Docs',
    collapsed: true,
    link: '/kun-visualnovel-docs/kun-forum',
    items: [
      {
        text: 'Overview',
        collapsed: false,
        items: [
          {
            text: '项目目的和背景',
            link: '/kun-visualnovel-docs/overview/purpose',
          },
          {
            text: '主要功能和模块概览',
            link: '/kun-visualnovel-docs/overview/features',
          },
          {
            text: '技术栈介绍',
            link: '/kun-visualnovel-docs/overview/tech-stack',
          },
        ],
      },
      {
        text: 'Configuration',
        collapsed: false,
        items: [
          {
            text: '开发环境配置要求',
            link: '/kun-visualnovel-docs/configuration/setup',
          },
          {
            text: '数据库（MongoDB）和缓存（Redis）的安装和配置',
            link: '/kun-visualnovel-docs/configuration/db',
          },
        ],
      },
      {
        text: 'Frontend',
        collapsed: false,
        items: [
          {
            text: 'Vite',
            link: '/kun-visualnovel-docs/frontend/vite',
          },
          {
            text: 'Vue 3',
            link: '/kun-visualnovel-docs/frontend/vue3',
          },
          {
            text: 'Pinia',
            link: '/kun-visualnovel-docs/frontend/pinia',
          },
          {
            text: 'Router',
            link: '/kun-visualnovel-docs/frontend/router',
          },
          {
            text: 'Fetch API',
            link: '/kun-visualnovel-docs/frontend/fetch',
          },
          {
            text: 'SCSS',
            link: '/kun-visualnovel-docs/frontend/scss',
          },
          {
            text: 'i18n',
            link: '/kun-visualnovel-docs/frontend/i18n',
          },
          {
            text: 'localforage / Indexdb',
            link: '/kun-visualnovel-docs/frontend/indexdb',
          },
          {
            text: 'Milkdown',
            link: '/kun-visualnovel-docs/frontend/Milkdown',
          },
        ],
      },
      {
        text: 'Backend',
        collapsed: false,
        items: [
          {
            text: 'Koa',
            link: '/kun-visualnovel-docs/backend/koa',
          },
          {
            text: 'MVC',
            link: '/kun-visualnovel-docs/backend/mvc',
          },
          {
            text: 'Route',
            link: '/kun-visualnovel-docs/backend/route',
          },
          {
            text: 'Mongodb / Mongoose',
            link: '/kun-visualnovel-docs/backend/mongodb',
          },
          {
            text: 'Redis',
            link: '/kun-visualnovel-docs/backend/redis',
          },
          {
            text: 'JWT',
            link: '/kun-visualnovel-docs/backend/jwt',
          },
        ],
      },
      {
        text: 'Deploy',
        collapsed: false,
        items: [
          {
            text: '生产环境的配置指南',
            link: '/kun-visualnovel-docs/deploy/deploy-config',
          },
          {
            text: '构建前端和后端的指令或脚本',
            link: '/kun-visualnovel-docs/deploy/script',
          },
          {
            text: '数据库和缓存的部署和配置',
            link: '/kun-visualnovel-docs/deploy/db',
          },
          {
            text: '安全性考虑和最佳实践',
            link: '/kun-visualnovel-docs/deploy/security',
          },
          {
            text: '维护与扩展',
            link: '/kun-visualnovel-docs/deploy/maintenance',
          },
        ],
      },
      {
        text: 'Structure',
        collapsed: false,
        items: [
          {
            text: '前后端交互接口文档',
            link: '/kun-visualnovel-docs/structure/api',
          },
          {
            text: '数据库字段含义说明',
            link: '/kun-visualnovel-docs/structure/db',
          },
          {
            text: '错误处理',
            link: '/kun-visualnovel-docs/structure/error',
          },
        ],
      },
      {
        text: 'Issue',
        collapsed: false,
        items: [
          {
            text: '常见问题',
            link: '/kun-visualnovel-docs/issue/issue',
          },
        ],
      },
      {
        text: 'Update Log',
        collapsed: false,
        items: [
          {
            text: '记录每个版本的更新内容和改动',
            link: '/kun-visualnovel-docs/update/log',
          },
        ],
      },
      {
        text: `Others`,
        collapsed: false,
        items: [
          {
            text: '确定目标',
            link: '/kun-visualnovel-docs/others/aim',
          },
          {
            text: '分析、构思、设计',
            link: '/kun-visualnovel-docs/others/analyze',
          },
          {
            text: '拟定方案',
            link: '/kun-visualnovel-docs/others/all',
          },
          {
            text: '网站维护',
            link: '/kun-visualnovel-docs/others/maintenance',
          },
        ],
      },
      {
        text: 'Future',
        collapsed: false,
        items: [
          {
            text: '鲲 Galgame 论坛未来的计划是什么',
            link: '/kun-visualnovel-docs/future/plan',
          },
        ],
      },
    ],
  },
  {
    text: 'Technology',
    collapsed: true,
    items: [
      {
        text: 'Algorithm',
        collapsed: false,
        items: [
          {
            text: '关于图的认识',
            link: '/technology/algorithm/kun-graph',
          },
          {
            text: '二分图、欧拉图、哈密顿图',
            link: '/technology/algorithm/kun-graph-2',
          },
        ],
      },
      {
        text: 'Backend',
        collapsed: false,
        items: [
          {
            text: 'SSO 与 OAuth 2.0',
            link: '/technology/backend/kun-sso-oauth',
          },
          {
            text: '记录一次 mongodb 操作失误导致字段重复的处理过程',
            link: '/technology/backend/kun-mongodb-field-error',
          },
          {
            text: 'tRPC',
            link: '/technology/backend/kun-trpc',
          },
        ],
      },
      {
        text: 'Cryptography',
        collapsed: false,
        items: [
          {
            text: 'GPG key 实现 GitHub `Verified` 认证（Authenticate & Sign）',
            link: '/technology/cryptography/kun-gpg',
          },
        ],
      },
      {
        text: 'Frontend',
        collapsed: false,
        items: [
          {
            text: 'Svelte',
            collapsed: false,
            items: [
              {
                text: 'Svelte 教程 Part1 & Part2',
                link: '/technology/frontend/svelte/kun-svelte',
              },
              {
                text: 'SvelteKit 教程 Part3 & Part4',
                link: '/technology/frontend/svelte/kun-svelte-kit',
              },
            ],
          },
          {
            text: 'Nuxt3',
            collapsed: false,
            items: [
              {
                text: '如何将一个现有的 Vue3 项目改写为 Nuxt3 项目',
                link: '/technology/frontend/nuxt3/kun-nuxt3',
              },
            ],
          },
          {
            text: 'Vue3',
            collapsed: false,
            items: [
              {
                text: '如何在 setup() 外使用 Pinia',
                link: '/technology/frontend/vue/kun-pinia',
              },
            ],
          },
          {
            text: '关于 http1.1 与 http2 中 statusText 区别认识 (响应拿不到 statusText)',
            link: '/technology/frontend/vue/kun-http',
          },
          {
            text: 'Web 前端概览',
            link: '/technology/frontend/kun-frontend',
          },
          {
            text: 'Nextjs',
            link: '/technology/frontend/kun-nextjs',
          },
        ],
      },
      {
        text: 'Production',
        collapsed: false,
        items: [
          {
            text: '对于一次网站 UI 更新的认识',
            link: '/technology/production/kun-ui',
          },
        ],
      },
      {
        text: 'Tools',
        collapsed: false,
        items: [
          {
            text: '更改 GitHub 邮箱后贡献消失',
            link: '/technology/tools/kun-github-email',
          },
        ],
      },
      {
        text: 'Web',
        collapsed: false,
        items: [
          {
            text: '如何给一个网站接入邮箱验证码服务',
            link: '/technology/web/kun-email',
          },
        ],
      },
    ],
  },
  {
    text: 'Others',
    collapsed: true,
    items: [
      {
        text: 'Friends',
        collapsed: false,
        items: [
          {
            text: '我的朋友们',
            link: '/others/friends/kun-friend',
          },
        ],
      },
      {
        text: 'College',
        collapsed: false,
        items: [
          {
            text: '大学生逃课指南',
            link: '/others/college/how-to-play-truant',
          },
        ],
      },
    ],
  },
  {
    text: 'Professionalism',
    collapsed: true,
    items: [
      {
        text: '在遇到自己完全不会的技术栈时应该如何做?',
        link: '/professionalism/kun-source',
      },
    ],
  },
  {
    text: 'Visualnovels',
    collapsed: true,
    items: [
      {
        text: 'Koi',
        collapsed: false,
        items: [
          {
            text: 'Ting Dungeon (微小地牢)',
            link: '/visualnovels/koi/tiny-dungeon',
          },
        ],
      },
    ],
  },
]
