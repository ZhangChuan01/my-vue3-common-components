import MyDialog from './components/global/MyDialog.vue'
import MyTable from './components/global/MyTable.vue'
import MyFilter from './components/global/MyFilter.vue'
import MyForm from './components/global/MyForm.vue'
import MyFormDialog from './components/global/MyFormDialog.vue'
import MyFormSee from './components/global/MyFormSee.vue'
import SvgIcon from './components/global/SvgIcon.vue'
import MyInput from '.MyCascader.vue'
import MySelect from './components/global/base/MySelect.vue'
import MyDate from './components/global/base/MyDate.vue'
import MyCascader from './components/global/base/MyCascader.vue'
import MyTime from './components/global/base/MyTime.vue'
import MySwitch from './components/global/base/MySwitch.vue'
import MyColorPicker from './components/global/base/MyColorPicker.vue'

declare module 'vue'{
  export interface GlobalComponents {
    MyDialog: typeof MyDialog
    MyTable: typeof MyTable
    MyFilter: typeof MyFilter
    MyForm: typeof MyForm
    MyFormDialog: typeof MyFormDialog
    MyFormSee: typeof MyFormSee
    SvgIcon: typeof SvgIcon
    MyInput: typeof MyInput
    MySelect: typeof MySelect
    MyDate: typeof MyDate
    MyCascader: typeof MyCascader
    MyTime: typeof MyTime
    MySwitch: typeof MySwitch
    MyColorPicker: typeof MyColorPicker
  }
}