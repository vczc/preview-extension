<script setup lang="ts">
import { useCanvasRenderHook } from './canvas-render.hook'
useCanvasRenderHook()
</script>

<template>
  <div class="canvas-render">canvas-render</div>
</template>

<style>
.screencast {
  height: 100%;
  width: 100%;
  image-rendering: auto; /* Disables interpolation. See https://stackoverflow.com/questions/7615009/disable-interpolation-when-scaling-a-canvas */
}

.img-hidden {
  display: none;
}
</style>
