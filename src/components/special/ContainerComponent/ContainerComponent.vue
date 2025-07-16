<script setup lang='ts'>
import toolite from 'toolite'
import { v4 as uuidv4 } from 'uuid'
import shrinkImg from './shrink.png'
const emits = defineEmits<{
  (e:'change', title: string): void
}>()
const props = withDefaults(defineProps<{
  titles: string[]
  width?: number | string
  height: number
  shrinkDirection?: string
  top?: number | undefined
  bottom?: number | undefined
  headerHeight?: number
  defaultShow?: boolean
}>(), {
  width: 380,
  shrinkDirection: 'left',
  top: undefined,
  bottom: undefined,
  headerHeight: 80,
  defaultShow: true
})
const id = uuidv4()
let currentTitle = ref(props.titles[0])
const changeTitle = (title: string) => {
  currentTitle.value = title
  emits('change', title)
}
let show = ref(true)
const shrinkContainer = (val?: boolean) => {
  // console.log('shrinkContainer',val)
  show.value = val === undefined ? !show.value : val
  const container = document.getElementById(id) as HTMLElement
  if(!container) return
  if (show.value) {
    if(props.shrinkDirection === 'left') {
      container.style.left = '0'
    }else {
      container.style.right = '0'
    }
  }else {
    if(props.shrinkDirection === 'left') {
      container.style.left = typeof props.width === 'number' ? -props.width + 'px' : '-' + props.width
    }else{
      container.style.right = typeof props.width === 'number' ? -props.width + 'px' : '-' + props.width
    }
  }
}
toolite.emitter.on('toggleShow',val => shrinkContainer(val))
onMounted(() => {
  if(!props.defaultShow) shrinkContainer(false)
})
onBeforeUnmount(() => {
  toolite.emitter.off('toggleShow')
})
defineExpose({
  shrinkContainer
})

</script>

<template>
  <div
    :id="id"
    :class="['container',shrinkDirection === 'left' ? 'shrink-left' : 'shrink-right']"
    :style="{width: typeof props.width === 'number' ? props.width + 'px' : props.width, 
    height: `calc((100vh - ${props.headerHeight}px) * ${props.height})`, 
    top: `calc((100vh - ${props.headerHeight}px) * ${props.top} + ${props.headerHeight}px)`,
    bottom: `calc((100vh - ${props.headerHeight}px) * ${props.bottom})`}"
  >
    <div class="title-container dfb">
      <div class="title-wrapper">
        <div
          v-for="(title,index) in titles"
          :key="title"
          :class="['title',{active: title === currentTitle}]"
          @click="changeTitle(title)"
        >
          <span class="title-text">{{ title }}</span>
          <slot :name="`title${index}`" />
        </div>
      </div>
      <slot
        name="title-right"
        :title="currentTitle"
      />
    </div>
    <div class="content">
      <slot :name="currentTitle" />
      <slot />
    </div>
    <div
      class="shrink"
      @click="shrinkContainer()"
    >
      <img
        :src="shrinkImg"
        alt=""
      >
    </div>
  </div>
</template>

<style scoped lang=scss>
.container {
  position: fixed;
  z-index: 999;
  background: rgb(0 0 0 / 50%);
  border: 1px solid rgb(64 140 255 / 20%);
  border-radius: 2px;
  transition: all 0.5s;
  .shrink {
    position: absolute;
    top: 30px;
    background: url("./shrink.png") center center no-repeat;
    cursor: pointer;
  }
}
.shrink-left {
  left: 0;
  .shrink {
    right: -40px;
  }
}
.shrink-right {
  right: 0;
  .shrink {
    left: -40px;
    transform: rotateZ(180deg);
  }
}
.title-container {
  height: 40px;
  padding-right: 16px;
  padding-left: 40px;
  overflow: hidden;
  line-height: 40px;
  background: url("./title-bg.png") center center no-repeat;
  background-size: 100% 100%;
  .title-wrapper {
    display: flex;
    .title {
      display: flex;
      align-items: center;
      margin-right: 32px;
      cursor: pointer;
      opacity: 0.3;
      .title-text {
        margin-right: 8px;
        font-weight: 600;
        font-size: 18px;
        font-style: normal;
        text-shadow: 1px 1px 0 rgb(0 0 0 / 20%);
        background: linear-gradient(90deg, #fff 0%, #d8ecfe 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .active {
      opacity: 1;
    }
  }
}
.content {
  height: calc(100% - 40px);
}
</style>
