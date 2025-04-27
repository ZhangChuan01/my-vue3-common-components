<script setup lang='ts'>
import { Date } from './base'
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number): void
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
  obj.valueFormat = Object.hasOwnProperty.call(props.filterObj,'valueFormat') ? props.filterObj.valueFormat : 'YYYY-MM-DD HH:mm:ss'
  return Object.assign(obj, useAttrs())
}

</script>

<template>
  <el-date-picker
    v-model="bindValue"
    v-bind="setPropData()"
    :placeholder="$t('selectDate')"
    :start-placeholder="$t('startTime')"
    :end-placeholder="$t('endTime')"
  />
</template>

