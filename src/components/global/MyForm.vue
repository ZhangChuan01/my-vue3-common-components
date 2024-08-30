<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'

const props = withDefaults(defineProps<{
  formDataList: (ComponentsProps.Input | ComponentsProps.Select | ComponentsProps.Date | ComponentsProps.Switch | ComponentsProps.ColorPicker)[]
  rules?: FormRules | ''
  labelWidth?: string | number
}>(), {
  rules: '',
  labelWidth: 'auto'
})

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
    if (formData.type !== 'title'){
      obj[formData.code] = formData.value
    }
  })
  formModel.value = obj
  // console.log('formModel', formModel.value)
}
setModel()
const getValue = (code: string) => {
  return formModel.value[code]
}
const setValue = (data: {[key:string]: any}) => {
  Object.assign(formModel.value, data)
  console.log('setValue', formModel.value)
}
let modelParams = {}
const changeModel = (val: any) => {
  console.log('changeModel', val)
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
const submit = async () => {
  const valid = await checkRules()
  // console.log('valid', valid)
  if (valid) {
    const res = Object.assign(modelParams,formModel.value)
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
  <div class="form-wrapper">
    <el-form
      ref="ruleForm"
      :label-width="props.labelWidth"
      :rules="rules"
      :model="formModel"
    >
      <template
        v-for="formData in props.formDataList"
        :key="formData.type === 'title' ? formData.label : formData.code"
      >
        <el-form-item
          :label="formData.label"
          :prop="formData.type === 'title' ? formData.label : formData.code"
          :style="formData.style || ''"
          :class="{title: formData.type === 'title', myswitch: formData.type === 'switch'}"
        >
          <MyInput
            v-if="inputTypes.includes(formData.type)"
            v-model="formModel[formData.code]"
            :filter-obj="formData"
          />
          <MySelect
            v-else-if="formData.type === 'select'"
            v-model="formModel[formData.code]"
            :filter-obj="formData"
            @update-model="changeModel"
          />
          <MyTime
            v-else-if="formData.type === 'time'"
            v-model="formModel[formData.code]"
            :filter-obj="formData"
          />
          <MyDate
            v-else-if="dateTypes.includes(formData.type)"
            v-model="formModel[formData.code]"
            :filter-obj="formData"
          />
          <MySwitch
            v-else-if="formData.type === 'switch'"
            v-model="formModel[formData.code]"
            :filter-obj="formData"
          />
          <MyCascader
            v-else-if="formData.type === 'cascader'"
            v-model="formModel[formData.code]"
            :filter-obj="formData"
          />
          <MyColorPicker
            v-else-if="formData.type === 'color-picker'"
            v-model="formModel[formData.code]"
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form-item {
    flex-direction: column;
    width: calc(50% - 12px);
    margin-bottom: 24px;
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      justify-content: flex-start !important;
      font-weight: 600 !important;
    }
    .el-form-item__content {
      align-items: baseline !important;
      .el-input,
      .el-select {
        width: 100%;
      }
      .el-col {
        .el-form-item {
          width: 100%;
          margin-bottom: 0;
        }
      }
      .disabled-inp {
        width: 100%;
        height: 100%;
        padding: 0 15px;
        color: #a8abb2;
        background-color: #f5f7fa;
        border-radius: 4px;
        box-shadow: 0 0 0 1px #e4e7ed inset;
        cursor: no-drop;
      }
    }
    .el-input-group__prepend {
      width: 30%;
    }
  }
  .myswitch {
    flex-direction: row;
    width: 100%;
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
