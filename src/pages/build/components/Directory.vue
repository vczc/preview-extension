<template>
  <div class="directory">
    <el-input
      v-model="props.path"
      :placeholder="props?.placeholder"
      readonly
    >
      <template #suffix>
        <el-icon
          class="hidden"
          @click="handleClear"
        >
          <CircleClose />
        </el-icon>
      </template>
      <template #append>
        <el-button
          :icon="Folder"
          @click="handleDirectory"
        />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Folder, CircleClose } from '@element-plus/icons-vue';
import { useCurrentInstance } from '../../../utils/common';
const [vmInstance, proxy] = useCurrentInstance()

const props = defineProps<{ path?: string, placeholder?: string }>()
const emits = defineEmits(['update:path'])

/**
 * 唤起文件夹选择
 */
const handleDirectory = () => {
  vmInstance?.$vscode.postMessage?.({ 
    id: 'vscode:dialog', 
    path: props?.path,
  }, '*');
}

/**
 * 清除文件选择
 */
const handleClear = () => {
  if (props?.path) emits('update:path', '')
}

onMounted(() => {
  window.addEventListener('message', async (event) => { // 前端页面接收主进程发来的消息
    if (event.data.id === 'changePath') emits('update:path', event.data?.path)
  })
})
</script>

<style scoped>
.directory {
  width: 100%;
  display: inline-flex;
}
.directory :deep(.el-input) .el-button {
  color: var(--el-color-primary);
}
.directory :deep(.el-input):hover .hidden {
  display: inline-flex;
}
.hidden {
  display: none;
  cursor: pointer;
}
</style>