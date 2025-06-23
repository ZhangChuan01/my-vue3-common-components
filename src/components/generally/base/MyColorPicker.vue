<script setup lang='ts'>
import { type ColorPicker } from './base'
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number): void
}>()

const props = withDefaults(defineProps<{
  filterObj: ColorPicker
  modelValue: any
}>(), {
  modelValue: ''
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
  return Object.assign(obj, useAttrs())
}
</script>

<template>
  <el-color-picker
    v-model="bindValue"
    v-bind="setPropData()"
  />
</template>

