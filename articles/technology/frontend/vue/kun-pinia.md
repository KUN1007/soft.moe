# 如何在 setup() 外使用 Pinia

可以在 Pinia 的[官方文档](https://pinia.vuejs.org/ssr/nuxt.html#Using-the-store-outside-of-setup-)找到解决方案

文档中提到了
```typescript
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

  

我们使用 typescript，请看下面的代码，假设它位于 `'~/composables/useMystore.ts'`

```typescript
import { useStore } from '~/stores/myStore'
import type { Pinia } from '@pinia/nuxt/dist/runtime/composables'

export const useMyStore = {
  asyncData($pinia: Pinia) {
    const store = useStore($pinia)
    const logMyStore = () => {
        console.log(store)
    }
    return logMyStore
  },
}
```

  

于是当我们在 `<script setup>` 中使用时，我们可以这样使用

```vue
<script setup lang="ts">
  const logMyStore = useMyStore.asyncData(useNuxtApp().$pinia)
  logMyStore()
</script>
```

