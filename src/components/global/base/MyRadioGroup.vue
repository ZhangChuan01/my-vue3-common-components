<script setup lang='ts'>
import { CheckGroup } from './base'
import { v4 as uuidv4 } from 'uuid'
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string[] | number[]): void
}>()

const props = withDefaults(defineProps<{
  filterObj: CheckGroup
  modelValue: any
}>(), {
  modelValue: []
})

const bindValue = computed({
  get: () => props.modelValue,
  set: val => {
    if (props.filterObj.handleChange) {
      props.filterObj.handleChange(val)
    }
    emits('update:modelValue', val)
  }
})
const setPropData = () => {
  let obj:any = { ...props.filterObj }
  delete obj.value
  if(props.filterObj.props) {
    props.filterObj.options.forEach(item => {
      item.label = item[props.filterObj.props!.label]
      item.value = item[props.filterObj.props!.value]
    })
  }
  return Object.assign(obj, useAttrs())
}
const domId = uuidv4()

onMounted(() => {
  if (props.filterObj.circleIcon) {
    document.getElementById(domId)?.querySelectorAll('.el-checkbox__inner').forEach((item: any) => {
      item.style.borderRadius = '50%'
    })
  }
})
</script>

<template>
  <el-radio-group
    v-bind="setPropData()"
    :id="domId"
    v-model="bindValue"
  >
    <el-radio
      v-for="item in props.filterObj.options"
      v-bind="item"
      :key="item.value"
    >
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>
