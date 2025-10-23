import MyDialog from './components/generally/MyDialog.vue'
import MyTable from './components/generally/MyTable.vue'
import MyFilter from './components/generally/MyFilter.vue'
import MyForm from './components/generally/MyForm.vue'
import MyFormDialog from './components/generally/MyFormDialog.vue'
import MyFormSee from './components/generally/MyFormSee.vue'
import MyInput from './components/generally/base/MyInput.vue'
import MySelect from './components/generally/base/MySelect.vue'
import MyVirtualizedSelect from './components/generally/base/MyVirtualizedSelect.vue'
import MyDate from './components/generally/base/MyDate.vue'
import MyDateTimeRange from './components/generally/base/MyDateTimeRange.vue'
import MyCascader from './components/generally/base/MyCascader.vue'
import MyTime from './components/generally/base/MyTime.vue'
import MySwitch from './components/generally/base/MySwitch.vue'
import MyColorPicker from './components/generally/base/MyColorPicker.vue'
import MyCheckGroup from './components/generally/base/MyCheckGroup.vue'
import MyRadioGroup from './components/generally/base/MyRadioGroup.vue'
import MyReadOnly from './components/generally/base/MyReadOnly.vue'
import MyTab from './components/generally/MyTab.vue'

import SvgIcon from './components/special/SvgIcon/SvgIcon.vue'
import PreviewFile from './components/special/PreviewFile/PreviewFile.vue'
import LineArea from './components/special/LineArea/LineArea.vue'
import NavtiveTable from './components/special/NavtiveTable/NavtiveTable.vue'
import ContainerComponent from './components/special/ContainerComponent/ContainerComponent.vue'
import VideoComponent from './components/special/VideoComponent/VideoComponent.vue'
import BatchModelComponent from './components/special/BatchModelComponent/BatchModelComponent.vue'

declare module 'vue'{
  export interface GlobalComponents {
    MyDialog: typeof MyDialog
    MyTable: typeof MyTable
    MyFilter: typeof MyFilter
    MyForm: typeof MyForm
    MyFormDialog: typeof MyFormDialog
    MyFormSee: typeof MyFormSee
    MyInput: typeof MyInput
    MySelect: typeof MySelect
    MyVirtualizedSelect: typeof MyVirtualizedSelect
    MyDate: typeof MyDate
    MyDateTimeRange: typeof MyDateTimeRange
    MyCascader: typeof MyCascader
    MyTime: typeof MyTime
    MySwitch: typeof MySwitch
    MyColorPicker: typeof MyColorPicker
    MyCheckGroup: typeof MyCheckGroup
    MyRadioGroup: typeof MyRadioGroup
    MyReadOnly: typeof MyReadOnly
    MyTab: typeof MyTab
    SvgIcon: typeof SvgIcon
    PreviewFile: typeof PreviewFile
    LineArea: typeof LineArea
    NavtiveTable: typeof NavtiveTable
    ContainerComponent: typeof ContainerComponent
    VideoComponent: typeof VideoComponent
    BatchModelComponent: typeof BatchModelComponent
  }
}