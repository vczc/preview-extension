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
    fieldsSource: [
      // {
      //   value: 'ChrgnDispStatus',
      //   label: 'ChrgnDispStatus',
      //   selected: false
      // },
      // {
      //   value: 'OnBdChrgrPwrEnaAllwdStatus',
      //   label: 'OnBdChrgrPwrEnaAllwdStatus',
      //   selected: false
      // },
    ]
  })

  // init selector's data
  onMounted(() => {
    initData()
  })

  const initData = async () => {
    const _fields = await getFields({ appname: '' })
    if (_fields.code === 200) {
      const formatteFields: Field[] = _fields!.data!.map((item) => {
        return {
          value: item,
          label: item,
          selected: false
        }
      })
      fields.fieldsSource = formatteFields
      _fields!.data!.forEach(async (item) => {
        // init selecter details
        initDetail(item)
      })
    }
  }

  // when selecter change
  const changeSelect = (val: string) => {
    fields.fieldsSource = fields.fieldsSource.map((i) => {
      i.selected = val === i.value
      return i
    })
  }
  // click add btn
  const addRecord = () => {
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
      if (row.value === row.value) {
        _.selected = false
      }
      return _;
    });
    // 2. remove table data
    fields.fields.splice(index, 1)
  }

  return {
    fields,
    selectTableRef,
    initData,
    changeSelect,
    addRecord,
    removeRecord,
    removeMultiple
  }
}
