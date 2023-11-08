<script setup lang="ts"></script>

<template>
  <div class="root">
    <div>
      <span>Pageviews - 访问量</span><span id="busuanzi_value_site_pv"></span>
    </div>

    <div>
      <span>Visitors - 访客数</span>
      <span id="busuanzi_value_site_uv"> </span>
    </div>

    <div>
      <span>Article Views - 本文浏览数</span>
      <span id="busuanzi_value_page_pv"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.root {
  margin: 0 auto;
  max-width: 992px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-style: oblique;
  margin-bottom: 33px;

  & > div {
    display: flex;
    justify-content: space-between;

    span {
      &:nth-child(1) {
        margin-right: 17px;
      }

      &:nth-child(2) {
        color: var(--kungalgame-blue-4);
      }
    }
  }
}
</style>
