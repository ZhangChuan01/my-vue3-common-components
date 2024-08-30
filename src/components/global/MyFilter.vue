<script setup lang='ts'>

const props = withDefaults(defineProps<{
  filterList: (ComponentsProps.Input | ComponentsProps.Select | ComponentsProps.Date)[]
  needBtn?: boolean
}>(), {
  needBtn: true
})

const emits = defineEmits<{
  (e: 'search', filter: {[key: string]: unknown}): void
}>()

const inputTypes = [ 'text', 'number' ]
const dateTypes = [ 'year', 'month', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange' ]
const search = () => {
  const res: {[key: string]: unknown} = {}
  props.filterList.forEach(filter => {
    res[filter.code] = filter.value
  })
  emits('search', res)
}
const reset = () => {
  props.filterList.forEach(filter => {
    filter.value = ''
  })
}
</script>

<template>
  <div class="filter-wrapper">
    <el-form
      :inline="true"
    >
      <el-form-item
        v-for="filter in props.filterList"
        :key="filter.code"
        :label="filter.label"
        :label-width="filter.labelWidth || ''"
        :style="filter.style || ''"
      >
        <MyInput
          v-if="inputTypes.includes(filter.type)"
          v-model="filter.value"
          :filter-obj="filter"
        />
        <MySelect
          v-else-if="filter.type === 'select'"
          v-model="filter.value"
          :filter-obj="filter"
        />
        <MyDate
          v-else-if="dateTypes.includes(filter.type)"
          v-model="filter.value"
          :filter-obj="filter"
        />
      </el-form-item>
      <el-form-item v-if="props.needBtn">
        <div class="btn-wrapper">
          <el-button
            type="default"
            @click="reset"
          >
            重置
          </el-button>
          <el-button
            type="primary"
            @click="search"
          >
            查询
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
