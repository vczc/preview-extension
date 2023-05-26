<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
</script>

<template>
  <div>hello page1
    <!-- <button @click="()=>{router.back()}">返回</button> -->
    <router-link to="/page2">page2</router-link>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  user-select: none;
}
</style>
