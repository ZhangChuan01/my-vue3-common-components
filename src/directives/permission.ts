import type { App, Directive } from 'vue'

export default function setupPermissionDirective(app: App) {
  function updateElVisible(el: HTMLElement, permission: string) {
    if (!permission) return
    const funListStr = localStorage.getItem('permissionNameList')
    if (funListStr) {
      const funList = JSON.parse(funListStr).map(item => item.name)
      if (!funList.includes(permission)) {
        el.parentElement?.removeChild(el)
      }
    }
  }

  const permissionDirective: Directive<HTMLElement> = {
    mounted(el, binding) {
      updateElVisible(el, binding.value)
    },
    beforeUpdate(el, binding) {
      updateElVisible(el, binding.value)
    }
  }

  app.directive('has', permissionDirective)
}
