/**
 * 递归赋值
 * @param obj 需赋值对象
 * @param values 包含新值对象
 * @returns object 新对象
 */
export function recursiveUpdate<T>(obj: T, values: T): T {
  if (!isObject(obj) || !isObject(values)) {
    throw new TypeError('Please check if a correct object was passed in')
  }

  for (const i in values) {
    if (isObject(values[i])) {
      obj[i] = recursiveUpdate(obj[i], values[i])
    } else {
      obj[i] = values[i]
    }
  }

  return obj
}

/**
 * 是否为对象
 * @param obj 目标对象
 * @returns boolean
 */
export const isObject = (obj: any): boolean => {
  return typeof obj === 'object'
}
