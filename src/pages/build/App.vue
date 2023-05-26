<template>
  <el-config-provider size="large">
    <router-view v-slot="{ Component }">
      <transition name="fade-transverse" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </el-config-provider>
</template>
