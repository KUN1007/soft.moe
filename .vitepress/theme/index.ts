// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'

import './reset.scss'
import './light.scss'
import './dark.scss'

import { inBrowser } from 'vitepress'
import busuanzi from 'busuanzi.pure.js'
import Analytics from '../components/analytics/Analytics.vue'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-bottom': () => h(Analytics),
    })
  },
  enhanceApp({ app, router, siteData }) {
    if (inBrowser) {
      router.onAfterRouteChanged = () => {
        busuanzi.fetch()
      }
    }
  },
}
