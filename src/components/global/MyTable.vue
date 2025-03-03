<script setup lang='ts'>
import moment from 'moment'
import FilterSvg from '../assets/FilterSvg.vue'
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
  dataFun?: null | ((params?: any) => Promise<any>)
  filters?: null | {[key: string]: unknown}
  needIndex?: boolean
  needPage?: boolean
  needSelection?: boolean
  dataSource: {
    tableData?: any,
    cols: {
      code: string
      label: string
      width?: string | number
      showOverflowTooltip?: boolean
      type?: string  // template,datetime,date,time,num
      headerSlot?: string
      filterSlot?: string
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
  fixedParams?: {[key: string]: any} | null
}>(), {
  dataFun: null,
  filters: null,
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
  let params:unknown = {}
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
  const res = await props.dataFun!(params)
  // console.log('tableData', res)
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
  <div class="my-table">
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
        label="序号"
        width="60"
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
          :width="col.width || ''"
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
          v-else-if="col.type === 'datetime' || col.type === 'date' || col.type === 'time'"
          :prop="col.code"
          :width="col.width || (col.type === 'datetime' ? '180px' : '120px')"
          v-bind="col"
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
            {{ dateFormat(scope.row[col.code], col.type === 'date' ? 'YYYY-MM-DD' : col.type === 'time' ? 'HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.type === 'num'"
          :prop="col.code"
          v-bind="col"
          :width="col.width || ''"
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
          v-bind="col"
          :width="col.width || ''"
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
            {{ Math.floor(scope.row[col.code]) || '' }}
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.code"
          v-bind="col"
          :width="col.width || ''"
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
        :label="props.dataSource.operate.label || '操作'"
        :width="props.dataSource.operate.width || '120px'"
        :fixed="props.dataSource.operate.fixed || 'right'"
      >
        <template #header>
          <slot :name="props.dataSource.operate.headerSlot" />
        </template>
        <template #filter-icon>
          <slot :name="props.dataSource.operate.filterSlot" />
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
