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
const setCodesMap = (val: any) => {
  if(!props.filterObj.codesMap) return
  let obj:any = {}
  if(props.filterObj.multiple){
    Object.keys(props.filterObj.codesMap).forEach((item: any) => {
      obj[item] = []
    })
    val.forEach((item: any) => {
      const target = props.filterObj.options.find(o => props.filterObj.props?.value ? o[props.filterObj.props.value] === item : o.id === item)
      // console.log('ttttttttt',target,obj)
      if(target) {
        Object.entries(props.filterObj.codesMap!).forEach((item: any) => {
          obj[item[0]].push(target[item[1]])
        })
      }
    })
  }else {
    const target = typeof val === 'object' ? val : props.filterObj.options.find(o => props.filterObj.props?.value ? o[props.filterObj.props.value] === val : o.id === val)
    if(!target) return
    Object.entries(props.filterObj.codesMap).forEach((item: any) => {
      obj[item[0]] = target[item[1]]
    })
  }
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
