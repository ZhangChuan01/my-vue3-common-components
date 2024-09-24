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
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import './mock'

// 全局组件
import components from '@/components/global/index'

import App from './App.vue'

window.$message = ElMessage
window.$router = router
window.$uuid = uuidv4

const app = createApp(App)

setupDirectives(app)
app
  .use(router)
  .use(store)
  .use(ElementPlus, { locale: zhCn })
  .use(components,{ formCol: 1,formLabelPosition: 'right' })
  .mount('#app')
