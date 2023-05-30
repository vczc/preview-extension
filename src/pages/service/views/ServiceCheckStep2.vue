<template>
  <main class="service-check">
    <el-row>
      <el-col :span="4"><el-text class="mx-1" type="danger">*</el-text>ARXML文件路径</el-col>
      <el-col :span="20" class="d-flex">
        <!-- <div class="fake-input el-text is-truncated flex1">
          {{ serviceStore.form.arxml || '请点击选择ARXML文件所在路径' }}
        </div> -->
        <el-input v-model="serviceStore.form.arxml" placeholder="请点击选择ARXML文件所在路径"></el-input>
        <el-button plain type="warning" style="margin-left:20px;" @click="selectFilePath">添加文件</el-button>
      </el-col>
    </el-row>
    <el-row class="filetable">
      <div class="filetitle">{{ tableData[0]?.app_name }}</div>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="service_id" label="Service id" />
        <el-table-column prop="instance_id" label="Intance id" />
        <el-table-column prop="port" label="Port" />
        <el-table-column prop="ipv_4_address" label="IP" />
      </el-table>
    </el-row>
    <div class="el-row">
      <div class="filetitle d-flex space-between">
        <div class="title">Topic</div>
        <div class="opration-bar">
          <el-button plain type="warning" @click="addRecord">添加</el-button>
          <el-button plain type="warning" @click="removeMultiple">删除</el-button>
        </div>
      </div>
      <el-table :data="fields.fields" style="width: 100%" border ref="selectTableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column label="Unicast" width="40%">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-select
                v-model="fields.fields[scope['$index']].value"
                placeholder="请选择"
                @change="changeSelect"
                styel="width:100%"
              >
                <el-option
                  v-for="item in fields.fieldsSource"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                  :disabled="item.selected"
                />
              </el-select>
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参数设置" align="center">
          <template #default="scope">
            <div class="cursor" @click="showDetail(scope.row)">
              <el-icon color="#666">
                <DArrowRight />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template #default="scope">
            <div class="cursor" @click="removeRecord(scope.row, scope.$index)">
              <el-icon color="#666">
                <RemoveFilled />
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="start-btn">
      <el-button v-if="!canStop" plain type="warning" @click="startAction">启动</el-button>
      <el-button v-else plain type="warning" @click="stopAction">停止</el-button>
    </div>
    <el-drawer v-model="showDrawer" direction="rtl" size="600">
      <template #header>
        <h4>参数设置</h4>
      </template>
      <template #default>
        <el-table
          :data="topicData"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          border
          default-expand-all
        >
          <el-table-column prop="key" label="Key" />
          <el-table-column label="Value" width="180">
            <template #default="{ row }">
              <div style="display: flex; align-items: center">
                <template v-if="!row.children?.length">
                  <template v-if="row.type === 'bool'">
                    <el-switch v-model="row.value" active-text="true" inactive-text="false"/>
                  </template>
                  <template v-else-if="row.type === 'string'">
                    <el-input v-model="row.value" placeholder="请输入..."></el-input>
                  </template>
                  <template v-else-if="row.type === 'int'">
                    <el-input-number
                      v-model="row.value"
                      controls-position="right"
                      placeholder="请输入..."
                    />
                  </template>
                  <template v-else-if="row.type === 'select'">
                    <el-select v-model="row.value" placeholder="请选择">
                      <el-option
                        v-for="item in row.options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                  <template v-else-if="row.type === 'double'">
                    <el-input v-model="row.value" type="number" placeholder="请输入..."></el-input>
                  </template>
                  <template v-if="row.type === 'button'">
                    <el-button :icon="Plus" type="primary" size="small" @click="addForm(row)"
                      >新增</el-button
                    >
                  </template>
                </template>
                <template v-else>
                  <template v-if="row.type === 'button'">
                    <el-button :icon="Plus" type="primary" size="small" @click="addForm(row)"
                      >新增</el-button
                    >
                  </template>
                </template>
                <!-- {{ row.type }} -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useServicesStore } from '../stores/services'
import { ElMessage } from 'element-plus'
import { DArrowRight, RemoveFilled, Plus } from '@element-plus/icons-vue'
import { envInit, getAppInfo, start, commit } from '../services/serviceCheck'
import { useTopicHook } from '../hooks/useTopicHook'
import type { AppInfo, PublishTableItem, StartParams } from '../services/service'
import { useAppInstanceHook } from '../hooks/useAppInstance'

const [appInstance] = useAppInstanceHook()

const topicData = ref<PublishTableItem[]>([])
const canStop = ref(false)
// fake data from backend
// const testData = reactive({
//   topic_name: 'OnBdChrgrPwrEnaAllwdStatus',
//   input: {
//     data: 'bool',
//     name: 'string',
//     name2: 'string',
//     age: 'int',
//     struct_param1: {
//       street: 'string',
//       city: 'string',
//       zip: 'int64_t'
//     },
//     struct_param2: {
//       struct_item21: {
//         str_item: 'string',
//         int_item: 'int'
//       },
//       struct_item22: {
//         bool_item: 'bool',
//         float_item: 'float',
//         enum_item: {
//           kUnknow: 0,
//           kValue: 1
//         }
//       },
//       array_item: [
//         {
//           string_item: 'string',
//           // int_array:[
//           // { "testes": "int"}
//           // ],
//           int_item2: 'int'
//         }
//       ]
//     },
//     array_item: [
//       {
//         string_item: 'string',
//         int_array: [{ testes: 'int' }],
//         int_item2: 'int'
//       }
//     ],
//     enum_item1: {
//       kUnknow: 0,
//       kValue: 1
//     }
//   },
//   output: ''
// })

const addForm = (row: PublishTableItem) => {
  // handle the add button action
  row.children = row.children ? [...row.children, ...row.newOption] : [...row.newOption]
}


const { fields, selectTableRef, initData, changeSelect, addRecord, removeRecord, removeMultiple } =
  useTopicHook()

// all the form data save in the pinia store
const serviceStore = useServicesStore()

onMounted(() => {
  window.addEventListener('message', async (event) => { // 前端页面接收主进程发来的消息
    if (event.data.id === 'changePath') {
      console.log('接收到了sudo后的回调', event);
      serviceStore.form.arxml = event.data.path

      const _initRes = await envInit({
        env_root_path: '/home/zeekr/vscode',
        arxml_file_path: event.data.path
      })
      if (_initRes.code === 200) {
        const _appInfo = await getAppInfo({ appname: '' })
        if (_appInfo.code === 200) {
          tableData.value = [_appInfo.data as AppInfo]
          initData()
        }
      }
    }
  })
})
// table data
const tableData = ref<AppInfo[]>([])
// select a path use vscode api
const selectFilePath = async () => {
  // serviceStore.form.arxml = '/asdf'
  appInstance.$vscode.postMessage({ 
    id: 'vscode:dialog', 
    path: '',
    canSelectFiles: true
  }, '*');

}

const stopAction = async () => {
  const _stopRes = await commit({ type: 1 })
}

const startAction = async () => {
  const obj: StartParams = {
    version: serviceStore.form.version,
    appname: tableData.value[0].app_name as string,
    ip_address: serviceStore.form.ip_address,
    mask: serviceStore.form.mask,
    platform: serviceStore.form.platform_info,
    data: {
      fields: [],
      methods: []
    }
  }
  fields.fields.map((item) => {
    if (item.value) {
      const _field = {
        topic_name: item.value,
        output: '',
        input: {}
      }
      const _input: {
        [key: string]: any
      } = {}
      serviceStore.topicDetail[item.value].transformData.forEach(
        (transformItem: PublishTableItem) => {
          _input[transformItem.key] = transformItem.value
        }
      )
      _field.input = _input
      obj.data.fields.push(_field)
    }
  })
  const _startRes = await start(obj)
  canStop.value = true
  console.log(_startRes)
}

const clearTopicDataValue = (data: PublishTableItem[]) => {
  data.forEach((item) => {
    switch (item.value) {
      case 'string':
        item.value = ''
        break
      case 'boolearn':
        item.value = false
        break
      case 'number':
        item.value = 0
        break
      default:
        item.value = ''
        break
    }
    if (item.children) {
      clearTopicDataValue(item.children)
    }
  })
}

// click detail icon show drawer
const showDrawer = ref(false)
// show drawer data detail
const showDetail = (row: any) => {
  console.log(row)
  if (!row.value) {
    ElMessage.warning('this is a message.')
    // ElMessage({
    //   message: 'this is a message.',
    //   grouping: true,
    //   type: 'success'
    // })
    // alert(1)
    //   {
    //   message: '请选择一个类型',
    //   type: 'warning'
    // })
    return
  }
  // const formatterdata = formatteData(testData.input)
  topicData.value = serviceStore.topicDetail[row.value].transformData
  showDrawer.value = true
}
// reset drawer params config
const reset = () => {
  clearTopicDataValue(topicData.value)
  showDrawer.value = false
}
// submit drawer params config
const submit = () => {
  showDrawer.value = false
  console.log(topicData.value)
}
</script>

<style lang="scss">
.service-check {
  min-width: 400px;
  .el-row {
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 20px;
  }
}

.fake-input {
  background-color: var(--el-disabled-bg-color);
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
  padding: 7px 15px;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  width: 100%;
  text-align: left;
  cursor: pointer;
  margin-right: 20px;
}

.filetitle {
  padding-bottom: 10px;
  width: 100%;
}

.el-row {
  margin-bottom: 10px;
  padding: 10px;
  background: #2a2a2a;
  color: #999;
  align-items: center;
}
.start-btn {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  padding: 20px;
  text-align: right;
}
</style>
