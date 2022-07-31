<template lang="pug">
Panel.date(name="menu/date")
  p 
    span {{ pad(time.month+1) }}
    |&nbsp;|&nbsp;
    span {{ pad(time.date) }}
  p(
    v-if="props['menu/date/week']"
    :class="{ bold: props['menu/date/week/format'] !== 'en' }"
  ) &nbsp;{{ week }}
</template>

<script lang="ts" setup>
import Panel from '@c/panel.vue';
import { useStore } from '@/store';
import { computed } from 'vue';

const state = useStore()
const props = state.props
const time = state.time

const format: { [lang: string]: string[] } = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',],
  zh: ['日', '一', '二', '三', '四', '五', '六',],
  jp: ['日', '月', '火', '水', '木', '金', '土',],
}

const week = computed(() => props["menu/date/week"] && format[props["menu/date/week/format"] as string][time.day])

function pad(time: number) { return time.toString().padStart(2, "0") }
console.log("[日曆] 加載完成")
</script>

<style lang="scss" module>
.date {
  @include flip;
  padding: .1em 0.45em 0;
  display: inline-block;

  & > p {
    margin: 0;
    display: inline;
    font-size: 1.2em;

    &.bold {
      font-size: 1em;
      font-weight: bold;
    }
  }
}
</style>