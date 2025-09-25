<script setup lang='ts'>
import type { GlobalComponents } from 'vue';

const tabClick = (tab: any) => {
  console.log('tabClick', tab.paneName)
}
const myTab = ref<InstanceType<GlobalComponents['MyTab']>>()

onMounted(() => {
  console.log('myTab', myTab.value?.activeTab)
})
</script>

<template>
  <MyTab ref="myTab" :tabs="['测试1', '测试2']" :permissions="['AbpIdentity.Roles','AbpIdentity.Users']" @tab-click="tabClick" :type="'card'" :lazy="true">
    <template #测试1>
      <div>测试1</div>
    </template>
    <template #测试2>
      <div>测试2{{ console.log('myTabasdsad') }}</div>
    </template>
  </MyTab>
</template>

