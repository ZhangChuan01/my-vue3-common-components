<script setup lang='ts'>
import { type Input } from './base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: any): void
  (e:'change', modelValue: any): void
}>()

const props = withDefaults(defineProps<{
  filterObj: Input
  modelValue: any
}>(), {
  modelValue: ''
})

const getFinalVal = (val: string | number) => {
  let res = val
  // console.log('filterObj',props.filterObj)
  if(props.filterObj.reg){
    res = res.toString().replace(props.filterObj.reg, '')
  }
  if (props.filterObj.limitNumber || props.filterObj.limitIntNumber) {
    res = res.toString().replace(/[^0-9.-]+/g, '')
    if(props.filterObj.allowNegativeNumber){
      if(res.lastIndexOf('-') > 0){
        res = res.replace(/-/g,'')
        res = '-' + res
      }
    }else{
      res = res.replace(/-/g,'')
    }
    if(props.filterObj.limitNumber){
      let parts = res.split('.')
      if (parts.length > 2) {
        res = parts[0] + '.' + parts[1] // 只保留第一个小数点
      }
      if (parts.length > 1) {
        res = parts[0] + '.' + parts[1].slice(0, props.filterObj.precision ?? 2) // 限制小数部分
      }
    }
    if(props.filterObj.limitIntNumber){
      const pointIndex = res.indexOf('.')
      if (pointIndex !== -1) {
        res = res.slice(0, pointIndex)
      }
    }
  }
  if(res.toString().length > 100 && props.filterObj.type !== 'textarea'){
    res = res.toString().slice(0, 100)
  }
  if(props.filterObj.type !== 'textarea'){
    res = res.toString().replace(/\s*/g,'')
  }
  // console.log('res',res)
  return res
}

const bindValue = computed({
  get: () => props.modelValue,
  set: val => {
    // console.log('val',val)
    if (props.filterObj.handleChange) {
      props.filterObj.handleChange(getFinalVal(val),props.modelValue)
    }
    emits('update:modelValue', getFinalVal(val))
    emits('change', getFinalVal(val))
  }
})
const checkValue = () => {
  if(bindValue.value === null || bindValue.value === undefined) return
  if(bindValue.value === '-'){
    bindValue.value = ''
  }
  if(bindValue.value === '') return
  if ((props.filterObj.max !== null && props.filterObj.max !== undefined) && Number(bindValue.value) > props.filterObj.max) {
    bindValue.value = props.filterObj.max
  } else if ((props.filterObj.min !== null && props.filterObj.min !== undefined) && Number(bindValue.value) < props.filterObj.min) {
    bindValue.value = props.filterObj.min
  }
}
const setPropData = () => {
  let obj:any = { ...props.filterObj }
  delete obj.value
  obj.placeholder = Object.hasOwnProperty.call(props.filterObj,'placeholder') ? props.filterObj.placeholder :  `${t('enter')}${props.filterObj.label || ''}`
  obj.clearable = Object.hasOwnProperty.call(props.filterObj,'clearable') ? props.filterObj.clearable : true
  return Object.assign(obj, useAttrs())
}
onMounted(() => {
  if(props.filterObj.value){
    bindValue.value = getFinalVal(props.filterObj.value)
  }
})
</script>

<template>
  <el-input
    v-model="bindValue"
    v-bind="setPropData()"
    @blur="checkValue"
  >
    <template
      v-if="filterObj.labelIsInner"
      #prepend
    >
      {{ filterObj.label }}
    </template>
  </el-input>
</template>

