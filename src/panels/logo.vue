<template lang="pug">
Panel(
  name="menu/logo"
  :drop_shadow="true"
  :style="{'z-index':props['menu/logo/z-index']?1:-1}"
): img(
  :src="src"
  :style="{width}"
)
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed } from 'vue';
import Panel from '@c/panel.vue';

const props = useStore().props
const width = computed(() => props['menu/logo/width'] + '%')

const src = computed(() => props['menu/logo/file'] as string || "M99.png")
console.log("[標誌] 加載完成")
</script>