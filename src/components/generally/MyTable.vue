<script setup lang='tsx'>
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import FilterSvg from '../assets/FilterSvg.vue'
import MySwitch from './base/MySwitch.vue'
import { type InitConfig } from '../../index'
import toolite from 'toolite'

const emits = defineEmits<{
  (e:'pageChange', page: number): void
  (e:'sizeChange', size: number): void
}>()

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
  indexWidth?: number
  needPage?: boolean
  needSelection?: boolean
  selectionModel?: string
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
        isShow?: boolean | ((row: any) => boolean)
        label: string | ((row: any) => string)
        type?: string
        permission?: string
        handleClick?: (row: any) => void
      }[]
      headerSlot?: string
      filterSlot?: string
      close?: boolean
    }
  }
  fixedParams?: {[key: string]: any} | null,
  height?: string | number | undefined
  fixedTableHeight?: boolean
}>(), {
  dataFun: null,
  filters: null,
  funArgs: undefined,
  needIndex: false,
  indexWidth: 60,
  needSelection: false,
  selectionModel: 'noraml',
  needPage: true,
  fixedParams: null,
  height: undefined,
  fixedTableHeight: false
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
    if(props.needSelection && props.selectionModel === 'saveData'){
      tableData.value.forEach((row: any) => {
        if(selectedRows.find((item: any) => item.id === row.id)){
          setSelectionRows(row,true)
        }
      })
    }
  }else{
    tableData.value = []
    if(props.needPage){
      pageData.total = 0
    }
  }
  handleOperateEmpty()
}
watch(() => props.dataSource.tableData, () => {
  tableData.value = props.dataSource.tableData
},{ immediate: true,deep: true })

if (props.dataFun) {
  getData()
}
let selectedRows:any = []
const getSelectionRows = () => {
  return props.needSelection ? props.selectionModel === 'saveData' ? selectedRows : tableComponent.value.getSelectionRows() : ''
}
const resetSelectionRows = () => {
  if(props.needSelection){
    tableComponent.value.clearSelection()
    selectedRows = []
  }
}
const setSelectionRows = async (rows: any,isSelected: boolean) => {
  await nextTick()
  if(Array.isArray(rows)) {
    rows.forEach((row: any) => {
      tableComponent.value.toggleRowSelection(row,isSelected)
    })
  }else{
    tableComponent.value.toggleRowSelection(rows,isSelected)
  }
}
const handleSelect = (rows: any,currentRow: any) => {
  if(props.selectionModel === 'saveData'){
    const checked = rows.find((row: any) => row.id === currentRow.id)
    if(checked){
      selectedRows.push(toRaw(currentRow))
    }else{
      const index = selectedRows.findIndex((row: any) => row.id === currentRow.id)
      if(index !== -1){
        selectedRows.splice(index,1)
      }
    }
  }
}
const handleSelectAll = (rows: any) => {
  if(props.selectionModel === 'saveData'){
    if(rows.length > 0){
      rows.forEach((row: any) => {
        if(!selectedRows.find((item: any) => item.id === row.id)){
          selectedRows.push(toRaw(row))
        }
      })
    }else{
      for(let i = selectedRows.length - 1; i >= 0; i--){
        if(tableData.value.find((row: any) => row.id === selectedRows[i].id)){
          selectedRows.splice(i,1)
        }
      }
    }
  }
}
const handleCurrentChange = (currentPage: number) => {
  pageData.currentPage = currentPage
  getData()
}
let resetTableData = false
toolite.emitter.on('resetTableData', () => {
  resetTableData = true
  setTimeout(() => {
    resetTableData = false
  }, 1000)
})
const refresh = (pagenum?: number) => {
  // console.log('resetTableData', resetTableData)
  // console.log('pagenum', pagenum)
  if(resetTableData){
    if(pageData.currentPage === 1){
      getData()
      return
    }
    pageData.currentPage = 1
  }else if (pagenum) {
    if(pageData.currentPage === pagenum) {
      getData()
      return
    }
    pageData.currentPage = pagenum
  }else if(pageData.currentPage !== 1 && pageData.total > 0 && ((pageData.currentPage - 1) * pageData.pageSize === pageData.total - 1)){
    pageData.currentPage = pageData.currentPage - 1
  }else{
    getData()
  }
}
watch(() => pageData.currentPage, newV => {
  console.log('currentPage', newV)
  emits('pageChange', newV)
  getData()
})
watch(() => pageData.pageSize, newV => {
  console.log('pageSize', newV)
  emits('sizeChange', newV)
  getData()
})

const handleBindObj = (data: any) => {
  if(data.filters){
    if(!data.filterMethod){
      data.filterMethod = (value: any,row: any,column: any) => {
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
        data.width = data.close ? '60px' : '120px'
      }
    }
  }
  return data
}
const slots = useSlots()
const OperateTemplate = (data: any) => {
  return <div class="table-btn-wrapper">
    {props.dataSource.operate?.list.map((btn: any) => {
      const show = btn.isShow === undefined ? true : typeof btn.isShow === 'boolean' ? btn.isShow : btn.isShow(data.scope.row)
      if (!show) return null
      let domHtml:any = null
      if(btn.type === 'template'){
        domHtml = <div
          v-has={btn.permission}
          class="table-btn"
        >
          {slots[btn.label]?.(data.scope.row)}
        </div>
      }else{
        domHtml = <div class="table-btn"
          v-has={btn.permission}
          onClick={() => btn.handleClick && btn.handleClick(data.scope.row)}>
          <el-button
            type={btn.type || 'primary'}
            disabled={typeof btn.disabled === 'boolean' || btn.disabled === undefined ? btn.disabled : btn.disabled(data.scope.row)}
            link
          >
            {typeof btn.label === 'string' ? btn.label : btn.label(data.scope.row)}
            
          </el-button>
        </div>
      }
      return props.dataSource.operate?.close ? <el-dropdown-item>{domHtml}</el-dropdown-item> : domHtml
    })}
  </div>
}
const tableId = uuidv4()
const handleOperateEmpty = async () => {
  if(!props.dataSource.operate?.close) return
  await nextTick()
  const table = document.getElementById(tableId)
  const elDropDowns = Array.from(table!.querySelectorAll('.el-dropdown'))
  // console.log('elDropDowns', elDropDowns)
  for(let i = 0; i < elDropDowns.length; i++){
    const elDropDownMenu = document.querySelector(`.operate-dropdown${tableId}${i}`)
    if (elDropDownMenu) {
      const liNums = elDropDownMenu.querySelectorAll('li').length
      // console.log('liNums', liNums)
      if (liNums === 0) {
        (elDropDowns[i] as HTMLElement).style.display = 'none'
      }else{
        (elDropDowns[i] as HTMLElement).style.display = 'block'
      }
    }
  }
}
function getTotalHeight(element: Element) {
  // 获取元素自身高度（内容 + 内边距 + 边框）
  const rect = element.getBoundingClientRect();
  const ownHeight = rect.height;
  
  // 获取计算样式
  const styles = window.getComputedStyle(element);
  
  // 解析上下外边距值
  const marginTop = parseFloat(styles.marginTop) || 0;
  const marginBottom = parseFloat(styles.marginBottom) || 0;
  
  // 总高度 = 自身高度 + 上外边距 + 下外边距
  return ownHeight + marginTop + marginBottom;
}
const calcHeight = () => {
  const container = document.querySelector('.page-wrapper')
  if(container){
    const height = container.clientHeight
    const divList = Array.from(container.children)
    // console.log('divList', divList)
    let totalHeight = 0
    for(let i = 0; i < divList.length; i++){
      if(divList[i].id === tableId) continue
      console.log('divList[i].clientHeight', divList[i].clientHeight)
      totalHeight += getTotalHeight(divList[i])
    }
    // console.log('totalHeight', totalHeight)
    return height - totalHeight - (props.needPage ? 54 : 2)
  }
  return '-'
}
const initConfig: InitConfig | undefined = inject('initConfig')
let showTable = ref(false), tableHeight = ref<number|string>('-')
onMounted(() => {
  // console.log('initConfig', initConfig)
  if((initConfig?.fixedTableHeight || props.fixedTableHeight) && !props.height){
    setTimeout(() => {
      tableHeight.value = calcHeight()
      showTable.value = true
    }, 500)
  }else{
    showTable.value = true
  }
})

defineExpose({
  handleCurrentChange,
  refresh,
  tableData,
  getSelectionRows,
  resetSelectionRows
})
</script>

<template>
  <div
    :id="tableId"
    class="my-table"
    v-if="showTable"
  >
    <el-table
      ref="tableComponent"
      :data="tableData"
      width="100%"
      stripe
      v-bind="$attrs"
      :height="props.height || ((props.fixedTableHeight || initConfig?.fixedTableHeight) ? tableHeight : '-')"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column
        v-if="props.needIndex"
        type="index"
        :index="indexMethod"
        :width="props.indexWidth"
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
          v-else-if="col.type === 'datetime' || col.type === 'dateyear' || col.type === 'datemonth' || col.type === 'date' || col.type === 'time'"
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
            <span>
              {{ dateFormat(scope.row[col.code], col.type === 'date' ? 'YYYY-MM-DD' : col.type === 'dateyear' ? 'YYYY' : col.type === 'datemonth' ? 'YYYY-MM' : col.type === 'time' ? 'HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss') }}
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
          <el-dropdown
            v-if="props.dataSource.operate.close"
            :popper-class="'operate-dropdown'+ tableId +scope.$index"
            trigger="click"
          >
            <span style="font-weight: 600;cursor: pointer;">
              ...
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <OperateTemplate :scope="scope" />
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <OperateTemplate
            v-else
            :scope="scope"
          />
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
      />
    </div>
  </div>
</template>

<style scoped lang=scss>
:deep(.table-btn-wrapper) {
  .table-btn {
    display: inline-block;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
:deep(.el-dropdown-menu__item) {
  padding: 0;
  .table-btn {
    padding: 5px 16px;
  }
}
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
