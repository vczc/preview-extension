<template>
  <main class="service-check-wrap">
    <h1 class="base-title-h1 title">
      服务验证<el-icon color="#666"><InfoFilled /></el-icon>
    </h1>
    <div class="service-check_inner">
      <h2 class="base-title title">服务验证</h2>
      <router-view></router-view>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useServicesStore } from '../stores/services'
import { InfoFilled } from '@element-plus/icons-vue'
</script>

<style lang="scss">
.service-check {
  &-wrap {
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    .title {
      color: #fff;
    }
    .base-title-h1 {
      font-size: 16px;
    }
    .base-title {
      font-size: 14px;
      line-height: 30px;
      height: 30px;
      padding-bottom: 0;
      padding-left: 10px;
      position: relative;
      margin-bottom: 10px;
      &::after {
        content: '';
        display: block;
        height: 20px;
        width: 2px;
        background-color: #f76400;
        position: absolute;
        left: 0;
        top: 4px;
      }
    }
  }
  &_inner {
    padding: 20px;
    min-height: 100%;
    background: #242424;
    flex: 1;
    position: relative;
  }
}
</style>
