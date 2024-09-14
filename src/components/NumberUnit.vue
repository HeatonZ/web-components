<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { formatNumberValue } from 'Utils/unit'
import type { PresetItem } from 'Types/unit'

const props = defineProps<{ value: string, unit: string, preset?: Record<string, PresetItem> }>()
const { value, unit} = toRefs(props)
const v = computed(() => {
  const val = formatNumberValue(value.value, unit.value)
  return `${val} ${unit.value}`
})
</script>

<template>
  <span>{{ v }}</span>
</template>

<style scoped>
</style>
