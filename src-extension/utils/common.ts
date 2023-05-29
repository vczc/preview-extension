import { getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'

export function useCurrentInstance () {
    const { appContext, proxy } = (getCurrentInstance() as ComponentInternalInstance)
    const _this = appContext.config.globalProperties
    return [
        _this,
        proxy
    ]
}