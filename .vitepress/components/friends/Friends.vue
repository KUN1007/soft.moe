<script setup lang="ts">
import { friendList } from './friendList'
</script>

<template>
  <div class="root">
    <span class="title">Friends</span>

    <div class="container">
      <a
        class="friend"
        v-for="(loli, index) in friendList"
        :key="index"
        :href="loli.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="loli.avatar" :alt="loli.name.charAt(0)" />

        <span>{{ loli.name }}</span>
        <span>{{ loli.introduction }}</span>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.root {
  padding: 0 64px;
  padding-top: 64px;
}

.title {
  font-size: 30px;
}

.container {
  display: flex;
  flex-wrap: wrap;
}

.friend {
  display: flex;
  align-items: center;
  position: relative;
  margin: 32px;
  margin-left: 0;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid var(--kungalgame-trans-blue-1);
  box-shadow: var(--kungalgame-shadow-0);

  img {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    transform: translateX(-7px);
  }

  span {
    padding: 10px 0;
    padding-left: 50px;
  }

  &:hover {
    transition: all 0.2s;
    box-shadow: var(--kungalgame-shadow-1);
  }
}
</style>
