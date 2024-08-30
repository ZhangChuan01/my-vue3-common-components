/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  $message: any
  $router: any
  $uuid: any
  $utils: any
}

interface HttpResult {
  code: number,
  data: any,
  message: string
}