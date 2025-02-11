<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { Input, Select, Date,Switch,ColorPicker,Cascader } from './base/base'
import { InitConfig } from '../../index'

const props = withDefaults(defineProps<{
  formDataList: (Input | Select | Date | Switch | ColorPicker | Cascader)[]
  rules?: FormRules | ''
  labelWidth?: string | number
  col?: number | undefined
  labelPosition?: string | undefined
}>(), {
  rules: '',
  labelWidth: 'auto',
  col: undefined,
  labelPosition: undefined
})
const initConfig: InitConfig | undefined = inject('initConfig')

const col = props.col || initConfig?.formCol || 2
const labelPosition = props.labelPosition || initConfig?.formLabelPosition || 'top'

const emits = defineEmits<{
  (e: 'submit', filter: any ): void
}>()

const inputTypes = [ 'text', 'number', 'password', 'textarea' ]
const dateTypes = [ 'year', 'month', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange' ]
const ruleForm = ref<FormInstance>()
const formModel = ref<any>({})
const setModel = () => {
  let obj:{[key: string]: any} = {}
  props.formDataList.forEach(formData => {
    if (formData.type !== 'title' && formData.code){
      obj[formData.code] = formData.value === undefined ? '' : formData.value
    }
  })
  formModel.value = obj
  // console.log('formModel', formModel.value)
}
setModel()
const getValue = (code?: string) => {
  return code ? formModel.value[code] : formModel.value
}
const setValue = (data: {[key:string]: any}) => {
  Object.assign(formModel.value, data)
  // console.log('setValue', formModel.value)
}
let modelParams = {}
const changeModel = (val: any) => {
  // console.log('changeModel', val)
  modelParams = val
}
const checkRules = () => {
  return new Promise(reslove => {
    if (props.rules) {
      ruleForm.value?.validate(valid => {
        if (valid) {
          reslove(true)
        } else {
          reslove(false)
        }
      })
    } else {
      reslove(true)
    }
  })
}
const deleteEmptyValue = (obj: {[key: string]: any}) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === '') {
      delete obj[key]
    }
  })
  return obj
}
const submit = async () => {
  const valid = await checkRules()
  // console.log('valid', valid)
  if (valid) {
    const res = deleteEmptyValue(JSON.parse(JSON.stringify(Object.assign(modelParams,formModel.value))))
    console.log('ressssssssss', res)
    emits('submit', res)
    return res
  }
  return null
}

const reset = () => {
  ruleForm.value?.clearValidate()
  ruleForm.value?.resetFields()
}

defineExpose({
  submit,
  reset,
  setValue,
  getValue
})
</script>

<template>
  <div :class="['form-wrapper',{col2: col === 2}]">
    <el-form
      ref="ruleForm"
      :label-width="props.labelWidth"
      :label-position="labelPosition"
      :rules="rules"
      :model="formModel"
      v-bind="$attrs"
    >
      <template
        v-for="formData in props.formDataList"
        :key="formData.type === 'title' ? formData.label : formData.code"
      >
        <el-form-item
          v-if="formData.type"
          :label="formData.label"
          :prop="formData.type === 'title' ? formData.label : formData.code"
          :style="formData.style || ''"
          :class="{title: formData.type === 'title', myswitch: formData.type === 'switch'}"
        >
          <MyInput
            v-if="inputTypes.includes(formData.type)"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="formData"
          />
          <MySelect
            v-else-if="formData.type === 'select'"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="(formData as Select)"
            @update-model="changeModel"
          />
          <MyVirtualizedSelect
            v-else-if="formData.type === 'virtualizedSelect'"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="(formData as Select)"
            @update-model="changeModel"
          />
          <MyTime
            v-else-if="formData.type === 'time'"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="formData"
          />
          <MyDate
            v-else-if="dateTypes.includes(formData.type)"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="formData"
          />
          <MySwitch
            v-else-if="formData.type === 'switch'"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="formData"
          />
          <MyCascader
            v-else-if="formData.type === 'cascader'"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="formData"
          />
          <MyColorPicker
            v-else-if="formData.type === 'color-picker'"
            v-model="formModel[(formData.code as string)]"
            :filter-obj="formData"
          />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<style scoped lang=scss>
.form-wrapper {
  height: 100%;

  // padding: 10px 20px;
  overflow: auto;
}
:deep(.el-form) {
  .myswitch {
    flex-direction: row;
    width: 100%;
  }
}
.col2 {
  :deep(.el-form) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item__label {
      display: inline-block;
    }
    .el-form-item {
      width: calc(50% - 12px);
      margin-bottom: 24px;

      // overflow: hidden;
    }
    .el-form-item__content {
      align-items: baseline !important;
    }
  }
}
.title {
  :deep(.el-form-item__label) {
    color: #262626 !important;
    font-weight: 600;
    font-size: 18px !important;
  }
}
</style>
