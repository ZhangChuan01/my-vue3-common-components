<script setup lang='ts'>
import { type Date } from './base'
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: any): void
}>()

const props = defineProps<{
  modelValue: any
  filterObj: Date
}>()

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
  obj.clearable = Object.hasOwnProperty.call(props.filterObj,'clearable') ? props.filterObj.clearable : true
  obj.valueFormat = Object.hasOwnProperty.call(props.filterObj,'valueFormat') ? props.filterObj.valueFormat : 'HH:mm:ss'
  return Object.assign(obj, useAttrs())
}
</script>

<template>
  <el-time-picker
    v-model="bindValue"
    v-bind="setPropData()"
    :placeholder="$t('selectTime')"
  />
</template>

