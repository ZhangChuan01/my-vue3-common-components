<script setup lang='ts'>
import useTabelHook from '@/hooks/useTableHook'
import { GlobalComponents } from 'vue'
import BaseType from '@/baseType'
import { getPeopleListApi,addPeopleApi,editPeopleApi,deletePeopleApi } from '@/api/test'

const filters = reactive([
  {
    label: '测试时间组件',
    code: 'time',
    type: 'datetimerange',
    value: ''
  },
  {
    label: '性别',
    code: 'sex',
    type: 'virtualizedSelect',
    options: [
      { name: '男', id: 1 },
      { name: '女', id: 0 }
    ],
    value: '',
    props: {
      label: 'name',
      value: 'id'
    }
  },
  {
    label: '关键词',
    code: 'keyword',
    placeholder: '请输入姓名/地址',
    value: '',
    type: 'text'
  }
])

let filterRes = ref<any>({})
const formRef = ref<InstanceType<GlobalComponents['MyFormDialog']>>()
const formDataList = reactive<(BaseType.Input | BaseType.Select | BaseType.CheckGroup)[]>([
  {
    label: '姓名',
    code: 'name',
    type: 'text',
    value: ''
  },
  {
    label: '测试readOnly',
    code: 'readOnly',
    type: 'readOnly',
    value: '只读文本'
  },
  {
    label: '年龄',
    code: 'age',
    type: 'text',
    limitIntNumber: true,
    // reg: new RegExp(/\W/g),
    value: ''
  },
  {
    label: '测试checkbox',
    code: 'checkbox',
    type: 'check-group',
    circleIcon: true,
    // singleSelect: true,
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 0 }
    ],
    value: ''
  },
  {
    label: '测试radio',
    code: 'radio',
    type: 'radio-group',
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 0 }
    ],
    value: ''
  },
  {
    label: '性别',
    code: 'sex2',
    // type: 'virtualizedSelect',
    type: 'select',
    // multiple: true,
    options: [
      { name: '男', id: 1 },
      { name: '女', id: 0 }
    ],
    value: '',
    clearable: false,
    valueKey: 'id',
    codesMap: { sexC: 'name',sexV: 'id' }
  },
  {
    label: '地址',
    code: 'address',
    type: 'textarea',
    // limitNumber: true,
    value: ''
  }
])

const rules = {
  name: [
    { required: true, message: '请输入人员名称', trigger: 'blur' }
  ],
  // age: [
  //   { validator: (rule, value, callback) => {
  //     console.log('age',value,formRef.value?.getValue('address'))
  //     if(formRef.value?.getValue('address') !== '' && Number(formRef.value?.getValue('address')) < Number(value)) {
  //       callback(new Error('最小值不能大于最大值'))
  //     }
  //   }, trigger: 'blur' }
  // ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
  // address: [
  //   { validator: (rule, value, callback) => {
  //     console.log('address',value,formRef.value?.getValue('age'))
  //     if(formRef.value?.getValue('age') !== '' && Number(formRef.value?.getValue('age')) > Number(value)) {
  //       callback(new Error('最大值不能小于最小值'))
  //     }else{
  //       formRef.value?.clearValidate('age')
  //     }
  //   }, trigger: 'blur' }
  // ]
}

const { mytable, dialogVisible, operate, rowValue, create, edit, resetForm, deleteData } = useTabelHook(formDataList)
// 搜索
const search = (filters:any) => {
  filterRes.value = filters
  console.log('search', filterRes.value)
  mytable.value?.refresh()
}
// 表格
const dataSource = reactive({
  cols: [
    { code: 'name', label: '姓名' },
    { code: 'age', label: '年龄',type: 'num' },
    { code: 'sex', label: '性别', type: 'template',filters: [ { text: '男',value: 1 },{ text: '女',value: 0 } ] },
    { code: 'address', label: '地址',width: 300 },
    { code: 'switch', label: '状态',style: { '--el-switch-on-color': '#13ce66', '--el-switch-off-color': '#ff4949' },valueChange: (val: any) => console.log('val',val), type: 'switch' },
    { code: 'createTime', label: '创建时间', type: 'datetime2' }
  ],
  operate: {
    // width: 220,
    close: true,
    list: [
      { label: '编辑', type: 'primary',isShow: row => row.sex === 1, handleClick: async row => {
        row.sex2 = { id: row.sex }
        edit(row)
        await nextTick()
        console.log(formRef.value?.getValue())
      } },
      { label: '删除', type: 'danger', isShow: row => row.sex === 1, handleClick: row => deleteData(deletePeopleApi,row) }
      // { label: '自定义内容', type: 'template' }
    ]
  }
})
const rowClick = (row: any) => {
  console.log('rowClick', row)
}

</script>
<template>
  <div class="page">
    <div class="common-filter-wrapper">
      <MyFilter
        :filter-list="filters"
        @search="search"
      />
      <el-button
        type="primary"
        @click="create"
      >
        新建人员
        <SvgIcon
          icon="user"
          :size-="20"
        />
      </el-button>
    </div>
    <my-table
      ref="mytable"
      :need-index="true"
      :filters="filterRes"
      :data-fun="getPeopleListApi"
      :data-source="dataSource"
      @row-click="rowClick"
    >
      <template #sex="scope">
        {{ scope.row.sex === 1 ? '男' : '女' }}
      </template>
      <template #自定义内容>
        <el-button
          type="primary"
          link
          @click="create"
        >
          自定义按钮
        </el-button>
      </template>
    </my-table>
    <my-form-dialog
      ref="formRef"
      v-model:dialog-visible="dialogVisible"
      :col="2"
      title="人员"
      :operate="operate"
      :current-row-value="rowValue"
      :form-data-list="formDataList"
      :fun-args-edit="['2222',{x: 10}]"
      :rules="rules"
      :add-fun="addPeopleApi"
      :edit-fun="editPeopleApi"
      @success="mytable?.refresh()"
      @cancel="resetForm"
    />
  </div>
</template>
<style lang="scss" scoped>
.page {
  padding: 20px;
}
</style>