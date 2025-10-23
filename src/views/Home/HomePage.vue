<script setup lang='ts'>
import GenerallyComponetDemoPage from '../components/GenerallyComponetDemoPage.vue'
import MyTabDemoPage from '../components/MyTabDemoPage.vue'
import PreviewFileDemoPage from '../components/PreviewFileDemoPage.vue'
import LineAreaDemoPage from '../components/LineAreaDemoPage.vue'
import NativeTableDemoPage from '../components/NativeTableDemoPage.vue'
import ContainerComponentDemoPage from '../components/ContainerComponentDemoPage.vue'
import VideoComponetDemoPage from '../components/VideoComponetDemoPage.vue'
import BatchModelDemoPage from '../components/BatchModelDemoPage.vue'
const activeName = ref('first')

</script>

<template>
  <el-tabs v-model="activeName">
    <el-tab-pane
      label="一般组件"
      name="first"
    />
    <el-tab-pane
      label="MyTab组件"
      name="second"
    />
    <el-tab-pane
      label="预览文件组件"
      name="third"
    />
    <el-tab-pane
      label="折线区域分布组件"
      name="fourth"
    />
    <el-tab-pane
      label="原生table"
      name="fifth"
    />
    <el-tab-pane
      label="容器组件"
      name="sixth"
    />
    <el-tab-pane
      label="视频组件"
      name="seventh"
    />
    <el-tab-pane
      label="批次模型"
      name="eight"
    />
  </el-tabs>
  <GenerallyComponetDemoPage v-if="activeName === 'first'" />
  <MyTabDemoPage v-else-if="activeName === 'second'" />
  <PreviewFileDemoPage v-else-if="activeName === 'third'" />
  <LineAreaDemoPage v-else-if="activeName === 'fourth'" />
  <NativeTableDemoPage v-else-if="activeName === 'fifth'" />
  <ContainerComponentDemoPage v-else-if="activeName === 'sixth'" />
  <VideoComponetDemoPage v-else-if="activeName === 'seventh'" />
  <BatchModelDemoPage v-else-if="activeName === 'eight'" />
</template>
