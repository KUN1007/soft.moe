import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "KUN's Blog",
  description: "KUN's moe moe blog, KUN IS THE CUTEST!",
  base: '/',
  srcDir: 'articles',
  outDir: './dist',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=TAG_ID' },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'TAG_ID');`,
    ],
  ],
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: '/favicon-32x32.png',

    lastUpdated: {
      text: 'Last Updated At',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Animations', link: '/animations/kun-animations' },
      {
        text: 'KUNGalgame Doc',
        link: '/kun-visualnovel-docs/kun-galgame',
      },
      { text: 'Visual Novels', link: '/visualnovels/kun-visualnovels' },
      { text: 'Technology', link: '/technology/kun-technology' },
    ],

    sidebar: [],

    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><mask id="lineMdGithubLoop0" width="24" height="24" x="0" y="0"><g fill="#fff"><ellipse cx="9.5" cy="9" rx="1.5" ry="1"/><ellipse cx="14.5" cy="9" rx="1.5" ry="1"/></g></mask><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="30" stroke-dashoffset="30" d="M12 4C13.6683 4 14.6122 4.39991 15 4.5C15.5255 4.07463 16.9375 3 18.5 3C18.8438 4 18.7863 5.21921 18.5 6C19.25 7 19.5 8 19.5 9.5C19.5 11.6875 19.017 13.0822 18 14C16.983 14.9178 15.8887 15.3749 14.5 15.5C15.1506 16.038 15 17.3743 15 18C15 18.7256 15 21 15 21M12 4C10.3317 4 9.38784 4.39991 9 4.5C8.47455 4.07463 7.0625 3 5.5 3C5.15625 4 5.21371 5.21921 5.5 6C4.75 7 4.5 8 4.5 9.5C4.5 11.6875 4.98301 13.0822 6 14C7.01699 14.9178 8.1113 15.3749 9.5 15.5C8.84944 16.038 9 17.3743 9 18C9 18.7256 9 21 9 21"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="30;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M9 19"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="10;0"/><animate attributeName="d" dur="3s" repeatCount="indefinite" values="M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5;M9 19c-1.406 0-3-.5-4-.5-.532 0-1 0-2-.5;M9 19c-1.406 0-2.844-.563-3.688-1.188C4.47 17.188 4.22 16.157 3 15.5"/></path></g><rect width="8" height="4" x="8" y="11" fill="currentColor" mask="url(#lineMdGithubLoop0)"><animate attributeName="y" dur="10s" keyTimes="0;0.45;0.46;0.54;0.55;1" repeatCount="indefinite" values="11;11;7;7;11;11"/></rect></svg>',
        },
        link: 'https://github.com/KUN1007',
        ariaLabel: 'KUN, Moe Moe Moe',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="16" stroke-dashoffset="16" d="M21 5L18.5 20M21 5L9 13.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path><path stroke-dasharray="22" stroke-dashoffset="22" d="M21 5L2 12.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="22;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M18.5 20L9 13.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" values="12;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M2 12.5L9 13.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" values="8;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M12 16L9 19M9 13.5L9 19"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.3s" values="6;0"/></path></g></svg>',
        },
        link: 'https://t.me/kungalgame',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="42" stroke-dashoffset="42" d="M11 5H5V19H19V13"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="42;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M13 11L20 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.3s" values="12;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M21 3H15M21 3V9"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="8;0"/></path></g></svg>',
        },
        link: 'https://kungal.com',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="currentColor" d="M23.793 44.518c-3.659 0-7.017-1.225-9.179-3.053c-1.098.328-2.503.855-3.389 1.51c-.759.56-.664 1.13-.527 1.361c.6 1.013 10.296.647 13.095.332v-.15Zm0 0c3.659 0 7.017-1.225 9.179-3.053c1.097.328 2.502.855 3.389 1.51c.758.56.663 1.13.527 1.361c-.6 1.013-10.296.647-13.095.332v-.15Z"/><path fill="currentColor" fill-rule="evenodd" d="M36.339 20.933c-1.641.448-6.483 1.617-12.525 1.658h-.044c-6.195-.042-11.128-1.27-12.643-1.691c-.311-.087-.481-.267-.481-.267a74.794 74.794 0 0 1-.025-1.462c0-8.066 3.807-16.17 13.171-16.171c9.364 0 13.172 8.105 13.172 16.171c0 .479-.024 1.407-.025 1.463c0 0-.21.192-.6.299Zm2.49 4.417c.517 1.35 1.028 2.755 1.403 3.96c1.786 5.748 1.207 8.126.767 8.18c-.946.114-3.68-4.327-3.68-4.327c0 4.513-4.074 11.441-13.403 11.505h-.247c-9.33-.064-13.404-6.992-13.404-11.505c0 0-2.734 4.44-3.68 4.327c-.44-.054-1.018-2.432.768-8.18c.374-1.204.885-2.61 1.403-3.96c0 0 .35-.022.526.03c1.45.418 2.994.789 4.563 1.1c-.267 1.654-.42 3.703-.276 6.122c.384 6.434 4.205 10.479 10.104 10.537h.24c5.898-.058 9.718-4.103 10.103-10.537c.144-2.42-.008-4.467-.276-6.123a55.171 55.171 0 0 0 4.64-1.122c.15-.043.448-.007.448-.007Zm-5.089 1.13c-3.44.68-6.995 1.07-9.926 1.035h-.044c-2.93.035-6.486-.355-9.925-1.036l.042-.256c3.427.676 6.964 1.062 9.882 1.027h.045c2.918.036 6.457-.351 9.883-1.027c.015.084.03.17.043.256ZM18.038 11.686c.068 1.84 1.153 3.287 2.424 3.229c1.269-.057 2.242-1.595 2.173-3.436c-.069-1.84-1.154-3.287-2.423-3.23c-1.27.058-2.243 1.596-2.174 3.437Zm9.087 3.229c1.27.057 2.356-1.39 2.424-3.23c.07-1.84-.904-3.378-2.174-3.436c-1.27-.056-2.354 1.39-2.423 3.23c-.07 1.84.904 3.38 2.173 3.436Zm-3.31 1.009c4.232 0 7.65.837 7.99 1.59a.25.25 0 0 1 .025.106a.255.255 0 0 1-.047.145c-.286.418-4.082 2.478-7.968 2.478h-.046c-3.886 0-7.682-2.061-7.968-2.478a.257.257 0 0 1-.047-.144c0-.038.009-.074.025-.108c.34-.752 3.758-1.59 7.99-1.59h.046Z" clip-rule="evenodd"/><path fill="currentColor" d="M22.022 11.714c.058.727-.34 1.373-.89 1.443c-.549.07-1.04-.461-1.1-1.188c-.057-.727.341-1.373.89-1.443c.55-.071 1.042.461 1.1 1.188Zm3.49.243c.112-.201.877-1.259 2.46-.874c.415.102.608.25.648.309c.06.086.077.21.016.375c-.12.329-.369.32-.506.256c-.09-.042-1.192-.777-2.208.32c-.07.075-.195.1-.313.012c-.119-.09-.167-.272-.097-.398ZM15.504 26.712v6.332s2.9.585 5.807.18v-5.841a53.39 53.39 0 0 1-5.807-.671Z"/><path fill="currentColor" d="M36.938 20.634s-5.642 1.78-13.124 1.831h-.044c-7.47-.05-13.105-1.825-13.124-1.831l-1.89 4.716c4.726 1.425 10.584 2.343 15.014 2.29h.044c4.43.053 10.287-.865 15.014-2.29l-1.89-4.716Z"/></svg>',
        },
        link: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=hlXYbLM8MqOm9WzE22ZodNiQJ3nc1Bu2&authKey=7xfTYC1atV5loXyWNv9VOTOaf5ZzR9BdCFcMNJWdmyukck8%2FDLSF3%2FrHgyiY48pT&noverify=0&group_code=726477957',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-6zm5-7l2 3m6-3l-2 3m-5 7v-2m6 0v2"/></svg>',
        },
        link: 'https://space.bilibili.com/1748455574',
      },
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
