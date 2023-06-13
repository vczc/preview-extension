<script setup lang="ts">
import { useViewportHook } from './viewport.hook'
import Loading from '../loading-bar/loading-bar.vue'
import ViewportInfo from '../viewport-info/viewport-info.vue'
import CanvasRender from '../canvas-render/canvas-render.vue'

useViewportHook()
</script>

<template>
  <div class="viewport">
    <Loading percent="{this.viewportMetadata.loadingPercent}" />
    <ViewportInfo height="{this.viewportMetadata.height}" width="{this.viewportMetadata.width}" />
    <!-- <Resizable className="viewport-resizable-wrap"> </Resizable> -->
    <CanvasRender />
  </div>
</template>

<style src="./viewport.css"></style>
