import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

export default {
  install(app:App) {
    // 从全局属性中获取 components 插件的配置
    const componentsConfig = app.config.globalProperties.$componentsConfig
    console.log('componentsConfig', componentsConfig)
    const locale = componentsConfig?.locale || 'zh' // 默认值
    // 创建 i18n 实例并配置
    const i18nInstance = createI18n({
      locale,
      messages: { 
        zh,
        en
      }
    })

    app.use(i18nInstance)
  }
}
