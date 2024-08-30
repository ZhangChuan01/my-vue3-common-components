<script setup lang='ts'>

const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number): void
}>()

const props = withDefaults(defineProps<{
  filterObj: ComponentsProps.ColorPicker
  modelValue: string | number
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
  }
})
const setPropData = () => {
  let obj:any = { ...props.filterObj }
  delete obj.value
  return obj
}
</script>

<template>
  <el-color-picker
    v-model="bindValue"
    v-bind="setPropData()"
  />
</template>

