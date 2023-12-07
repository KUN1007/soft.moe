export const sidebarConfig = [
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
            text: 'Vue 3',
            link: '/kun-visualnovel-docs/frontend/vue3',
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
        ],
      },
      {
        text: 'Frontend',
        collapsed: false,
        items: [
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
