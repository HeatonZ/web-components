<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { functions } from 'utils-zsf'
import { PresetItem } from 'node_modules/utils-zsf/dist/functions/unit'

const props = defineProps<{ value: string, unit: string, preset?: Record<string, PresetItem> }>()
const { value, unit} = toRefs(props)
const v = computed(() => {
  const val = functions.unit.formatNumberValue(value.value, unit.value)
  return `${val} ${unit.value}`
})
</script>

<template>
  <span>{{ v }}</span>
</template>

<style scoped>
</style>
