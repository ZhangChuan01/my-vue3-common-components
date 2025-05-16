<script setup lang='ts'>
import { Cascader } from './base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number): void
}>()

const props = defineProps<{
  modelValue: any
  filterObj: Cascader
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

  obj.placeholder = Object.hasOwnProperty.call(props.filterObj,'placeholder') ? props.filterObj.placeholder :  `${t('select')}${props.filterObj.label || ''}`
  obj.clearable = Object.hasOwnProperty.call(props.filterObj,'clearable') ? props.filterObj.clearable : true
  return Object.assign(obj, useAttrs())
}
</script>

<template>
  <el-cascader
    v-model="bindValue"
    v-bind="setPropData()"
  />
</template>

