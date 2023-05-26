<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
</script>

<template>
  <div>hello page2
    <button @click="()=>{router.back()}">返回</button>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  user-select: none;
}
</style>
