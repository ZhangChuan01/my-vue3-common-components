<script setup lang='ts'>

const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number): void
}>()

const props = defineProps<{
  modelValue: string
  filterObj: ComponentsProps.Date
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
  obj.placeholder = window.$utils.hasField(props.filterObj,'placeholder') ? props.filterObj.placeholder :  `请选择${props.filterObj.label || ''}`
  obj.clearable = window.$utils.hasField(props.filterObj,'clearable') ? props.filterObj.clearable : true
  return obj
}
</script>

<template>
  <el-cascader
    v-model="bindValue"
    v-bind="setPropData()"
    :placeholder="filterObj.placeholder"
  />
</template>

