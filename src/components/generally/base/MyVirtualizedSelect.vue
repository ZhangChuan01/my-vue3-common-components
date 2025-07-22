<script setup lang='ts'>
import { type Select } from './base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits<{
  (e:'update:modelValue', modelValue: any): void
  (e:'updateModel', modelValue: any): void
  (e:'change', modelValue: any): void
}>()

const props = withDefaults(defineProps<{
  filterObj: Select
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
    emits('change', val)
    setCodesMap(val)
  }
})
console.log('props.filterObj',props.filterObj)
const setPropData = () => {
  let obj:any = { ...props.filterObj }
  delete obj.value
  console.log('obj',obj)
  obj.placeholder = Object.hasOwnProperty.call(props.filterObj,'placeholder') ? props.filterObj.placeholder :  `${t('select')}${props.filterObj.label || ''}`
  obj.clearable = Object.hasOwnProperty.call(props.filterObj,'clearable') ? props.filterObj.clearable : true
  if(props.filterObj.emptyIsValue){
    obj.emptyValues = [ null, undefined ]
    obj.valueOnClear = null
  }
  return Object.assign(obj, useAttrs())
}
const setCodesMap = (val: any) => {
  // console.log('aaaaaaaaaaaaa',props.filterObj)
  if(!props.filterObj.codesMap) return
  console.log('val',val)
  let obj:any = {}
  const key = props.filterObj.props?.value ? props.filterObj.props.value : 'id'
  const tartget = props.filterObj.options.find(o => o[key] === val[key])
  if(!tartget) return
  Object.entries(props.filterObj.codesMap).forEach(item => {
    obj[item[0]] = tartget[item[1]]
  })
  // console.log('oooooooooo',val,props.filterObj.codesMap,obj)
  emits('updateModel', obj)
}
onMounted(() => {
  if(props.modelValue) setCodesMap(props.modelValue)
})
</script>

<template>
  <el-select-v2
    v-model="bindValue"
    v-bind="setPropData()"
    :props="{
      label: props.filterObj.props && props.filterObj.props.label ? props.filterObj.props.label : 'name',
      value: props.filterObj.props && props.filterObj.props.value ? props.filterObj.props.value : 'id',
      options: props.filterObj.options || 'options',
      disabled: props.filterObj.disabled || 'disabled'
    }"
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
  </el-select-v2>
</template>
<style lang="scss" scoped>
.mylabel {
  margin-right: 5px;
  padding-right: 5px;
  border-right: 1px solid #ccc;
}
</style>
