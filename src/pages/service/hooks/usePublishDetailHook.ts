import { useServicesStore } from './../stores/services';
import { onMounted, reactive, ref } from 'vue';
import { getFieldDetail } from '../services/serviceCheck';
import { nanoid } from 'nanoid';

import {
  BASE_INT_TYPES,
  BASE_INPUT_TYPES,
  BASE_BOOL_TYPES,
  BASE_FLOAT_TYPES
} from '../constants/controls';
import { isArray, isInteger, isPlainObject, isString } from 'lodash'
import { PublishTableItem } from '../services/service';

export function usePublishDetailHook() {
  const servicesStore = useServicesStore()
  // formatte data for item detail
  const formatteData = (data: any) => {
    const arr: PublishTableItem[] = []
    Object.keys(data).map((key: string) => {
      const obj: PublishTableItem = {} as PublishTableItem
      obj.key = key
      obj.options = []
      obj.id = nanoid()
      // it's string type means an it need a ui controler
      if (isString(data[key])) {
        // split a detail type, all types in #TYPES_MAP
        if (BASE_INT_TYPES.includes(data[key])) {
          // 数字类型
          obj.type = 'int'
        } else if (BASE_INPUT_TYPES.includes(data[key])) {
          obj.type = 'string'
        } else if (BASE_BOOL_TYPES.includes(data[key])) {
          obj.type = 'bool'
        } else if (BASE_FLOAT_TYPES.includes(data[key])) {
          obj.type = 'double'
        }
      } else if (isPlainObject(data[key])) {
        // for nothing just tag
        obj.type = 'object'
        Object.keys(data[key]).forEach((_item) => {
          if (isInteger(data[key][_item])) {
            obj.options?.push({
              label: _item,
              value: data[key][_item]
            })
            obj.type = 'select'
          } else {
            delete obj.options
          }
        })
        if (obj.type === 'select') {
          obj.children = []
        } else {
          obj.children = formatteData(data[key])
        }
      } else if (isArray(data[key])) {
        // if it's a add buton set the type be button
        obj.type = 'button'
        obj.newOption = formatteData(data[key][0])
      }
      arr.push(obj)
    })
    return arr
  }

  const initDetail = async (fieldName: string) => {
    const _details = await getFieldDetail({
      appname: '',
      field_name: fieldName
    })
    if (_details.code === 200) {
      const transformData = formatteData(_details!.data!.input)
      _details!.data!.transformData = transformData
      console.log('转换后的', _details.data)
      servicesStore.setTopicDetail(fieldName, _details.data)
    }
  }

  return {
    initDetail
  }
}
