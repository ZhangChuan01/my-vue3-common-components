/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, defineAsyncComponent } from 'vue'
export default {
  install (app: App) {
    const baseModules = import.meta.glob('./base/*.vue')
    for (const path in baseModules) {
      const result: Array<any> = path.match(/.*\/(.+).vue$/)!
      const modulesConent: any = baseModules[path]
      app.component(result[1], defineAsyncComponent(modulesConent))
    }
    const requireModules = import.meta.glob('./*.vue')
    for (const path in requireModules) {
      const result: Array<any> = path.match(/.*\/(.+).vue$/)!
      const modulesConent: any = requireModules[path]
      app.component(result[1], defineAsyncComponent(modulesConent))
    }
  }
}
