<script lang="ts" setup>
const props = defineProps({
  // SVG 图标名称
  icon: {
    type: String,
    required: true
  },
  // 图标类名
  className: {
    type: String,
    default: 'icon'
  },
  size: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <svg
    class="svg-icon"
    :style="{ width: props.size > 0 ? props.size + 'px' : '1em', height: props.size > 0 ? props.size + 'px' : '1em' }"
    :class="className"
    aria-hidden="true"
  >
    <use :xlink:href="`#icon-${icon}`" />
  </svg>
</template>

<style scoped lang=scss>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  fill: currentcolor;
}
</style>
