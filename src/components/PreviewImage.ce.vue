<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const props = defineProps<{ src: string }>()
const curSrc = ref(props.src)
const ok = ref(false)
onBeforeMount(() => {
  if (!curSrc.value) return
  fetch(curSrc.value, { method: 'HEAD' }).then((res: Response) => {
    ok.value = res.ok
  }).catch(() => {
    ok.value = false
  })
})
</script>

<template>
  <img v-if="ok" v-bind="$attrs" :src="curSrc" />
</template>

<style scoped>
</style>
