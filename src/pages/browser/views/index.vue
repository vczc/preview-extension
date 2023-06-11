<script setup lang="ts">
import { ref, inject, onUnmounted, onMounted } from 'vue'
import { useIndexHook } from './index.hook'
import { usePageStore } from '../services/store.service'
import { storeToRefs } from 'pinia'

const store = usePageStore()
const { state } = storeToRefs(store)
const { increment } = store
useIndexHook()
</script>

<template>
  <div class="index-container">
    <h1>{{ state.url }}</h1>

    <div class="card">
      <button type="button" @click="increment">url is {{ state.url }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite starter
    </p>
    <p>
      Install
      <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
      in your IDE for a better DX
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style lang="scss" scoped>
.index-container {
  .read-the-docs {
    color: red;
  }
}
</style>
