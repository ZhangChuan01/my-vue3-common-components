<script setup lang='ts'>

const emits = defineEmits<{
  (e:'update:dialogVisible', dialogVisible: boolean): void
  (e: 'close'): void
}>()

const props = withDefaults(defineProps<{
  title?: string
  subTitle?: string | number
  dialogVisible?: boolean
  width?: string | number
}>(), {
  title: '',
  subTitle: '',
  dialogVisible: false,
  width: '80%'
})

const dialogShow = computed({
  get: () => props.dialogVisible,
  set: val => emits('update:dialogVisible', val)
})

</script>

<template>
  <div class="my-dialog-wrapper">
    <el-dialog
      v-model="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :width="width"
      :destroy-on-close="true"
      align-center
      v-bind="$attrs"
      @close="emits('close')"
    > 
      <template #header>
        <div class="el-dialog__title">
          {{ title }}<span
            v-if="subTitle !== ''"
            class="sub-title"
          >{{ subTitle }}</span>
        </div>
      </template>
      <div class="header-content">
        <slot name="header-content" />
      </div>
      <slot />
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.sub-title {
  margin-left: 16px;
  color: #f00;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 0 10px #f00;
}
.header-content {
  position: absolute;
  top: 16px;
  right: 60px;
}
</style>
