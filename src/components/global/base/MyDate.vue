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
  obj.clearable = window.$utils.hasField(props.filterObj,'clearable') ? props.filterObj.clearable : true
  obj.valueFormat = window.$utils.hasField(props.filterObj,'valueFormat') ? props.filterObj.valueFormat : 'YYYY-MM-DD HH:mm:ss'
  return obj
}

</script>

<template>
  <el-date-picker
    v-model="bindValue"
    v-bind="setPropData()"
    placeholder="选择日期"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  />
</template>

