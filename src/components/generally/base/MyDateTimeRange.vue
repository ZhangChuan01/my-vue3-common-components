<script setup lang='ts'>
import toolite from 'toolite'
import { type Date } from './base'

const emits = defineEmits<{
  (e:'update:modelValue', modelValue: any): void
}>()

const props = defineProps<{
  modelValue: any
  filterObj: Date
}>()
let startDate = ref(''),startTime = ref(''),endDate = ref(''),endTime = ref('')
const bindValue = computed({
  get: () => props.modelValue,
  set: val => {
    if (props.filterObj.handleChange) {
      props.filterObj.handleChange(val)
    }
    emits('update:modelValue', val)
  }
})
const checkValue = (val: any) => {
  return val === '' || val === null
}
const valChange = () => {
  if(checkValue(startDate.value) && checkValue(startTime.value) && checkValue(endDate.value) && checkValue(endTime.value)) {
    bindValue.value = []
  }else{
    bindValue.value = [ `${startDate.value} ${startTime.value}`,`${endDate.value} ${endTime.value}` ]
  }
}
onMounted(() => {
  if(props.modelValue){
    startDate.value = toolite.dateFormat({ date: props.modelValue[0],type: 'YYYY-MM-DD' })
    startTime.value = toolite.dateFormat({ date: props.modelValue[0],type: 'HH:mm:ss' })
    endDate.value = toolite.dateFormat({ date: props.modelValue[1],type: 'YYYY-MM-DD' })
    endTime.value = toolite.dateFormat({ date: props.modelValue[1],type: 'HH:mm:ss' })
  }
})
watch(() => props.modelValue, () => {
  if(!props.modelValue){
    startDate.value = ''
    startTime.value = ''
    endDate.value = ''
    endTime.value = ''
  }
})
</script>

<template>
  <el-date-picker
    v-model="startDate"
    :placeholder="$t('selectDate')"
    :start-placeholder="$t('startTime')"
    :end-placeholder="$t('endTime')"
    :clearable="props.filterObj.clearable ?? true"
    value-format="YYYY-MM-DD"
    style="width: 130px;"
    @change="valChange"
  />
  <el-time-picker
    v-model="startTime"
    :placeholder="$t('selectTime')"
    :clearable="props.filterObj.clearable ?? true"
    value-format="HH:mm:ss"
    style="width: 120px;"
    @change="valChange"
  />
  <span style="margin: 0 5px;">至</span>
  <el-date-picker
    v-model="endDate"
    :placeholder="$t('selectDate')"
    :start-placeholder="$t('startTime')"
    :end-placeholder="$t('endTime')"
    :clearable="props.filterObj.clearable ?? true"
    value-format="YYYY-MM-DD"
    style="width: 130px;"
    @change="valChange"
  />
  <el-time-picker
    v-model="endTime"
    :placeholder="$t('selectTime')"
    :clearable="props.filterObj.clearable ?? true"
    value-format="HH:mm:ss"
    style="width: 120px;"
    @change="valChange"
  />
</template>
