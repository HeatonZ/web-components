<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const props = defineProps<{ src: string, requestInit?:RequestInit }>()
const ok = ref(false)
onBeforeMount(() => {
  if (!props.src) return
  fetch(props.src, { method: 'HEAD', ...props.requestInit }).then((res: Response) => {
    ok.value = res.ok
  }).catch(() => {
    ok.value = false
  })
})
</script>

<template>
  <img v-if="ok" v-bind="$attrs" :src />
</template>

<style scoped>
</style>
