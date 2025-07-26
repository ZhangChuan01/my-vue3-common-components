 
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<unknown, unknown, any>
  export default component
}
declare module 'virtual:svg-icons-register' {
  const content: string
  export default content
}
declare module 'mockjs';
declare module 'nprogress';
declare module 'reset-css';
declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'canvas-datagrid';
declare module '@cycjimmy/jsmpeg-player';
interface Window {
  $message: any
  $router: any
  $uuid: any
  $utils: any
  $t: any
}

interface HttpResult {
  code: number,
  data: any,
  message: string
}