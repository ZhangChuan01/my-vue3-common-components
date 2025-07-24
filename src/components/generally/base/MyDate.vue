<script setup lang='ts'>
import { type Date } from './base'

const emits = defineEmits<{
  (e:'update:modelValue', modelValue: any): void
}>()

const props = defineProps<{
  modelValue: any
  filterObj: Date
}>()

let limitTime = 0,pickDay = ref<any>(null)
const visibleChange = (visible: boolean) => {
  if(!visible) pickDay.value = null
}
const calendarChange = (val: Date[]) => {
  if(!props.filterObj.limitDay) return
  const [ pointDay ] = val
  pickDay.value = pointDay
}

const disabledDate = (time: Date) => {
  if (pickDay.value) {
    return (
      time.getTime() <= pickDay.value.getTime() - limitTime ||
      time.getTime() >= pickDay.value.getTime() + limitTime
    )
  } 
  return false
}

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
  if(props.filterObj.limitDay){
    limitTime = props.filterObj.limitDay * 1000 * 60 * 60 * 24
    obj.disabledDate = disabledDate
  }
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
    @calendar-change="calendarChange"
    @visible-change="visibleChange"
  />
</template>

