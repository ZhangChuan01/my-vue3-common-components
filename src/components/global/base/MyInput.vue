<script setup lang='ts'>
import { Input } from './base'
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number): void
  (e:'change', modelValue: string | number): void
}>()

const props = withDefaults(defineProps<{
  filterObj: Input
  modelValue: string | number
}>(), {
  modelValue: ''
})

const getFinalVal = (val: string | number) => {
  let res = val
  if (props.filterObj.limitNumber || props.filterObj.limitIntNumber) {
    if(props.filterObj.limitNumber){
      res = res.toString().replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
    }
    if(props.filterObj.limitIntNumber){
      res = res.toString().replace(/\D/g, '')
    }
  }
  if(res.toString().length > 100 && props.filterObj.type !== 'textarea'){
    res = res.toString().slice(0, 100)
  }
  return res
}

const bindValue = computed({
  get: () => props.modelValue,
  set: val => {
    if (props.filterObj.handleChange) {
      props.filterObj.handleChange(getFinalVal(val),props.modelValue)
    }
    emits('update:modelValue', getFinalVal(val))
    emits('change', getFinalVal(val))
  }
})
const checkValue = () => {
  if (props.filterObj.max && Number(bindValue.value) > props.filterObj.max) {
    bindValue.value = props.filterObj.max
  } else if (props.filterObj.min && Number(bindValue.value) < props.filterObj.min) {
    bindValue.value = props.filterObj.min
  }
}
const setPropData = () => {
  let obj:any = { ...props.filterObj }
  delete obj.value
  obj.placeholder = window.$utils.hasField(props.filterObj,'placeholder') ? props.filterObj.placeholder :  `请输入${props.filterObj.label || ''}`
  obj.clearable = window.$utils.hasField(props.filterObj,'clearable') ? props.filterObj.clearable : true
  return obj
}

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

