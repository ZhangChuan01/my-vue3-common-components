<script setup lang='ts'>
const titleChange = (title: string) => {
  console.log('title', title)
}
</script>

<template>
  <ContainerComponent
    :titles="['测试1', '测试2']"
    :height="0.3"
    :top="0.3"
    shrink-direction="right"
    @change="titleChange"
  >
    <template #测试1>
      <div>测试1内容测试1内容测试1内容测试1内容测试1内容测试1内容测试1内容</div>
    </template>
    <template #测试2>
      <div>测试2内容测试2内容测试2内容测试2内容测试2内容测试2内容测试2内容</div>
    </template>
  </ContainerComponent>
</template>

