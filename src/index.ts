/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, defineAsyncComponent } from 'vue'

export interface InitConfig {
  formCol?: number
  formLabelPosition?: string
}
export default {
  install (app: App, options?: InitConfig | undefined) {
    console.log('install', options)
    if(options) {
      app.provide('initConfig', options)
      app.config.globalProperties.$componentsConfig = options
    }
    const baseModules = import.meta.glob('./components/global/base/*.vue')
    for (const path in baseModules) {
      const result: Array<any> = path.match(/.*\/(.+).vue$/)!
      const modulesConent: any = baseModules[path]
      app.component(result[1], defineAsyncComponent(modulesConent))
    }
    const requireModules = import.meta.glob('./components/global/*.vue')
    for (const path in requireModules) {
      const result: Array<any> = path.match(/.*\/(.+).vue$/)!
      const modulesConent: any = requireModules[path]
      // console.log(modulesConent,result)
      app.component(result[1], defineAsyncComponent(modulesConent))
    }
  }
}
