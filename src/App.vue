<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
window.$t = t
</script>

<template>
  <router-view />
</template>
