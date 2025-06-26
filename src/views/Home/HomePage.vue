<script setup lang='ts'>
import GenerallyComponetDemoPage from '../components/GenerallyComponetDemoPage.vue'
import PreviewFileDemoPage from '../components/PreviewFileDemoPage.vue'
import LineAreaDemoPage from '../components/LineAreaDemoPage.vue'
import NativeTableDemoPage from '../components/NativeTableDemoPage.vue'
import ContainerComponentDemoPage from '../components/ContainerComponentDemoPage.vue'
const activeName = ref('first')

</script>

<template>
  <el-tabs v-model="activeName">
    <el-tab-pane
      label="一般组件"
      name="first"
    >
      <GenerallyComponetDemoPage />
    </el-tab-pane>
    <el-tab-pane
      label="预览文件组件"
      name="second"
    >
      <PreviewFileDemoPage />
    </el-tab-pane>
    <el-tab-pane
      label="折线区域分布组件"
      name="third"
    >
      <LineAreaDemoPage />
    </el-tab-pane>
    <el-tab-pane
      label="原生table"
      name="fourth"
    >
      <NativeTableDemoPage />
    </el-tab-pane>
    <el-tab-pane
      label="容器组件"
      name="fifth"
    >
      <ContainerComponentDemoPage />
    </el-tab-pane>
  </el-tabs>
</template>
