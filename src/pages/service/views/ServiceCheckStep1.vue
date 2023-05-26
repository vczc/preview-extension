<template>
  <main class="service-check">
    <el-form ref="formRef" :model="serviceStore.form" label-width="130" label-position="left" :rules="ruleForm">
      <el-form-item label="ZKOS版本号" prop="version">
        <el-select v-model="serviceStore.form.version" placeholder="请选择" style="width:100%">
          <el-option :label="v" :value="v" v-for="v in selectors.versions" :key="v" />
        </el-select>
      </el-form-item>
      <el-form-item label="模拟平台" prop="platform_info">
        <el-select v-model="serviceStore.form.platform_info" placeholder="请选择" style="width:100%">
          <el-option :label="p" :value="p" v-for="p in selectors.platform_info" :key="p" />
        </el-select>
      </el-form-item>
      <el-form-item label="平台IP" prop="ip_address">
        <el-input v-model="serviceStore.form.ip_address" placeholder="请输入平台IP" />
      </el-form-item>
      <el-form-item label="平台掩码" prop="netmask">
        <el-input v-model="serviceStore.form.mask" placeholder="请输入平台掩码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">下一步</el-button>
      </el-form-item>
    </el-form>
  </main>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useServicesStore } from '../stores/services'
import { useRouter } from 'vue-router'
import { getVersionPlatform } from '../services/serviceCheck'
import type { VersionPlatform } from '../services/service'
import { ElMessage } from 'element-plus'


const router = useRouter()

const formRef = ref()
// all the form data save in the pinia store
const serviceStore = useServicesStore()

const ruleForm = reactive({
  version: [
    { required: true, message: '请选择ZKOS版本', trigger: 'change' },
  ],
  platform_info: [
    { required: true, message: '请选择模拟平台', trigger: 'change' },
  ],
  ip_address: [
    { required: true, message: '请输入平台IP', trigger: 'blur' },
  ],
  mask: [
    { required: true, message: '请输入掩码', trigger: 'blur' },
  ]
})
onMounted(() => {
  // @ts-ignore
  // const vscode = acquireVsCodeApi();
  // console.log('在vscode里是否有', vscode);
  getSelectersData()
})
const getSelectersData = async () => {
  const { code, data } = await getVersionPlatform()
  if (code == 200) {
    selectors.platform_info = data!.platform_info
    selectors.versions = data!.versions
  }
}
// selector's data
const selectors = reactive<VersionPlatform>({
  versions: [],
  platform_info: []
})

// submit the form save data in pinia store for step2
const onSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('submit!', serviceStore.form)
      router.push('/step2')
    } else {
      console.log('error submit!')
      ElMessage.warning('参数不完整!')
      return false
    }
  })
}
</script>
  
<style>
.service-check {
  width: 100%!important;
}
</style>