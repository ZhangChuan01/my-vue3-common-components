import MyTableVue from '@/components/global/MyTable.vue'
import MyFilterVue from '@/components/global/MyFilter.vue'
import MyForm from '@/components/global/MyForm.vue'
import MyFormDialogVue from '@/components/global/MyFormDialog.vue'

declare module 'vue' {
  export interface GlobalComponents {
    MyTable: typeof MyTableVue
    MyFilter: typeof MyFilterVue
    MyForm: typeof MyForm
    MyFormDialog: typeof MyFormDialogVue
  }
}
