<script setup lang='ts'>

const emits = defineEmits<{
  (e:'update:modelValue', modelValue: string | number | boolean): void
  (e:'updateModel', modelValue: {[key: string]: string | number | boolean}): void
  (e:'change', modelValue: string | number | boolean): void
}>()

const props = withDefaults(defineProps<{
  filterObj: ComponentsProps.Select
  modelValue: string | number | boolean
}>(), {
  modelValue: ''
})

const bindValue = computed({
  get: () => props.modelValue,
  set: val => {
    if (props.filterObj.handleChange) {
      props.filterObj.handleChange(val)
    }
    if(props.filterObj.codesMap){
      let obj = {}
      Object.entries(props.filterObj.codesMap).forEach(item => {
        obj[item[0]] = val[item[1]]
      })
      emits('updateModel', obj)
    }
    emits('update:modelValue', val)
    emits('change', val)
  }
})

const setPropData = () => {
  let obj:any = { ...props.filterObj }
  delete obj.value
  obj.placeholder = window.$utils.hasField(props.filterObj,'placeholder') ? props.filterObj.placeholder :  `请选择${props.filterObj.label || ''}`
  obj.clearable = window.$utils.hasField(props.filterObj,'clearable') ? props.filterObj.clearable : true
  if(props.filterObj.emptyIsValue){
    obj.emptyValues = [ null, undefined ]
    obj.valueOnClear = null
  }
  return obj
}

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
      :value="props.filterObj.valueKey ? item : props.filterObj.props ? item[props.filterObj.props!.value] : item.id"
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
