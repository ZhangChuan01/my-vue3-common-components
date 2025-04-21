import { createApp } from 'vue'
import router from './router'
import { store } from './store'
import { setupDirectives } from './directives'
import 'virtual:svg-icons-register'
import { v4 as uuidv4 } from 'uuid'
// import * as utils from './utils'
import 'reset-css'
import '@/styles/index.scss'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import './mock'
import i18n from './locals'

// 全局组件
import components from '@/index'

import App from './App.vue'

window.$message = ElMessage
window.$router = router
window.$uuid = uuidv4

const app = createApp(App)

setupDirectives(app)
app
  .use(router)
  .use(store)
  .use(ElementPlus, { locale: en })
  .use(components,{ formCol: 1,formLabelPosition: 'right',locale: 'zh' })
  .use(i18n)
  .mount('#app')
