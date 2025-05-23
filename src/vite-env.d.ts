/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'canvas-datagrid';
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