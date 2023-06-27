<script setup lang="ts">
import { useViewportPageHook } from './viewport.hook'
import Loading from '../loading-bar/loading-bar.vue'
import ViewportInfo from '../viewport-info/viewport-info.vue'
import CanvasRender from '../canvas-render/canvas-render.vue'
import { usePageStore } from '../../services/store.service'

const store = usePageStore()
const { viewportRef, viewportClass } = useViewportPageHook()
</script>

<template>
  <div :class="['viewport', viewportClass]" ref="viewportRef">
    <Loading :percent="store.state.viewportMetadata.loadingPercent" />
    <ViewportInfo :height="store.state.viewportMetadata.height" :width="store.state.viewportMetadata.width" />
    <!-- <Resizable className="viewport-resizable-wrap"> </Resizable> -->
    <CanvasRender />
  </div>
</template>

<style src="./viewport.css"></style>
