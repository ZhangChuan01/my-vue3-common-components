<script setup lang='ts'>
type TdData = {
  value?: any
  rowspan?: number
  colspan?: number
  width?:number
  type?: string
  code?: string
}
const props = withDefaults(defineProps<{
  dataSource: {
    thead: TdData[][]
    tbody: TdData[][]
  }
}>(),
{
})

const getData = () => {
  let obj:any = {}
  props.dataSource.tbody.forEach(item => {
    item.forEach(item2 => {
      if(item2.code){
        if(!obj[item2.code]) {
          obj[item2.code] = [ item2.value ]
        }else {
          obj[item2.code].push(item2.value)
        }
      }
    })
  })
  Object.keys(obj).forEach(key => {
    if(obj[key].length === 1) {
      obj[key] = obj[key][0]
    }
  })
  return obj
}
defineExpose({
  getData
})
</script>

<template>
  <div class="native-table">
    <table>
      <thead>
        <tr
          v-for="(thead,index) in props.dataSource.thead"
          :key="index"
        >
          <th
            v-for="(item,index2) in thead"
            :key="index2"
            :rowspan="item.rowspan"
            :colspan="item.colspan"
            :width="item.width"
          >
            <span v-html="item.value"></span>
          </th>
        </tr>
      </thead>
      <!-- 表格数据行（示例） -->
      <tbody>
        <tr
          v-for="(trData,index) in props.dataSource.tbody"
          :key="index"
        >
          <td
            v-for="(tdData,index2) in trData"
            :key="index2"
            :rowspan="tdData.rowspan"
            :colspan="tdData.colspan"
            :width="tdData.width"
            :title="tdData.value"
          >
            <span v-html="tdData.value" class="no-border" v-if="tdData.type !== 'input'"></span>
            <MyInput
              v-else
              v-model="tdData.value"
              :filter-obj="{...tdData,clearable: false}"
              type="text"
              class="no-border"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang=scss>
.native-table {
  padding: 10px;
}
table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
}
thead {
  font-weight: 600;
  border-bottom: 1px solid black;
}
tr {
  border-bottom: 1px solid black;
  &:last-child {
    border-bottom: none;
  }
}
th,
td {
  padding: 8px;
  color: #000;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  vertical-align: middle;
  border-right: 1px solid black;
  &:last-child {
    // border-right: none;
  }
  span {
    display: block;
    width: 100%;
    input {
      width: 100%;
    }
  }
}
.no-border {
  width: 100%;
  padding: 0;
  overflow: hidden;
  color: #000;
  font-size: 14px;
  white-space: nowrap;
  text-align: center;
  text-overflow: ellipsis;
  background: transparent;
  border: none;
  border-radius: 4px;
  outline: none;
  transition: all 0.3s;
  :deep(.el-input__wrapper) {
    box-shadow: none;
    input {
      color: #000;
    }
  }
}
td:nth-child(n+3) input {
  box-sizing: border-box;
  width: 100%;
}
</style>
