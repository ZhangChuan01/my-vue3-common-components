<script setup lang='ts'>
import toolite from 'toolite'

// const batchDataArray = Array.from({ length: 280 }, (_, i) => {
//   const data = Array.from({ length: Math.floor(Math.random() * 2) + 2 }, (_, j) => {
//     return {
//       z: Math.floor(Math.random() * 21),
//       batchNo: `batchNo-${i}-${j}`
//     }
//   })
//   data.sort((a, b) => b.z - a.z)
//   return {
//     x: i,
//     data
//   }
// })
// console.log('batchDataArray', batchDataArray)
let testData = ref<any>([]),rangeInfo = ref<any>([])
fetch('http://192.168.8.181:44366/api/app/storageCoalInfo/storageSideViewPointListByShape?sectionCode=1').then(res => res.json()).then(res => {
  console.log('res', res)
  testData.value = res
})
const getRangeInfo = (data: any) => {
  console.log('getRangeInfo', data)
  fetch(`http://192.168.8.181:44366/api/app/storageCoalInfo/storageListByRange?sectionCode=1&minX=${data.start}&maxX=${data.end}`,{
    method: 'get'
  }).then(res => res.json()).then(res => {
    console.log('res', res)
    rangeInfo.value = res
    rangeInfo.value.forEach((item: any) => {
      item.weight = toolite.formatNumber(item.weight,0)
    })
  })
}
getRangeInfo({ start: 0, end: 280 })
let pointInfo = ref<any>()
const clickArea = (data: any) => {
  console.log('clickArea', data)
  fetch(`http://192.168.8.181:44366/api/app/storageCoalInfo/storageInfoByRange?x=${data.x}&y=${data.y}&stackId=${data.stackId}`,{
    method: 'get'
  }).then(res => res.json()).then(res => {
    pointInfo.value = Object.assign({}, res, { weight: toolite.formatNumber(res.weight,0) })
  })
}
</script>

<template>
  <BatchModelComponent
    :section-name="'煤场名称'"
    :max-x="280"
    :split-x="28"
    :max-y="22"
    :y-scale="0.01"
    :batch-data="testData"
    :range-info="rangeInfo"
    :point-info="pointInfo"
    @click-area="clickArea"
    @get-range-info="getRangeInfo"
  />
</template>

