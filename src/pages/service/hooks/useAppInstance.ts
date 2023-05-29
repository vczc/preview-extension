
import { ComponentInternalInstance, getCurrentInstance } from "vue";


export function useAppInstanceHook() {
    const {appContext} = getCurrentInstance() as ComponentInternalInstance
    const _globalProperties = appContext.config.globalProperties
    // @ts-ignore
    return [_globalProperties]

}