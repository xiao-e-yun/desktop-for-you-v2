<template lang="pug">
.background
  transition(name="fade-in" appear)
    component.main(
      :style="style"
      :src="type.src()"
      :is="type.is"
      v-if="type"
      v-bind="bind"

      :class="[direction,{changing},{dev}]"
      v-on="mouse.event"
      @animationend="change"
    )
  component.over(
    :style="style"
    :src="type.offset(mouse.move > 0 ? 1 : -1)"
    :is="type.is"
    v-if="type && type.list && (changing || (mouse.allow && mouse.move))"
    :class="[direction,{changing},{dev}]"
  )
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, reactive, ref, toRef } from 'vue';
import type { CSSProperties } from "vue"

const store = useStore()
const fetch = store.fetch
const props = store.props

// 開發模式
const dev = toRef(props,"menu/dev_tools")

//======================================================
// 切換背景模式
//======================================================

const index = ref<number | false>(false)
const type = computed(() => {
  const i = props["menu/bg_file"] as number
  index.value = i > 2 ? 0 : false
  return [
    {
      is: "div",
      src: () => "",
    },
    {
      is: "img",
      src: () => props["menu/bg_file/img"] || "background.png"
    },
    {
      is: "video",
      src: () => props["menu/bg_file/video"]
    },
    {
      is: "img",
      src(){return this.list[index.value as number]},
      offset(pos:number){
        const length = this.list.length
        let over_index = index.value as number + pos
        if(over_index >= length) over_index = over_index as number - length
        if(over_index < 0) over_index = length + (over_index as number)
        return this.list[over_index as number]
      },
      list: (fetch["menu/bg_file/dir_img"] || ["background.png"])
    },
  ][i]
})



const bind = computed(()=>(type.value && type.value.is==='video')?{
  autoplay:true,
  loop:true,
}:{})

//======================================================
// 樣式
//======================================================

const style = computed(() => {
  const change = (changing.value||(mouse.down && mouse.allow))
  return {
    objectFit: type.value?.is && props[type.value.is === "img" ? "menu/bg_file/img/size" : "menu/bg_file/video/size"],
    background: `rgb(${props["menu/bg_color"]})`,
    transform: change ? `translateX(var(--offset))` : null,
    "--offset": change ? `${offset.value}px` : null,
    "--pos": change ? `calc(100% - var(--offset))` : null,
  } as CSSProperties
})

//======================================================
// 幻燈片
//======================================================

const direction = computed(()=>mouse.down ? mouse.move > 0 ? 'left' : 'right' : undefined)

const mouse = reactive({
  allow: ref(false),
  down: ref(false),
  move: 0,
  x: 0,
  timer: 0 as unknown as NodeJS.Timeout,
  max: window.innerWidth / 10,
  event: computed(() => {
    const event = {} as { [event: string]: (e: MouseEvent) => void }

    if (index.value !== false){
      event.mousedown = (e: MouseEvent) => {
        mouse.allow = !(mouse.down = true)
        mouse.x = e.clientX
        clearTimeout(mouse.timer)
        mouse.timer = setTimeout(()=>{
          mouse.allow = true
        },800)
        mouse.event.mousemove(e)
      }

      if (mouse.down) {
        event.mouseup = async () => {
          mouse.down = false
          if(!mouse.allow) return
          mouse.allow = false
          if(Math.abs(mouse.move) >= mouse.max) changing.value = true
        },
        event.mousemove = (e: MouseEvent) => {
          const move = mouse.move = e.clientX - mouse.x
          if(move < mouse.max / 2) return
          
        }
      }
    }

    return event
  })
})

function change(){
  const length = (type.value?.list && type.value.list.length) as number
  if(!length) return
  
  const add = mouse.move > 0 ? 1 : -1 as number
  index.value = index.value as number + add
  if(index.value === length) index.value = 0
  if(index.value === -1) index.value = length - 1

  changing.value = false
}

const changing = ref(false)
const offset = computed(()=>Math.min(mouse.move * 10 / mouse.max,mouse.max))
</script>

<style lang="scss" module>
.background {
  position: fixed;
  z-index: -10;
  height: 100%;
  width: 100%;
  top: 0;
}

.main,.over{
  height: 100%;
  width: 100%;

  &.dev {
    filter: brightness(.2);
  }

  &.changing{
    &.left{
      animation: left_changing 1.6s ease-in-out backwards;
      @keyframes left_changing {
        to{ transform: translateX(100%) }
      }
    }
    &.right{
      animation: right_changing 1.6s ease-in-out backwards;
      @keyframes right_changing {
        to{ transform: translateX(-100%) }
      }
    }
  }
}
.main {
  left: 0;
  transition: none;
  transition: filter .6s ease-in-out;


}
.over {
  &.left { left: -100%; }
  &.right { right: -100%; }
}
</style>
