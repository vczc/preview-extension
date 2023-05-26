import { onMounted, reactive, ref } from 'vue';
import { getFields } from '../services/serviceCheck';
import type { Field } from '../services/service';
import type { TableRefs } from 'element-plus/lib/components/table/src/table/defaults.js';

import { usePublishDetailHook } from './usePublishDetailHook';

export function useTopicHook() {
  // table ref
  const selectTableRef = ref<TableRefs>()

  const { initDetail } = usePublishDetailHook()

  // click batch remove btn
  const removeMultiple = () => {
    const _selecters = selectTableRef?.value?.getSelectionRows()
    console.log('当前选中行', _selecters)
  }

  // configs setting data
  const fields = reactive<{
    fields: Field[]
    fieldsSource: Field[]
  }>({
    fields: [
      // {
      //   value: 'ChrgnDispStatus',
      //   label: ''
      // },
      // {
      //   value: 'OnBdChrgrPwrEnaAllwdStatus',
      //   label: ''
      // }
    ],
    fieldsSource: []
  })

  // init selector's data
  onMounted(() => {
    initData()
  })

  const initData = async () => {
    const _fields = await getFields({ appname: '' })
    if (_fields.code === 200) {
      const formatteFields: Field[] = _fields.data.map((item) => {
        return {
          value: item,
          label: item,
          selected: false
        }
      })
      fields.fieldsSource = formatteFields
      _fields.data.forEach(async (item) => {
        // init selecter details
        // TODO: 记得打开下面注释
        // initDetail(item)
      })
    }
  }

  // when selecter change
  const changeSelect = (val: string) => {
    console.log('当前选项val', val)
    fields.fieldsSource = fields.fieldsSource.map((i) => {
      i.selected = val == i.value
      return i
    })
  }
  // click add btn
  const addRecord = () => {
    console.log('新增了')
    fields.fieldsSource.length > fields.fields.length &&
      fields.fields.push({
        value: '',
        label: ''
      })
  }

  // remove table row
  const removeRecord = (row: any, index: number) => {
    // 1. reset selecter options setting
    fields.fieldsSource = fields.fieldsSource.map((_) => {
      if (row.value === row.value) _.selected = false
      return _;
    });
    // 2. remove table data
    fields.fields.splice(index, 1)
  }

  return {
    fields,
    selectTableRef,
    changeSelect,
    addRecord,
    removeRecord,
    removeMultiple
  }
}
