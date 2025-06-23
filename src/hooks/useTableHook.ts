 
import { type GlobalComponents, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default function useTableHook(formDataList?: any):any {
  const mytable = ref<GlobalComponents['MyTable'] | null>(null)
  const dialogVisible = ref(false), operate = ref('add'), rowValue = ref<any>({})

  const create = () => {
    operate.value = 'add'
    dialogVisible.value = true
  }
  const edit = (row: any,diydata?:any) => {
    
    operate.value = 'edit'
    rowValue.value = row
    if(diydata) {
      Object.assign(rowValue.value,diydata)
    }
    formDataList.forEach((item: any) => {
      item.value = row[item.code]
    })
    console.log('编辑', row,formDataList)
    dialogVisible.value = true
  }
  const deleteData = (fun:any,data: any,callback?:any) => {
    ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const res = await fun(data)
      console.log('deleteData', res)
      if(callback) callback()
      mytable.value?.refresh()
      if (res.code !== -1) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
      }
    })
  }
  const defaultValueMap:any = {
    'string': '',
    'number': '',
    'boolean': true
  }
  const resetForm = () => {
    formDataList.forEach((item: any) => {
      item.value = defaultValueMap[typeof item.value]
    })
  }
  
  return {
    mytable,
    dialogVisible,
    operate,
    rowValue,
    create,
    edit,
    resetForm,
    deleteData
  }
}