<script setup lang='ts'>
import { Input, Select, Date,Cascader } from './base/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  filterList: (Input | Select | Date | Cascader)[]
  needBtn?: boolean
  confirmText?: string
  resetText?: string
}>(), {
  needBtn: true,
  confirmText: '',
  resetText: ''
})
const emits = defineEmits<{
  (e: 'search', filter: {[key: string]: unknown}): void
  (e: 'reset'): void
}>()

const inputTypes = [ 'text', 'number' ]
const dateTypes = [ 'year', 'month', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange' ]
const search = () => {
  const res: {[key: string]: any} = {}
  props.filterList.forEach(filter => {
    if(filter.code){
      res[filter.code] = filter.value
    }
  })
  // console.log('res2222', res)
  emits('search', deleteEmptyValue(JSON.parse(JSON.stringify(res))))
}
const deleteEmptyValue = (obj: {[key: string]: any}) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === '') {
      delete obj[key]
    }
  })
  return obj
}
const reset = () => {
  props.filterList.forEach(filter => {
    filter.value = ''
  })
  emits('reset')
}
onMounted(() => {
  
})
</script>

<template>
  <div class="filter-wrapper">
    <el-form
      :inline="true"
      v-bind="$attrs"
    >
      <template
        v-for="filter in props.filterList"
        :key="filter.code"
      >
        <el-form-item
          v-if="filter.type"
          :label="filter.label"
          :label-width="filter.labelWidth || ''"
          :style="filter.style || ''"
        >
          <MyInput
            v-if="inputTypes.includes(filter.type)"
            v-model="(filter.value as string)"
            :filter-obj="filter"
          />
          <MySelect
            v-else-if="filter.type === 'select'"
            v-model="(filter.value as string)"
            :filter-obj="(filter as Select)"
          />
          <MyCascader
            v-else-if="filter.type === 'cascader'"
            v-model="(filter.value as string)"
            :filter-obj="(filter as Cascader)"
          />
          <MyVirtualizedSelect
            v-else-if="filter.type === 'virtualizedSelect'"
            v-model="(filter.value as string)"
            :filter-obj="(filter as Select)"
          />
          <MyDate
            v-else-if="dateTypes.includes(filter.type)"
            v-model="(filter.value as string)"
            :filter-obj="filter"
          />
        </el-form-item>
      </template>
      <el-form-item v-if="props.needBtn">
        <div class="btn-wrapper">
          <el-button
            type="default"
            @click="reset"
          >
            {{ props.resetText || t('reset') }}
          </el-button>
          <el-button
            type="primary"
            @click="search"
          >
            {{ props.confirmText || t('search') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang=scss>
:deep(.el-form) {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    margin-right: 16px;
    margin-bottom: 16px;
    .el-select {
      min-width: 200px;
    }
  }
  .btn-wrapper {
    display: flex;
  }
  .el-input__wrapper,
  .el-textarea textarea {
    .el-input__inner {
      padding-right: 10px;
    }
    .el-input__suffix {
      position: absolute;
      right: 6px;
      z-index: 99999;
    }
  }
}
.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  align-items: center;
}

</style>
