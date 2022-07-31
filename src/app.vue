<template lang="pug">
Background(:style="style.background")

Fx(:style="style.fx")

Visualization(:style="style.visualization")

.panels(:style="style.panels")
  Clock
  Date
  Logo

Console
</template>

<script lang="ts" setup>
import Visualization from '@/visualization/index.vue';
import Background from '@c/background.vue';
import Console from '@c/console.vue'
import Clock from '@p/clock.vue';
import Date from '@p/date.vue';
import Logo from '@p/logo.vue';
import Fx from '@p/fx.vue';
import { useStore } from './store';
import { computed, ref, toRef, watch } from 'vue';
import type { Ref } from 'vue';

const dof = toRef(useStore().props,"menu/effect/DoF") as Ref<boolean>
watch(dof,v=>{
  if(v) addEventListener("mousemove",dofFn,{passive:true})
  else {
    removeEventListener("mousemove",dofFn)
    xy.value = {x:0,y:0}
  }
},{immediate:true}) 

const xy = ref({x:0,y:0})
const style = computed(()=>{
  const { x, y } = xy.value

  const background = transform(-100)
  background.transform += `scale(1.1)`

  const fx = transform(-80)
  fx.transform += `scale(1.05)`

  return {
    background,
    fx,
    visualization:transform(-60),
    panels:transform(-50),
  }

  function transform(v:number){
    return { transform: `translate(${(x/v)}px,${(y/v)}px) ` }
  }
})

function dofFn(e: MouseEvent) {
  xy.value = {
    x: e.x - window.innerWidth / 2,
    y: e.y - window.innerHeight / 2
  }
}
</script>

<style lang="scss" module>
.panels {
  pointer-events: none;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}
</style>

<style lang="scss">
body {
  font-family: "Arial", "Microsoft JhengHei";
  overflow: hidden;
  margin: 0;
  height: 100vh;
  width: 100vw;
  color: $main;

  &.flip {
    transform: scaleX(-100%);
  }
}
</style>
<style src="@/root.scss" />