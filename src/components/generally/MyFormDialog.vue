<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang='ts'>
import { v4 as uuidv4 } from 'uuid'
import type { FormRules } from 'element-plus'
import { GlobalComponents } from 'vue'
import { Input, Select, Date,Switch,ColorPicker,Cascader } from './base/base'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits<{
  (e:'update:dialogVisible', dialogVisible: boolean): void
  (e: 'cancel'): void
  (e: 'success',formRes: any): void
  (e: 'close'): void
  (e: 'submit', filter: {[key: string]: unknown} | null): void
}>()
const props = withDefaults(defineProps<{
  title?: string
  operate?: string
  formDataList: (Input | Select | Date | Switch | ColorPicker | Cascader)[]
  rules?: FormRules | undefined
  width?: string | number
  labelWidth?: string | number
  formHeight?: string | number
  addFun?: (data: any,...args: any) => Promise<any> | undefined
  editFun?: (data: any,...args: any) => Promise<any> | undefined
  operateFun?: (data: any,...args: any) => Promise<any> | undefined
  funArgs?: Array<any>
  funArgsAdd?: Array<any>
  funArgsEdit?: Array<any>
  dialogVisible?: boolean
  currentRowValue?: any
  fixedParams?: {[key: string]: any} | undefined
  beforeSubmit?: (() => boolean)| null
  handleField?: ((res: any) => void ) | null
  labelPosition?: string | undefined
  col?: number | undefined
}>(), {
  title: '',
  operate: 'add',
  addFun: undefined,
  editFun: undefined,
  operateFun: undefined,
  funArgs: undefined,
  funArgsAdd: undefined,
  funArgsEdit: undefined,
  rules: undefined,
  width: '700px',
  labelWidth: 'auto',
  formHeight: '',
  dialogVisible: false,
  currentRowValue: {},
  fixedParams: undefined,
  beforeSubmit: null,
  handleField: null,
  col: undefined,
  labelPosition: undefined
})
const dialogShow = computed({
  get: () => props.dialogVisible,
  set: val => emits('update:dialogVisible', val)
})
const myDialogForm = ref<GlobalComponents['MyForm'] | null>(null)
const cancel = () => {
  dialogShow.value = false
  // myDialogForm.value?.reset()
  emits('cancel')
}
const formSubmit = async () => {
  if(props.beforeSubmit){
    const valid = props.beforeSubmit()
    if(!valid) return
  }
  const formRes = await myDialogForm.value?.submit()
  // console.log('valid1111', formRes)
  let res:any
  
  if (formRes && formRes !== true) {
    if(props.handleField){
      props.handleField(formRes)
    }
    
    let finallyParams = props.fixedParams ? Object.assign({}, props.fixedParams, formRes) : formRes
    // console.log('finallyParams', finallyParams,props.operate,props.addFun)
    if (props.operate === 'add' && props.addFun) {
      const finaFunArgs:any = []
      if (props.funArgsAdd) {
        finaFunArgs.push(...props.funArgsAdd)
      }else {
        if(props.funArgs){
          finaFunArgs.push(...props.funArgs)
        }
      }
      res = finaFunArgs.length ? await props.addFun(finallyParams,...finaFunArgs) : await props.addFun(finallyParams)
    } else if (props.operate === 'edit' && props.editFun) {
      const finaFunArgs:any = []
      if (props.funArgsEdit) {
        finaFunArgs.push(...props.funArgsEdit)
      }else{
        if(props.funArgs){
          finaFunArgs.push(...props.funArgs)
        }
      }
      // console.log('edit', finaFunArgs)
      res = finaFunArgs.length ? await props.editFun(Object.assign({}, props.currentRowValue, finallyParams),...finaFunArgs) : await props.editFun(Object.assign({}, props.currentRowValue, finallyParams))
    }else if(props.operateFun){
      const finaFunArgs:any = []
      if (props.funArgs) {
        finaFunArgs.push(...props.funArgs)
      }
      res = finaFunArgs.length ? await props.operateFun(finallyParams,...finaFunArgs) : await props.operateFun(finallyParams)
    }
    // console.log('res', res)
    if (res.code !== -1) {
      ElMessage.success(props.operate === 'add' ? t('addSuccess') : props.operate === 'edit' ? t('editSuccess') : `${props.operate}${t('success')}`)
      myDialogForm.value?.reset()
      dialogShow.value = false
      emits('success', finallyParams)
    }
  }
}
const domId = uuidv4()
watch(() => props.dialogVisible,async () => {
  if (props.dialogVisible && props.formHeight) {
    await nextTick()
    const container = document.getElementById(domId)
    container!.style.maxHeight = typeof props.formHeight === 'number' ? props.formHeight + 'px' : props.formHeight
    container!.style.overflow = 'auto'
  }
  if(props.dialogVisible === false){
    emits('close')
  }
})

const setValue = (data: { [key: string]: any }) => {
  myDialogForm.value?.setValue(data)
}
const getValue = (code?: string) => {
  return myDialogForm.value?.getValue(code)
}
const validate = (callback?: () => void) => {
  return myDialogForm.value?.validate(callback)
}
const validateField = (code: string) => {
  return myDialogForm.value?.validateField(code)
}
const resetFields = () => {
  myDialogForm.value?.reset()
}
const scrollToField = (code: string) => {
  myDialogForm.value?.scrollToField(code)
}
const clearValidate = (code: string) => {
  myDialogForm.value?.clearValidate(code)
}
defineExpose({
  getValue,
  setValue,
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate
})
</script>

<template>
  <div class="form-dialog-wrapper">
    <my-dialog
      v-model:dialog-visible="dialogShow"
      :title="`${operate === 'edit' ? $t('edit') : operate === 'add' ? $t('create') : operate}${title}`"
      :width="props.width"
      v-bind="$attrs"
      @close="cancel"
    >
      <div :id="domId">
        <div class="my-form-wrapper">
          <my-form
            ref="myDialogForm"
            :rules="props.rules"
            :form-data-list="props.formDataList"
            :label-width="props.labelWidth"
            :label-position="props.labelPosition"
            :col="props.col"
          />
        </div>
        <slot />
      </div>
      <div class="btn-wrapper">
        <el-button
          type="default"
          @click="cancel"
        >
          {{ $t('cancel') }}
        </el-button>
        <slot name="btn" />
        <el-button
          type="primary"
          @click="formSubmit"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
    </my-dialog>
  </div>
</template>

<style scoped lang=scss>
:deep(.el-form-item__content) {
  & > div {
    width: 100%;
  }
}
.my-form-wrapper {
  overflow: hidden;
}
.btn-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
