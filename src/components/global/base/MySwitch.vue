<script setup lang='ts'>
import { Switch } from './base'
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number): void
}>()

const props = withDefaults(defineProps<{
  filterObj: Switch
  modelValue: string | number
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
  <el-switch
    v-model="bindValue"
    v-bind="setPropData()"
  />
</template>

