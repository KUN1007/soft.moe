// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'

import './reset.scss'
import './light.scss'
import './dark.scss'

import Friends from '../components/friends/Friends.vue'
import TouchFish from '../components/doc-after/TouchFish.vue'
import Giscus from '../components/giscus/Giscus.vue'
import KunImage from '../components/kun-image/KunImage.vue'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-after': () => [h(TouchFish), h(Giscus)],
      'home-features-after': () => h(Friends),
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('KunImage', KunImage)
  },
}
