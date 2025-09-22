<script setup lang='ts'>
// import toolite from 'toolite';
import { type Input, type Select,type Date,type Cascader } from './base/base'
import { useI18n } from 'vue-i18n'
import { type InitConfig } from '../../index'
import toolite from 'toolite'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  filterList: (Input | Select | Date | Cascader)[]
  needBtn?: boolean
  confirmText?: string
  resetText?: string
  rememberDefault?: boolean
}>(), {
  needBtn: true,
  confirmText: '',
  resetText: '',
  rememberDefault: false
})
const emits = defineEmits<{
  (e: 'search', filter: {[key: string]: unknown}): void
  (e: 'reset'): void
}>()

const inputTypes = [ 'text', 'number' ]
const dateTypes = [ 'year', 'month', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange' ]
const search = () => {
  const res: {[key: string]: any} = {}
  let flag = false
  props.filterList.forEach(filter => {
    if(filter.type === 'datetimerange2'){
      console.log('filter.value',filter.value)
      if(filter.value && filter.value.length > 0){
        let count = 0
        filter.value.forEach((item: any) => {
          if(item.length > 0 && item.length < 19){
            count++
          }
        })
        if(count > 0){
          window.$message.error(`${filter.label}范围必须全选`)
          flag = true
        }else{
          const diff = toolite.dateDiff({
            start: filter.value[0],
            end: filter.value[1],
            type: 'seconds'
          })
          if(diff < 0){
            window.$message.error(`${filter.label}范围开始时间不能大于结束时间`)
            flag = true
          }
        }
      }
    }
    if(filter.code){
      res[filter.code] = filter.value
    }
  })
  if(flag) return
  console.log('res2222', res)
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
const initConfig: InitConfig | undefined = inject('initConfig')
let defaultFilter: {[key: string]: any} = {}
const reset = () => {
  let res: {[key: string]: any} = {}
  if(props.rememberDefault){
    props.filterList.forEach(filter => {
      if(filter.code){
        filter.value = defaultFilter[filter.code]
      }
    })
  }else{
    props.filterList.forEach(filter => {
      filter.value = ''
      if(filter.code){
        res[filter.code] = filter.value
      }
    })
  }
  console.log('props.filterList',props.filterList)
  emits('reset')
  if(initConfig?.filterResetData){
    toolite.emitter.emit('resetTableData')
    emits('search', {})
  }
}
const computedStyle = (style: any) => {
  if(style){
    if(!style.width){
      style.minWidth = '200px'
    }
  }else{
    return {
      minWidth: '200px'
    }
  }
}

onMounted(() => {
  if(props.rememberDefault){
    props.filterList.forEach(filter => {
      if(filter.code){
        defaultFilter[filter.code] = filter.value
      }
    })
    console.log('defaultFilter',defaultFilter)
  }
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
          :style="computedStyle(filter.style)"
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
          <MyTime
            v-else-if="filter.type === 'time'"
            v-model="(filter.value as string)"
            :filter-obj="filter"
          />
          <MyDateTimeRange
            v-else-if="filter.type === 'datetimerange2'"
            v-model="(filter.value as string)"
            :filter-obj="filter"
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
