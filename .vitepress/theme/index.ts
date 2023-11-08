// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './light.css'
import './dark.css'

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
