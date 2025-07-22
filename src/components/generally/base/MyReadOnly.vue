<script setup lang='ts'>
import { type Readonly } from './base'

const props = withDefaults(defineProps<{
  filterObj: Readonly
  modelValue: any
}>(), {
  modelValue: ''
})
</script>

<template>
  <div class="readonly-wrapper">
    {{ props.modelValue }}
  </div>
</template>

<style scoped lang=scss>
.readonly-wrapper {
  min-height: 32px;
  padding: 0 10px;
  color: #a8abb2;
  background: rgb(239 239 239 / 70%);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
