<script setup lang='ts'>
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import FilterSvg from '../assets/FilterSvg.vue'
import MySwitch from './base/MySwitch.vue'
// 时间格式
function dateFormat(val: string, type = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) return ''
  const tz = JSON.stringify(val).includes('z') ? 0 : 8
  if (val && val !== '0001-01-01T00:00:00') {
    return moment(val).utcOffset(tz).format(type)
  } else {
    return ' '
  }
}
function takeMoreThan(value: number) {
  if (!value || value === 0) return value
  return Number(value.toString().match(/^\d+(?:\.\d{0,2})?/))
}
const props = withDefaults(defineProps<{
  dataFun?: null | ((params?: any,...args: any) => Promise<any>)
  filters?: null | {[key: string]: unknown}
  funArgs?: Array<any>
  needIndex?: boolean
  needPage?: boolean
  needSelection?: boolean
  dataSource: {
    tableData?: any,
    colWidthAverage?: boolean
    cols: {
      code: string
      label: string
      width?: string | number
      showOverflowTooltip?: boolean
      type?: string  // template,datetime,date,time,num
      headerSlot?: string
      filterSlot?: string
      valueChange?: (val: any) => void
    }[]
    operate?: {
      label?: string
      width?: string | number
      fixed?: boolean | string
      list: {
        disabled?: boolean | ((row: any) => boolean)
        isShow?: (row: any) => boolean
        label: string | ((row: any) => string)
        type?: string
        permission?: string
        handleClick?: (row: any) => void
      }[]
      headerSlot?: string
      filterSlot?: string
    }
  }
  fixedParams?: {[key: string]: any} | null,
}>(), {
  dataFun: null,
  filters: null,
  funArgs: undefined,
  needIndex: false,
  needSelection: false,
  needPage: true,
  fixedParams: null
})

const tableComponent = ref<any>()
let tableData = ref<any>([])
let pageData = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
  fixedParams: null
})

const indexMethod = (index: number) => {
  return (pageData.currentPage - 1) * pageData.pageSize + index + 1
}

const getData = async () => {
  await nextTick()
  let params:any = {}
  if (props.needPage) {
    params = {
      SkipCount: (pageData.currentPage - 1) * pageData.pageSize,
      MaxResultCount: pageData.pageSize
    }
  }
  if (props.filters) {
    params = Object.assign({}, params, props.filters)
  }
  if(props.fixedParams){
    params = Object.assign({}, params, props.fixedParams)
  }
  // console.log('funArgs', props.funArgs)
  let res:any = null
  if(Object.keys(params).length === 0){
    res = props.funArgs ? await props.dataFun!(...props.funArgs) : await props.dataFun!()
  }else {
    res = props.funArgs ? await props.dataFun!(params,...props.funArgs) : await props.dataFun!(params)
  }
  if (res.code !== -1) {
    tableData.value = props.needPage ? (res?.items || res?.item || res?.result?.items || []) : (res?.items || res || res?.result?.items || [])
    if(props.needPage){
      pageData.total = res?.totalCount || res?.result?.totalCount || 0
    }
  }else{
    tableData.value = []
    if(props.needPage){
      pageData.total = 0
    }
  }
  
}
watch(() => props.dataSource.tableData, () => {
  tableData.value = props.dataSource.tableData
},{ immediate: true,deep: true })

if (props.dataFun) {
  getData()
}
// console.log(props.dataSource.operate)
// watch(() => props.filters, () => {
//   getData()
// },{ immediate: true,deep: true })
const handleCurrentChange = (currentPage: number) => {
  pageData.currentPage = currentPage
  getData()
}
const refresh = (pagenum?: number) => {
  if (pagenum) {
    pageData.currentPage = pagenum
  }
  if(pageData.currentPage !== 1 && pageData.total > 0 && ((pageData.currentPage - 1) * pageData.pageSize === pageData.total - 1)){
    pageData.currentPage = pageData.currentPage - 1
  }
  getData()
}
const getSelectionRows = () => {
  return props.needSelection ? tableComponent.value.getSelectionRows() : ''
}
const handleBindObj = (data: any) => {
  if(data.filters){
    if(!data.filterMethod){
      data.filterMethod = (value,row,column) => {
        return row[column['property']] === value
      }
    }
  }
  if(props.dataSource.colWidthAverage){
    data.width = ''
  }else{
    if(data.width === undefined || data.width === null){
      if(data.type === 'datetime'){
        data.width = '180px'
      }else if(data.type === 'date' || data.type === 'time' || data.type === 'datetime2'){
        data.width = '120px'
      }else if(data.list){
        data.width = '120px'
      }
    }
  }
  return data
}
defineExpose({
  handleCurrentChange,
  refresh,
  tableData,
  getSelectionRows
})
</script>

<template>
  <div
    class="my-table"
  >
    <el-table
      ref="tableComponent"
      :data="tableData"
      width="100%"
      stripe
      v-bind="$attrs"
    >
      <el-table-column
        v-if="props.needIndex"
        type="index"
        :index="indexMethod"
        :label="$t('serialNumber')"
      />
      <el-table-column
        v-if="props.needSelection"
        type="selection"
        width="50"
      />
      <template
        v-for="col in props.dataSource.cols"
        :key="col.code"
      >
        <el-table-column
          v-if="col.type === 'template'"
          :prop="col.code"
          v-bind="handleBindObj(col)"
        >
          <template #header>
            <slot :name="col.headerSlot" />
          </template>
          <template #filter-icon>
            <slot
              v-if="col.filterSlot"
              :name="col.filterSlot"
            />
            <FilterSvg v-else />
          </template>
          <template #default="scope">
            <slot
              :name="col.code"
              :row="scope.row"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.type === 'datetime' || col.type === 'datetime2' || col.type === 'date' || col.type === 'time'"
          :prop="col.code"
          v-bind="handleBindObj(col)"
        >
          <template #header>
            <slot :name="col.headerSlot" />
          </template>
          <template #filter-icon>
            <slot
              v-if="col.filterSlot"
              :name="col.filterSlot"
            />
            <FilterSvg v-else />
          </template>
          <template #default="scope">
            <span v-if="col.type === 'datetime2'">
              {{ dateFormat(scope.row[col.code],'YYYY-MM-DD') }}
              <br>
              {{ dateFormat(scope.row[col.code],'HH:mm:ss') }}
            </span>
            <span v-else>
              {{ dateFormat(scope.row[col.code], col.type === 'date' ? 'YYYY-MM-DD' : col.type === 'time' ? 'HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.type === 'num'"
          :prop="col.code"
          v-bind="handleBindObj(col)"
        >
          <template #header>
            <slot :name="col.headerSlot" />
          </template>
          <template #filter-icon>
            <slot
              v-if="col.filterSlot"
              :name="col.filterSlot"
            />
            <FilterSvg v-else />
          </template>
          <template #default="scope">
            {{ takeMoreThan(scope.row[col.code || '']) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.type === 'intNum' || col.type === 'weight'"
          :prop="col.code"
          v-bind="handleBindObj(col)"
        >
          <template #header>
            <slot :name="col.headerSlot" />
          </template>
          <template #filter-icon>
            <slot
              v-if="col.filterSlot"
              :name="col.filterSlot"
            />
            <FilterSvg v-else />
          </template>
          <template #default="scope">
            {{ Math.floor(scope.row[col.code]) || 0 }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.type === 'switch'"
          :prop="col.code"
          v-bind="handleBindObj(col)"
        >
          <template #header>
            <slot :name="col.headerSlot" />
          </template>
          <template #filter-icon>
            <slot
              v-if="col.filterSlot"
              :name="col.filterSlot"
            />
            <FilterSvg v-else />
          </template>
          <template #default="scope">
            <MySwitch
              v-model="scope.row[col.code]"
              :filter-obj="{}"
              v-bind="handleBindObj(col)"
              @change="col.valueChange && col.valueChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.code"
          v-bind="handleBindObj(col)"
        >
          <template #header>
            <slot :name="col.headerSlot" />
          </template>
          <template #filter-icon>
            <slot
              v-if="col.filterSlot"
              :name="col.filterSlot"
            />
            <FilterSvg v-else />
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="props.dataSource.operate"
        :label="props.dataSource.operate.label || $t('operate')"
        :fixed="props.dataSource.operate.fixed || 'right'"
        v-bind="handleBindObj(props.dataSource.operate)"
      >
        <template #header>
          <slot :name="props.dataSource.operate.headerSlot" />
        </template>
        <template #filter-icon>
          <slot
            v-if="props.dataSource.operate.filterSlot"
            :name="props.dataSource.operate.filterSlot"
          />
          <FilterSvg v-else />
        </template>
        <template #default="scope">
          <div class="table-btn-wrapper">
            <template
              v-for="btn in props.dataSource.operate.list"
              :key="typeof btn.label === 'string' ? btn.label : btn.label(scope.row)"
            >
              <template v-if="btn.type === 'template'">
                <div
                  v-if="btn.isShow === undefined ? true : btn.isShow(scope.row)"
                  v-has="btn.permission"
                  class="table-btn"
                >
                  <slot
                    :name="btn.label"
                    :row="scope.row"
                  />
                </div>
              </template>
              <template v-else>
                <div
                  v-if="btn.isShow === undefined ? true : btn.isShow(scope.row)"
                  class="table-btn"
                >
                  <el-button
                    v-has="btn.permission"
                    :type="btn.type || 'primary'"
                    :disabled="typeof btn.disabled === 'boolean' || btn.disabled === undefined ? btn.disabled : btn.disabled(scope.row)"
                    link
                    @click="btn.handleClick && btn.handleClick(scope.row)"
                  >
                    {{ typeof btn.label === 'string' ? btn.label : btn.label(scope.row) }}
                  </el-button>
                </div>
              </template>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="needPage && pageData.total"
      class="pagination-wrapper"
    >
      <el-pagination
        v-model:page-size="pageData.pageSize"
        v-model:current-page="pageData.currentPage"
        :page-sizes="[ 5, 10, 20, 50, 100 ]"
        :background="pageData.background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @current-change="getData"
        @size-change="getData"
      />
    </div>
  </div>
</template>

<style scoped lang=scss>
.table-btn-wrapper {
  .table-btn {
    display: inline-block;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
