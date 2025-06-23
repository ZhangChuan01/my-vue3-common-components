<script setup lang='ts'>
type DataInfo = {
    name: string
    percentage: number
    color?: string
  }
type Area = {
  range: {
    start: number
    end: number
  }
  data: DataInfo[]
}
type Areas = {
  maxY: number
  area: Area
}
const props = withDefaults(defineProps<{
  height?: string
  maxX: number
  splitX?: number
  maxY: number
  splitY?: number
  lineData: {x: number, y: number}[] | undefined
  areaData: Area[]
  tooltip?: {
    show?: boolean
    formatter?: (params: DataInfo) => string
  }
}>(),{
  height: '100px',
  lineData: undefined,
  splitX: 10,
  splitY: 5,
  tooltip: () => ({
    show: true
  })
})

const xTicks = ref<number[]>([]),yTicks = ref<number[]>([])

const xWidth = Math.ceil(props.maxX / props.splitX),yWidth = Math.ceil(props.maxY / props.splitY)
const setTicks = () => {
  for(let i = 0;i <= xWidth;i++){
    xTicks.value.push(i * props.splitX)
  }
  for(let i = 0;i <= yWidth;i++){
    yTicks.value.push((yWidth - i) * props.splitY)
  }
}
if(props.maxX > 0 && props.maxY > 0){
  setTicks()
}

function rgb(){
  let r = Math.floor(Math.random() * 256)
  let g = Math.floor(Math.random() * 256)
  let b = Math.floor(Math.random() * 256)
  let rgb = 'rgb(' + r + ',' + g + ',' + b + ')'
  return rgb
}
let areaList = ref<Areas[]>([])
const calculateArea = () => {
  if(!props.areaData.length) return
  props.areaData.forEach(area => {
    const data = props.lineData?.slice(area.range.start,area.range.end)
    const maxY = Math.max(...data!.map(item => item.y))
    let dataInfo: DataInfo[] = []
    area.data.forEach((item,index) => {
      const info = {
        name: item.name || `面积${index}${area.range.start}-${area.range.end}}`,
        percentage: item.percentage,
        color: item.color || rgb()
      }
      dataInfo.push(info)
    })
    areaList.value.push({ maxY, area: { range: area.range,data: dataInfo } })
  })
  console.log('areaList', areaList.value)
}

const getPolygon = () => {
  let str = ''
  props.lineData?.forEach((item:any) => {
    str += (item.x / props.maxX * 100) + '%' + ' ' + ((1 - item.y / props.maxY) * 100) + '%' + ','
  })
  // console.log('getPolygon', str,str.split(','))
  return `polygon(${str}100% 100%,0 100%)`
}

const containerWidth = ref(0)
const getWidth = () => {
  containerWidth.value = (document.querySelector('.area-chart') as HTMLElement)?.offsetWidth - 40 || 0
}
watch([ () => props.maxX,() => props.maxY ], () => {
  setTicks()
})
watch(() => props.areaData, () => {
  // console.log('getAreaData', newV)
  calculateArea()
})
const setTooltip = () => {
  const tooltip = document.createElement('div')
  tooltip.className = 'custom-tooltip'
  tooltip.style.position = 'absolute'
  tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  tooltip.style.color = '#fff'
  tooltip.style.borderRadius = '4px'
  tooltip.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)'
  tooltip.style.lineHeight = '20px'
  tooltip.style.padding = '6px'
  tooltip.style.display = 'none'
  tooltip.style.fontSize = '12px'

  document.body.appendChild(tooltip)
}
const showTooltip = (_e: MouseEvent,item: DataInfo) => {
  if(props.tooltip?.show === false) return
  // console.log('mouseover', e)
  const tooltip = document.querySelector('.custom-tooltip') as HTMLElement
  let content = item.name
  if(props.tooltip?.formatter){
    content = props.tooltip.formatter(item)
  }
  // 设置提示内容和样式
  tooltip.innerHTML = content.replace(/hh/g, '<br>')
  tooltip.style.display = 'block'
}
const moveEvent = (e: MouseEvent) => {
  const tooltip = document.querySelector('.custom-tooltip') as HTMLElement
  // 更新位置（带10px偏移）
  tooltip.style.left = `${e.clientX + 10}px`
  tooltip.style.top = `${e.clientY + 10}px`
}
const mouseOut = () => {
  const tooltip = document.querySelector('.custom-tooltip') as HTMLElement
  tooltip.style.display = 'none'
}
onMounted(() => {
  getWidth()
  setTooltip()
})
window.addEventListener('resize', getWidth)
onBeforeUnmount(() => {
  window.removeEventListener('resize', getWidth)
})
</script>

<template>
  <div class="area-chart">
    <div class="legend">
      <div
        v-for="(item,index) in areaList"
        :key="index"
        class="legend-data"
      >
        <div
          v-for="item2 in item.area.data"
          :key="item2.name"
          class="legend-item"
        >
          <div
            class="icon"
            :style="{backgroundColor: item2.color}"
          />
          <div class="item">
            {{ item2.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <div class="x-axis dfb">
        <div
          v-for="(item,xIndex) in xTicks"
          :key="item"
          class="x-tick"
        >
          <span>{{ item }}</span>
          <div
            v-if="xIndex !== 0"
            class="line"
          />
        </div>
      </div>
      <div class="y-axis">
        <div
          v-for="(item,yIndex) in yTicks"
          :key="item"
          class="y-tick"
        >
          <span>{{ item }}</span>
          <div
            v-if="yIndex !== 0"
            class="line"
            :style="{width: containerWidth + 'px',bottom: parseInt(props.height) / yWidth + 'px'}"
          />
        </div>
      </div>
      <div
        class="area-container"
        :style="{clipPath: getPolygon()}"
      >
        <div
          v-for="(item,index) in areaList"
          :key="index"
          class="area-wrapper"
          :style="{height: item.maxY / props.maxY * 100 + '%',left: item.area.range.start / props.maxX * 100 + '%',width: 100 * (item.area.range.end - item.area.range.start) / props.maxX + '%'}"
        >
          <template
            v-for="item2 in item.area.data"
            :key="item2.name"
          >
            <div
              class="area"
              :style="{height: item2.percentage * 100 * item.maxY + 'px',backgroundColor: item2.color}"
              @mouseover="showTooltip($event,item2)"
              @mouseout="mouseOut"
              @mousemove="moveEvent"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang=scss>
.area-chart {
  padding: 20px;
  padding-bottom: 40px;
}
.legend {
  display: flex;
  margin-bottom: 20px;
  padding-left: 20px;
  .legend-data {
    display: flex;
    align-items: center;
  }
  .legend-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .icon {
    width: 30px;
    height: 14px;
    margin-right: 6px;
    border-radius: 2px;
  }
}
.chart-container {
  position: relative;
  width: 100%;
  height: v-bind("height");
  .x-axis {
    position: absolute;
    bottom: 0;
    left: 20px;
    width: calc(100% - 40px);
    height: 1px;
    background-color: #ccc;
    .x-tick {
      position: relative;
      margin-top: 20px;
      span {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .line {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 1px;
      height: v-bind("height");
      background-color: red;
    }
  }
  .y-axis {
    position: absolute;
    left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 1px;
    height: 100%;
    background-color: #ccc;
    .y-tick {
      position: relative;
      margin-left: -20px;
      span {
        position: absolute;
        transform: translateY(-50%);
      }
    }
    .line {
      position: absolute;
      bottom: 20px;
      left: 20px;
      height: 1px;
      background-color: red;
    }
  }
  .area-container {
    position: absolute;
    top: 0;
    left: 20px;
    width: calc(100% - 40px);
    height: 100%;
    .area-wrapper {
      position: absolute;
      bottom: 0;
      display: flex;
      flex-direction: column;
      .area {
        position: relative;
        width: 100%;
      }
    }
  }
}
</style>
