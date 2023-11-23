<!-- 我知道这不是 Touch fish, 但是 fish 比 loaf 可爱 -->

<script setup lang="ts">
import { useMouse } from './mouse'

const { x, y } = useMouse()
</script>

<template>
  <div class="copyright">
    <span>What's Kun's hobby? Of course, it's loafing around!</span>
    <span>鲲的爱好是什么？鲲的爱好当然是摸鱼！</span>
    <span>Mouse position is at: {{ x }}, {{ y }}</span>
  </div>
</template>

<style lang="scss" scoped>
.copyright {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 0;

  span {
    margin-bottom: 10px;
  }
}
</style>
