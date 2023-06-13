<script setup lang="ts">
import { ref, inject, onUnmounted, onMounted } from 'vue'
import { useIndexHook } from './index.hook'
import { usePageStore } from '../services/store.service'
import { storeToRefs } from 'pinia'
import Viewport from './viewport/index.vue'

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
    </div>

    <div>
      <Viewport />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index-container {
  .read-the-docs {
    color: red;
  }
}
</style>
