<template lang="pug">
Panel.clock(name="menu/clock")
  p
    span {{ hour }}
    span &nbsp;:&nbsp;
    span {{ pad(time.minute) }}
    small(v-if="military_time !== second") {{ second ? pad(time.second) : apm }}
  p(v-if="military_time && second")
    span {{ apm }}
    span {{ pad(time.second) }}
    
</template>

<script lang="ts" setup>
import Panel from '@c/panel.vue';
import { useStore } from '@/store';
import { computed } from 'vue';

const store = useStore()
const time = store.time
/** MilitaryTime 二十四小時制 */
const military_time = computed(()=>store.props["menu/clock/military_time"])
const second = computed(()=>store.props["menu/clock/second"])

const hour = computed(() => pad(military_time ? time.hour % 12 : time.hour))
const apm = computed(() => time.hour < 12 ? "AM" : "PM")

function pad(time: number) { return time.toString().padStart(2, "0") }
console.log("[時鐘] 加載完成")
</script>

<style lang="scss" module>
@include style("neon"){
  .clock {
    small {
      margin: .18em 0 0 .4em;
    }
  }
}


.clock {
  padding: .32em .45em 0;

  & > p {
    @include flip;
    display: flex;
    justify-content: space-between;

    padding: 0 0 .28em;
    margin: 0;
    & > small {
      margin: 0 0 0 .4em;
    }
  }
}
</style>