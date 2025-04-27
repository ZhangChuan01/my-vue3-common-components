<script setup lang='ts'>
interface Base{
  value?: any
  rowspan?: number
  colspan?: number
  width?:number
  type?: string
}
interface DataSource {
  thead: Base[][]
  tbody: Base[][][]
}

const props = withDefaults(defineProps<{
  dataSource: DataSource
}>(),
{
})

</script>

<template>
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
          {{ item.value }}
        </th>
      </tr>
    </thead>
    <!-- 表格数据行（示例） -->
    <tbody>
      <template
        v-for="(tbody,index) in props.dataSource.tbody"
        :key="index"
      >
        <tr
          v-for="(trData,index2) in tbody"
          :key="index2"
        >
          <td
            v-for="(item,index3) in trData"
            :key="index3"
            :rowspan="item.rowspan"
            :colspan="item.colspan"
            :width="item.width"
          >
            <span v-if="item.type === 'input'">
              <input
                v-model="item.value"
                type="text"
                class="no-border"
              >
            </span>
            <span v-else>{{ item.value }}</span>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped lang=scss>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  color: #000;
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  border: 1px solid black;
}
.no-border {
  padding: 2px;
  font-size: 14px;
  text-align: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  outline: none;
  transition: all 0.3s;
}
td:nth-child(n+3) input {
  box-sizing: border-box;
  width: 100%;
}
</style>
