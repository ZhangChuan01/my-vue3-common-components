<script setup lang='ts'>

const props = withDefaults(defineProps<{
  tabs: string[]
  permissions?: string[]
  lazy?: boolean
}>(), {
  lazy: true
})

let tabList = ref<string[]>([]),activeTab = ref('')
onMounted(() => {
  if(props.permissions) {
    const funListStr = localStorage.getItem('permissionNameList')
    if (funListStr) {
      const funList = JSON.parse(funListStr).map((item: any) => item.name)
      tabList.value = props.tabs.filter((_item: any,index: number) => funList.includes(props.permissions![index] ?? ''))
      activeTab.value = tabList.value[0]
      console.log('tabList.value',tabList.value)
      return
    }
  }
  tabList.value = props.tabs
  activeTab.value = props.tabs[0]
})

defineExpose({
  activeTab
})
</script>

<template>
  <el-tabs
    v-model="activeTab"
  >
    <el-tab-pane
      v-for="item in tabList"
      :key="item"
      :label="item"
      :name="item"
      :lazy="props.lazy"
    >
      <slot :name="item"></slot>
    </el-tab-pane>
  </el-tabs>
  <!-- <div v-has="'1'">tttt</div> -->
</template>

