<script setup lang='ts'>
import { Select } from './base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number | boolean): void
  (e:'updateModel', modelValue: {[key: string]: string | number | boolean}): void
  (e:'change', modelValue: string | number | boolean): void
}>()

const props = withDefaults(defineProps<{
  filterObj: Select
  modelValue: string | number | boolean | any
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
    emits('change', val)
    setCodesMap(val)
  }
})
watch(() => props.modelValue, () => {
  setCodesMap(props.modelValue)
})
const setPropData = () => {
  let obj:any = { ...props.filterObj }
  delete obj.value
  obj.placeholder = Object.hasOwnProperty.call(props.filterObj,'placeholder') ? props.filterObj.placeholder :  `${t('select')}${props.filterObj.label || ''}`
  obj.clearable = Object.hasOwnProperty.call(props.filterObj,'clearable') ? props.filterObj.clearable : true
  if(props.filterObj.emptyIsValue){
    obj.emptyValues = [ null, undefined ]
    obj.valueOnClear = null
  }
  return Object.assign(obj, useAttrs())
}
const setCodesMap = val => {
  if(!props.filterObj.codesMap) return
  let obj = {}
  const target = typeof val === 'object' ? val : props.filterObj.options.find(o => props.filterObj.props?.value ? o[props.filterObj.props.value] === val : o.id === val)
  if(!target) return
  Object.entries(props.filterObj.codesMap).forEach(item => {
    obj[item[0]] = target[item[1]]
  })
  emits('updateModel', obj)
}
onMounted(() => {
  if(props.modelValue) setCodesMap(props.modelValue)
})
</script>

<template>
  <el-select
    v-model="bindValue"
    v-bind="setPropData()"
  >
    <template
      v-if="props.filterObj.labelIsInner"
      #label="{ label }"
    >
      <span class="mylabel">{{ filterObj.label }}</span>
      <span>{{ label }}</span>
    </template>
    <template
      v-else-if="props.filterObj.customLabel"
      #label
    >
      <span>{{ props.filterObj.customLabel }}</span>
    </template>
    <el-option
      v-for="item in props.filterObj.options"
      :key="props.filterObj.props?.value ? item[props.filterObj.props.value] : item.id"
      :label="props.filterObj.props?.label ? item[props.filterObj.props.label] : item.name"
      :value="props.filterObj.valueKey ? item : props.filterObj.props && props.filterObj.props.value ? item[props.filterObj.props.value] : item.id"
    />
  </el-select>
</template>
<style lang="scss" scoped>
.mylabel {
  margin-right: 5px;
  padding-right: 5px;
  border-right: 1px solid #ccc;
}
</style>
