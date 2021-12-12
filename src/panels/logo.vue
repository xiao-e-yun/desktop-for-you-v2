<template lang="pug">
Panel#logo(
  name="menu/logo"
  :drop_shadow="true"
  :style="{'z-index':props['menu/logo/z-index']?1:-1}"
): img(
  :src="props['menu/logo/file'] as string || 'M99.png'"
  :style="{width}"
)
</template>

<script lang="ts" setup>
import { use_store } from '@/store';
import Panel from '@c/panel.vue';
import { computed } from 'vue';

const props = use_store().state.props
const width = computed(() => props['menu/logo/width'] + '%')
</script>

<style lang="scss">
#logo::before,#logo::after{
  content: none;
}
</style>