<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang='ts'>
import type { FormRules } from 'element-plus'
import { GlobalComponents } from 'vue'

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
  formDataList: (ComponentsProps.Input | ComponentsProps.Select | ComponentsProps.Date | ComponentsProps.Switch | ComponentsProps.ColorPicker)[]
  rules?: FormRules | undefined
  width?: string | number
  labelWidth?: string | number
  formHeight?: string | number
  addFun?: (data: any) => Promise<Api.Result> | undefined
  editFun: (data?: any) => Promise<Api.Result> | undefined
  dialogVisible?: boolean
  currentRowValue?: any
  fixedParams?: {[key: string]: any} | undefined
  beforeSubmit?: (() => boolean)| null
  handleField?: ((res: any) => void ) | null
}>(), {
  title: '',
  operate: 'add',
  addFun: undefined,
  editFun: undefined,
  rules: undefined,
  width: '700px',
  labelWidth: 'auto',
  formHeight: '',
  dialogVisible: false,
  currentRowValue: {},
  fixedParams: undefined,
  beforeSubmit: null,
  handleField: null
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
  console.log('valid1111', formRes)
  let res:any
  
  if (formRes && formRes !== true) {
    if(props.handleField){
      props.handleField(formRes)
    }
    
    let finallyParams = props.fixedParams ? Object.assign({}, props.fixedParams, formRes) : formRes
    console.log('finallyParams', finallyParams,props.operate,props.addFun)
    if (props.operate === 'add' && props.addFun) {
      res = await props.addFun(finallyParams)
    } else if (props.operate === 'edit' && props.editFun) {
      res = await props.editFun(Object.assign({}, props.currentRowValue, finallyParams))
    }
    console.log('res', res)
    if (res.code !== -1) {
      window.$message.success(props.operate === 'add' ? '新建成功' : '编辑成功')
      myDialogForm.value?.reset()
      dialogShow.value = false
      emits('success', finallyParams)
    }
  }
}
const domId = window.$uuid()
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
const getValue = (code: string) => {
  return myDialogForm.value?.getValue(code)
}

defineExpose({
  getValue,
  setValue
})
</script>

<template>
  <div class="form-dialog-wrapper">
    <my-dialog
      v-model:dialog-visible="dialogShow"
      :title="`${operate === 'edit' ? '编辑' : '新建'}${title}`"
      :width="props.width"
      @close="cancel"
    >
      <div :id="domId">
        <div class="my-form-wrapper">
          <my-form
            ref="myDialogForm"
            :rules="props.rules"
            :form-data-list="props.formDataList"
            :label-width="props.labelWidth"
          />
        </div>
        <slot />
      </div>
      <div class="btn-wrapper">
        <el-button
          type="default"
          @click="cancel"
        >
          取消
        </el-button>
        <slot name="btn" />
        <el-button
          type="primary"
          @click="formSubmit"
        >
          确定
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
