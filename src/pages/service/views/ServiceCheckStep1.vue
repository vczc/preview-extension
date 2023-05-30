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
      <el-form-item v-if="serviceStore.form.platform_info == 'S32G'" label="Service Client IP" prop="service_clien_ip">
        <el-input v-model="serviceStore.form.service_clien_ip" placeholder="默认32G地址为10.124.0.1,如有变更请手动更改" />
      </el-form-item>
      <el-form-item label="平台IP" prop="ip_address">
        <el-input v-model="serviceStore.form.ip_address" placeholder="请输入和目标平台同网段的ip地址" />
      </el-form-item>
      <el-form-item label="平台掩码" prop="netmask">
        <el-input v-model="serviceStore.form.mask" placeholder="请输入和目标平台同网段的mask掩码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">下一步</el-button>
        <!-- <el-button type="primary" @click="router.push('/step2')">第二部</el-button> -->
        <!-- <el-button type="primary" @click="testPostMessage">postMsg</el-button> -->
      </el-form-item>
      <el-form-item v-if="showStrartTip">
        <el-alert title="环境初始化中, 可能耗时较长, 初始化完毕自动跳转, 请耐心等待!" type="warning" />
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
import { useAppInstanceHook } from '../hooks/useAppInstance'
import { checkIpv4, checkSubnetMask } from '../utils'

const [appInstance] = useAppInstanceHook()
const router = useRouter()
const formRef = ref()
const showStrartTip = ref(false)
// all the form data save in the pinia store
const serviceStore = useServicesStore()

// validate ip_address (type:ipv4)
const validaIp = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入平台IP'))
  } else {
    if (!checkIpv4(value)) {
      callback('IP格式填写错误')
    } else {
      callback()
    }
  }
}

// validate subnext mask (type:ipv4)
const validaSubnetMask = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入平台IP'))
  } else {
    if (!checkSubnetMask(value)) {
      callback('IP格式填写错误')
    } else {
      callback()
    }
  }
}

// form submit rules
const ruleForm = reactive({
  version: [
    { required: true, message: '请选择ZKOS版本', trigger: 'change' },
  ],
  platform_info: [
    { required: true, message: '请选择模拟平台', trigger: 'change' },
  ],
  service_clien_ip: [
    { required: true, message: '请输入Service Clien IP', trigger: 'blur' },
  ],
  ip_address: [
    { required: true, message: '请输入平台IP', trigger: 'blur'},
    { validator: validaIp, trigger: 'blur' }
  ],
  mask: [
    { required: true, message: '请输入掩码', trigger: 'blur' },
    { validator: validaSubnetMask, trigger: 'blur' }
  ]
})


onMounted(() => {
  // get sudo stdout and change router
  window.addEventListener('message', async (event) => { // 前端页面接收主进程发来的消息
    if (event.data.id === 'vscode:sudo:cb') {
      console.log('接收到了sudo后的回调', event.data.data);
      showStrartTip.value = false
      serviceStore.form.sdkPath = event.data.sdkPath
      router.push('/step2')
    }
  })
  // 获取下拉框选项内容
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
      showStrartTip.value = true
      appInstance.$vscode.postMessage({ 
        id: 'vscode:sudo',
        ip_address: serviceStore.form.ip_address,
        mask: serviceStore.form.mask,
        version: serviceStore.form.version
      }, '*');
    }
  })
}
</script>
  
<style>
.service-check {
  width: 100%!important;
}
</style>