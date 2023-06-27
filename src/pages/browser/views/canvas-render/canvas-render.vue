<script setup lang="ts">
import { useCanvasRenderHook } from './canvas-render.hook'
const { imageRef, canvasRef, handleMouseEvent, handleKeyEvent } = useCanvasRenderHook()
</script>

<template>
  <div class="fill-flex">
    <img ref="imageRef" className="img-hidden" />
    <canvas
      className="screencast"
      ref="canvasRef"
      @mousedown="handleMouseEvent"
      @mouseUp="handleMouseEvent"
      @mouseMove="handleMouseEvent"
      @click="handleMouseEvent"
      @dblclick="handleMouseEvent"
      @wheel="handleMouseEvent"
      @keydown="handleKeyEvent"
      @keyup="handleKeyEvent"
      @keypress="handleKeyEvent"
    />
  </div>
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

.fill-flex {
  height: 100%;
  width: 100%;
  display: 'flex';
}
</style>
