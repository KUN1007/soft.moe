<script setup lang="ts">
const props = defineProps<{
  src: string
}>()
</script>

<template>
  <Teleport to="#app">
    <img class="kun-image" :src="props.src" />
  </Teleport>
</template>

<style lang="scss" scoped>
.kun-image {
  position: fixed;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
