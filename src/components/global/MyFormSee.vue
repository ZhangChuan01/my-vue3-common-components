<script setup lang='ts'>
import { Input, Select, Date,Switch,ColorPicker,Cascader } from './base/base'
const props = withDefaults(defineProps<{
  formDataList: (Input | Select | Date | Switch | ColorPicker | Cascader)[]
  labelWidth?: string | number
}>(), {
  labelWidth: 'auto'
})

</script>

<template>
  <div class="form-wrapper">
    <el-form
      :label-width="props.labelWidth"
    >
      <template
        v-for="formData in props.formDataList"
        :key="formData.type === 'title' ? formData.label : formData.code"
      >
        <el-form-item
          :label="formData.label"
          :style="formData.style || ''"
          :class="{title: formData.type === 'title'}"
        >
          {{ formData.value }}
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
  .el-form-item__label {
    color: #86909c !important;
  }
  .el-form-item__content {
    color: #4e5969 !important;
  }
  .el-form-item {
    margin-bottom: 0 !important;
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
