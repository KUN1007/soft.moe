import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "KUN's Blog",
  description: "KUN's moe moe blog, KUN IS THE CUTEST!",
  srcDir: './articles',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/KUN1007',
        ariaLabel: 'KUN, Moe Moe Moe',
      },
      { icon: { svg: 'telegram' }, link: 'https://t.me/kungalgame' },
      { icon: { svg: 'kungalgame' }, link: 'https://t.me/kungalgame' },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {},
      },
    },
  },

  markdown: {
    lineNumbers: true,
  },
})
