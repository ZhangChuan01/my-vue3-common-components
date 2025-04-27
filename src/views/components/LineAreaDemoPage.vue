<script setup lang='ts'>
import testData2 from './testLineArea'

interface CoalData {
  x: number
  y: number
}
const generateFakeCoalData = async ():Promise<CoalData[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data: CoalData[] = []
      for (let x = 0; x <= 30; x++) {
        // 生成 0 到 30 之间的随机整数
        const y = Math.floor(Math.random() * 31) 
        data.push({ x, y })
      }
      resolve(data)
    }, 500)
  })
}

const getTestArea = async ():Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [
        {
          range: {
            start: 0,
            end: 100
          },
          data: [
            {
              name: '面积1',
              percentage: 0.3
            },
            {
              name: '面积2',
              percentage: 0.4
            },
            {
              name: '面积3',
              percentage: 0.3
            }
          ]
        },
        {
          range: {
            start: 100,
            end: 200
          },
          data: [
            {
              name: '面积4',
              percentage: 0.5
            },
            {
              name: '面积5',
              percentage: 0.3
            },
            {
              name: '面积6',
              percentage: 0.2
            }
          ]
        },
        {
          range: {
            start: 200,
            end: 290
          },
          data: [
            {
              name: '面积7',
              percentage: 0.4
            },
            {
              name: '面积8',
              percentage: 0.2
            },
            {
              name: '面积9',
              percentage: 0.4
            }
          ]
        }
      ]
      resolve(data)
    }, 500)
  })
}
let testData = ref<any>(),areaData = ref<any>()

onMounted(async () => {
  testData.value = await generateFakeCoalData()
  areaData.value = await getTestArea()
})
</script>

<template>
  <div class="coal-yard-parameter">
    <LineArea
      :max-x="290"
      :max-y="20"
      :line-data="testData2"
      :area-data="areaData"
    />
  </div>
</template>

