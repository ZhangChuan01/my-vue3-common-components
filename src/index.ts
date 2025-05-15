/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, defineAsyncComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import locals from './locals'
export interface InitConfig {
  formCol?: number
  formLabelPosition?: string
  i18n?: any
}
export default {
  install (app: App, options?: InitConfig | undefined) {
    // console.log('install', options)
    if(options) {
      app.provide('initConfig', options)
    }
    const i18n = options?.i18n || createI18n({
      locale: 'en',
      messages: locals
    })
    Object.keys(locals).forEach(lang => {
      i18n.global.mergeLocaleMessage(lang, locals[lang])
    })
    // console.log('locals[lang]', i18n)
    if(!options?.i18n) {
      app.use(i18n)
    }
    const baseModules = import.meta.glob('./components/generally/base/*.vue')
    for (const path in baseModules) {
      const result: Array<any> = path.match(/.*\/(.+).vue$/)!
      const modulesConent: any = baseModules[path]
      app.component(result[1], defineAsyncComponent(modulesConent))
    }
    const requireModules = import.meta.glob('./components/generally/*.vue')
    for (const path in requireModules) {
      const result: Array<any> = path.match(/.*\/(.+).vue$/)!
      const modulesConent: any = requireModules[path]
      // console.log(modulesConent,result)
      app.component(result[1], defineAsyncComponent(modulesConent))
    }
    const specialModules = import.meta.glob('./components/special/*/*.vue')
    for (const path in specialModules) {
      const result: Array<any> = path.match(/.*\/(.+).vue$/)!
      const modulesConent: any = specialModules[path]
      app.component(result[1], defineAsyncComponent(modulesConent))
    }
  }
}
