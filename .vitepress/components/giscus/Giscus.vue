<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useData } from 'vitepress'

const getStyles = () => {
  const lightUrl = new URL(
    '../../theme/giscus/giscus-light.css',
    // @ts-ignore
    import.meta.url
  ).href
  // @ts-ignore
  const darkUrl = new URL('../../theme/giscus/giscus-dark.css', import.meta.url)
    .href
  // @ts-ignore
  return useData().isDark.value ? darkUrl : lightUrl
}
</script>

<template>
  <div class="comments-container">
    <Giscus
      id="comments"
      repo="KUN1007/soft.moe"
      repoId="R_kgDOKOgQEA"
      category="General"
      categoryId="DIC_kwDOKOgQEM4Cbjqa"
      mapping="pathname"
      term="Welcome to SOFT! MOE!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      :theme="getStyles()"
      lang="en"
      loading="lazy"
    />
  </div>
</template>

<style lang="scss" scoped>
.comments-container {
  max-height: 640px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
</style>
