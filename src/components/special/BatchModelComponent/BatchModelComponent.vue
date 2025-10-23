<script lang='ts'>
type DataInfo = {
  batchNo: string
  percentage: number
  stackId: string
  color?: string
}
type Area = {
  range: {
    start: number
    end: number
  }
  data: DataInfo[]
}
interface Batch {
  z: number
  batchNo: string
  stackId: string
  color?: string
}
interface BatchData {
  x: number
  data: Batch[]
}
interface CoalInfo {
  isSurface: boolean
  weight: number
  ash: number
  moisture: number
  sulfur: number
  ashFusionPoint: number
  calorie: number
  volatile: number
}
</script>
<script setup lang='ts'>
import toolite from 'toolite'

const props = withDefaults(defineProps<{
  sectionName: string
  height?: number
  maxX: number
  splitX?: number
  maxY: number
  splitY?: number
  yScale?: number
  batchData: BatchData[]
  padding?: number
  minRange?: number
  rangeInfo?: CoalInfo[]
  pointInfo?: {
    batchNo: string
    coalTypeInfo: CoalInfo
    weight: number
  }
}>(), {
  height: 100,
  splitX: 10,
  splitY: 5,
  yScale: 1,
  padding: 30,
  minRange: 0,
  rangeInfo: () => [],
  pointInfo: undefined
})

const emits = defineEmits<{
  (e: 'clickArea', position: { x: number, y: number, stackId: string }): void
  (e: 'getRangeInfo', range: { start: number, end: number }): void
}>()

let lineData = ref<{ x: number, y: number }[]>([])
const xTicks = ref<number[]>([]), yTicks = ref<number[]>([])

const xWidth = props.splitX, yWidth = props.splitY
const setTicks = () => {
  for (let i = 0; i <= xWidth; i++) {
    const val = i === 0 ? 0 : i === xWidth ? props.maxX : Math.floor(i * (props.maxX / props.splitX))
    xTicks.value.push(val)

  }
  for (let i = 0; i <= yWidth; i++) {
    // console.log('props.maxY',i,yWidth)
    const val = i === 0 ? props.maxY : i === yWidth ? 0 : Math.floor((yWidth - i) * (props.maxY / props.splitY))
    yTicks.value.push(val)
  }
}
if (props.maxX > 0 && props.maxY > 0) {
  setTicks()
}

function rgb() {
  let r = Math.floor(Math.random() * 256)
  let g = Math.floor(Math.random() * 256)
  let b = Math.floor(Math.random() * 256)
  let rgb = 'rgb(' + r + ',' + g + ',' + b + ')'
  return rgb
}
let areaList = ref<Area[]>([]), mapColor: { [key: string]: string } = {},
  allBatchNo = ref<{ batchNo: string, color: string }[]>([])
const calculateArea = () => {
  // console.log('calculateArea', props.batchData)
  if (!props.batchData.length) return
  let batchNoList: { batchNo: string, color: string }[] = [], lineData2: { x: number, y: number }[] = []
  props.batchData.forEach(area => {
    let dataInfo: DataInfo[] = []
    area.data.forEach((item, index) => {
      if (!mapColor[item.batchNo] && item.batchNo) {
        mapColor[item.batchNo] = rgb()
        batchNoList.push({ batchNo: item.batchNo, color: mapColor[item.batchNo] })
      }
      if (index === 0) {
        lineData2.push({ x: area.x, y: item.z * props.yScale })
      }
      const info = {
        batchNo: item.batchNo,
        percentage: index === 0 ? 1 : item.z * props.yScale / props.maxY,
        color: item.color || mapColor[item.batchNo] || '#fff',
        stackId: item.stackId
      }
      dataInfo.push(info)
    })
    areaList.value.push({ range: { start: area.x, end: area.x + 1 }, data: dataInfo })
  })
  allBatchNo.value = batchNoList
  lineData.value = lineData2
  // console.log('areaList', areaList.value)
  // console.log('batchNoList', allBatchNo.value)
}

const getPolygon = () => {
  let str = ''
  lineData.value.forEach((item: any) => {
    str += (item.x / props.maxX * 100) + '%' + ' ' + ((1 - item.y / props.maxY) * 100) + '%' + ','
  })
  // console.log('getPolygon', str,str.split(','))
  return `polygon(${str}100% 100%,0 100%)`
}

const containerId = toolite.uuid(), containerWidth = ref(0)
let typeX = '', left1 = ref(props.padding), left2 = ref(props.padding), zIndex1 = ref(1), zIndex2 = ref(1)
const getWidth = () => {
  containerWidth.value = (document.getElementById(containerId) as HTMLElement)?.offsetWidth - props.padding * 2 || 0
  left2.value = containerWidth.value + props.padding
}
const getX = (left: number) => {
  return Math.round(((left - props.padding) / containerWidth.value) * props.maxX)
}
const getY = (top: number) => {
  return Math.round((props.height - top) / props.height * props.maxY)
}
const getRangeInfo = () => {
  console.log('getRangeInfo', getX(left1.value), getX(left2.value))
  const start = getX(left1.value), end = getX(left2.value)
  if (start === end) {
    toolite.message.error('请选择至少1米的范围')
  }
  emits('getRangeInfo', { start, end })
}
const handleMove = (e: MouseEvent) => {
  const center = document.getElementById(containerId)?.querySelector('.area-container') as HTMLElement
  let left = e.clientX - center.getBoundingClientRect().left
  if (left >= containerWidth.value + props.padding) {
    left = containerWidth.value + props.padding
  } else if (left <= props.padding) {
    left = props.padding
  }
  if (typeX === 'minX') {
    if (left >= left2.value - props.minRange) {
      left = left2.value - props.minRange
    }
    left1.value = left
    if (left1.value > (containerWidth.value + props.padding) / 2) {
      zIndex1.value = 2
      zIndex2.value = 1
    }
  } else {
    if (left <= left1.value + props.minRange) {
      left = left1.value + props.minRange
    }
    left2.value = left
    if (left2.value < (containerWidth.value + props.padding) / 2) {
      zIndex1.value = 1
      zIndex2.value = 2
    }
  }
  // console.log('left',left,target?.parentNode?.parentNode)
  // (target!.parentNode!.parentNode! as HTMLElement).style.left = `${left}px`
}
const moveLine = (e: MouseEvent, type: string) => {
  console.log('按下鼠标', e)
  typeX = type
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
const handleMouseUp = () => {
  console.log('松开鼠标')
  document.removeEventListener('mousemove', handleMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
watch([ () => props.maxX, () => props.maxY ], () => {
  setTicks()
})
watch(() => props.batchData, () => {
  // console.log('getAreaData', newV)
  calculateArea()
}, { immediate: true })

const visible = ref(false),triggerRef = ref()

// 创建一个隐藏的DOM元素作为虚拟锚点
const virtualElement = {
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    // 以下四个属性共同决定了这个“虚拟元素”在屏幕上的位置和大小
    // 它们构成一个非常扁平的矩形，从而让Popover紧贴鼠标点击处
    x: posX.value,
    y: posY.value,
    left: posX.value,
    top: posY.value,
    right: posX.value,
    bottom: posY.value
  })
}

// 使用ref记录鼠标点击位置
const posX = ref(0)
const posY = ref(0)

// 将虚拟锚点与我们的virtualElement绑定
triggerRef.value = virtualElement
let clickX = ref(0), clickY = ref(0),currentData = ref<DataInfo>()
// 点击事件处理函数
const handlePageClick = (event: MouseEvent, data: DataInfo) => {
  // 更新点击坐标
  posX.value = event.clientX - 12
  posY.value = event.clientY
  // 显示Popover
  visible.value = true
  const center = document.getElementById(containerId)?.querySelector('.area-container') as HTMLElement
  const left = event.clientX - center.getBoundingClientRect().left + props.padding
  clickX.value = getX(left)
  const top = event.clientY - center.getBoundingClientRect().top
  clickY.value = getY(top)
  currentData.value = data
  emits('clickArea',{ x: clickX.value,y: clickY.value,stackId: currentData.value.stackId })
}

// 点击页面其他区域关闭Popover
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.area')) {
    visible.value = false
  }
}

onMounted(() => {
  getWidth()
})
window.addEventListener('resize', getWidth)
window.addEventListener('click', handleClickOutside)
onBeforeUnmount(() => {
  window.removeEventListener('resize', getWidth)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    :id="containerId"
    class="batch-model"
  >
    <div class="section-name">
      {{ sectionName }}
    </div>
    <div class="legend">
      <div class="legend-data">
        <div
          v-for="item2 in allBatchNo"
          :key="item2.batchNo"
          class="legend-item"
        >
          <div
            class="icon"
            :style="{ backgroundColor: item2.color }"
          />
          <div class="item">
            {{ item2.batchNo }}
          </div>
        </div>
      </div>
    </div>
    <div class="range-info range-info-top">
      <div class="dfb">
        <div class="title">
          {{ getX(left1) }}m - {{ getX(left2) }}m (表面煤)
        </div>
        <el-button
          type="primary"
          @click="getRangeInfo"
        >
          更新数据
        </el-button>
      </div>
      <div class="info-wrapper">
        <div class="info">
          <div class="label">
            热值:
          </div>
          <div class="value">
            {{ props.rangeInfo[0]?.calorie ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            硫分:
          </div>
          <div class="value">
            {{ props.rangeInfo[0]?.sulfur ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            挥发:
          </div>
          <div class="value">
            {{ props.rangeInfo[0]?.volatile ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            灰熔点:
          </div>
          <div class="value">
            {{ props.rangeInfo[0]?.ashFusionPoint ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            煤量:
          </div>
          <div class="value">
            {{ props.rangeInfo[0]?.weight ?? '-' }} 吨
          </div>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <div class="x-axis dfb">
        <div
          v-for="(item, xIndex) in xTicks"
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
          v-for="(item, yIndex) in yTicks"
          :key="item"
          class="y-tick"
          :style="{ marginLeft: `${-padding}px` }"
        >
          <span>{{ item }}</span>
          <div
            v-if="yIndex !== 0"
            class="line"
            :style="{ width: containerWidth + 'px', bottom: height / yWidth + 'px' }"
          />
        </div>
      </div>
      <div
        class="area-container"
        :style="{ clipPath: getPolygon() }"
      >
        <div
          v-for="(item, index) in areaList"
          :key="index"
          class="area-wrapper"
          :style="{ height: '100%', left: item.range.start / props.maxX * 100 + '%', width: 100 * (item.range.end - item.range.start) / props.maxX + '%' }"
        >
          <template
            v-for="item2 in item.data"
            :key="item2.name"
          >
            <div
              class="area"
              :style="{ height: item2.percentage * 100 + '%', backgroundColor: item2.color }"
              @click="handlePageClick($event, item2)"
            />
          </template>
        </div>
      </div>
      <div
        class="line-start"
        :style="{ left: left1 + 'px', zIndex: zIndex1 }"
        @mousedown="moveLine($event, 'minX')"
      >
        <img
          src="../../../assets/move-start.png"
          alt=""
        >
        <!-- <SvgIcon
          icon="drag-x"
          :size="20"
        /> -->
      </div>
      <div
        class="line-end"
        :style="{ left: left2 + 'px', zIndex: zIndex2 }"
        @mousedown="moveLine($event, 'maxX')"
      >
        <img
          src="../../../assets/move-end.png"
          alt=""
        >
        <!-- <SvgIcon
          icon="drag-x"
          :size="20"
        /> -->
      </div>
    </div>
    <div class="range-info range-info-bottom">
      <div class="title">
        {{ getX(left1) }}m - {{ getX(left2) }}m (全部)
      </div>
      <div class="info-wrapper">
        <div class="info">
          <div class="label">
            热值:
          </div>
          <div class="value">
            {{ props.rangeInfo[1] ? props.rangeInfo[1].calorie : props.rangeInfo[0]?.calorie ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            硫分:
          </div>
          <div class="value">
            {{ props.rangeInfo[1] ? props.rangeInfo[1].sulfur : props.rangeInfo[0]?.sulfur ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            挥发:
          </div>
          <div class="value">
            {{ props.rangeInfo[1] ? props.rangeInfo[1].volatile : props.rangeInfo[0]?.volatile ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            灰熔点:
          </div>
          <div class="value">
            {{ props.rangeInfo[1] ? props.rangeInfo[1].ashFusionPoint : props.rangeInfo[0]?.ashFusionPoint ?? '-' }}
          </div>
        </div>
        <div class="info">
          <div class="label">
            煤量:
          </div>
          <div class="value">
            {{ props.rangeInfo[1] ? props.rangeInfo[1].weight : props.rangeInfo[0]?.weight ?? '-' }} 吨
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-popover
    :virtual-ref="triggerRef"
    virtual-triggering
    :visible="visible"
    placement="bottom-start"
    :title="`${clickX}, ${clickY}`"
    width="300"
    trigger="click"
    :popper-style="{fontWeight: 600}"
  >
    <div
      class="info-wrapper"
      style="flex-wrap: wrap;"
    >
      <div class="info info2">
        <div class="label">
          批次号:
        </div>
        <div class="value">
          {{ currentData?.batchNo || '' }}
        </div>
      </div>
      <div class="info info2">
        <div class="label">
          热值:
        </div>
        <div class="value">
          {{ pointInfo?.coalTypeInfo?.calorie ?? '-' }}
        </div>
      </div>
      <div class="info info2">
        <div class="label">
          硫分:
        </div>
        <div class="value">
          {{ pointInfo?.coalTypeInfo?.sulfur ?? '-' }}
        </div>
      </div>
      <div class="info info2">
        <div class="label">
          挥发:
        </div>
        <div class="value">
          {{ pointInfo?.coalTypeInfo?.volatile ?? '-' }}
        </div>
      </div>
      <div class="info info2">
        <div class="label">
          灰熔点:
        </div>
        <div class="value">
          {{ pointInfo?.coalTypeInfo?.ashFusionPoint ?? '-' }}
        </div>
      </div>
      <div class="info info2">
        <div class="label">
          煤量:
        </div>
        <div class="value">
          {{ pointInfo?.weight ?? '-' }} 吨
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang=scss>
.batch-model {
  margin-bottom: 10px;
  padding-top: 10px;
  border: 1px solid #4e5969;
  border-radius: 6px;
}
.section-name {
  margin-bottom: 10px;
  padding: 0 v-bind("`${padding}px`");
  font-weight: 600;
  font-size: 16px;
}
.legend {
  display: flex;
  margin-bottom: 10px;
  padding: 0 v-bind("`${padding}px`");
  .legend-data {
    display: flex;
    flex-wrap: wrap;
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
  height: v-bind("`${height}px`");
  .x-axis {
    position: absolute;
    bottom: 0;
    left: v-bind("`${padding}px`");
    width: calc(100% - v-bind("`${padding * 2}px`"));
    height: 1px;
    background-color: #ccc;
    .x-tick {
      position: relative;
      margin-top: 20px;
      span {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        user-select: none;
      }
    }
    .line {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 1px;
      height: v-bind("`${height}px`");
      background-color: red;
    }
  }
  .y-axis {
    position: absolute;
    left: v-bind("`${padding}px`");
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 1px;
    height: 100%;
    background-color: #ccc;
    .y-tick {
      position: relative;
      span {
        position: absolute;
        right: 5px;
        transform: translateY(-50%);
        user-select: none;
      }
    }
    .line {
      position: absolute;
      bottom: 20px;
      left: v-bind("`${padding}px`");
      height: 1px;
      background-color: red;
    }
  }
  .area-container {
    position: absolute;
    top: 0;
    left: v-bind("`${padding}px`");
    width: calc(100% - v-bind("`${padding * 2}px`"));
    height: 100%;
    .area-wrapper {
      position: absolute;
      bottom: 0;
      .area {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
  }
}
.line-start,
.line-end {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: v-bind("`${height + 40}px`");
  background-color: #1d41ff;
  img {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 90%);
    cursor: move;
  }
}
.line-start {
  z-index: 2;
  color: #00de0f;
}
.line-end {
  z-index: 1;
  color: #f00;
}
.range-info {
  box-sizing: border-box;
  margin: 0 v-bind("`${padding}px`");
  margin-bottom: 20px;
  padding: 10px;
  background: linear-gradient(180deg, #eef8ff 0%, rgb(255 255 255 / 80%) 100%);
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 6px;
  box-shadow: 0 4px 4px 0 rgb(29 78 202 / 10%);
  user-select: none;
  .title {
    margin-bottom: 10px;
    font-weight: 600;
  }
}
.info-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .info {
    display: flex;
    box-sizing: border-box;
    width: 20%;
    .label {
      margin-right: 10px;
      color: #4e5969;
    }
    .value {
      color: #1d41ff;
      font-weight: 600;
    }
  }
}
.info2 {
  .label {
    flex-shrink: 0;
    width: 50px;
  }

  width: 100% !important;
}
.range-info-bottom {
  margin-top: 70px;
}
:deep(.el-popover__title) {
  font-weight: 600 !important;
}
</style>
