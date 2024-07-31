import { defineConfig } from 'vitepress'
import { sidebarConfig } from './config/sidebar'
import { socialLinksConfig } from './config/socialLinks'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "KUN's Blog",
  description: "KUN's moe blog, KUN IS THE CUTEST!",
  base: '/',
  srcDir: 'articles',
  outDir: './dist',
  // sitemap: { hostname: 'https://soft.moe' },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // Google Analytics
    [
      'script',
      {
        async: 'true',
        src: `https://www.googletagmanager.com/gtag/js?id=G-E743ZEXRTH`,
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-E743ZEXRTH');`,
    ],
  ],
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon-32x32.webp',

    lastUpdated: {
      text: 'Last Updated At',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Animations', link: '/animations/kun-animations' },
      {
        text: 'KUNGalgame Doc',
        link: '/kun-visualnovel-docs/kun-forum',
      },
      { text: 'Visual Novels', link: '/visualnovels/kun-visualnovels' },
      { text: 'Technology', link: '/technology/kun-technology' },
    ],

    sidebar: sidebarConfig,

    socialLinks: socialLinksConfig,

    search: {
      provider: 'local',
    },
  },

  markdown: {
    lineNumbers: true,
  },
})
