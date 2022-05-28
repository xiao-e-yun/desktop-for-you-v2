<template lang="pug">
transition(name="fade-in" appear :class="{dev:props['menu/dev_tools']}")
  component#background(
    :style="style"
    :src="type.src()"
    :is="type.is"
    v-if="type"
    v-bind="bind"

    :class="{changing}"
    v-on="mouse.event"
    @animationend="change"
  )
component#background-over(
  :style="style"
  :src="type.offset(mouse.move > 0 ? 1 : -1)"
  :is="type.is"
  v-if="type && type.list && (changing || (mouse.allow && mouse.move))"
  :class="[mouse.move > 0 ? 'left' : 'right',{changing}]"
)
</template>

<script lang="ts" setup>
import { use_store } from '@/store';
import { computed, CSSProperties, reactive, ref } from 'vue';
const state = use_store().state
const fetch = state.fetch
const props = state.props

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

const bind = computed(()=>(type.value && type.value.is)?{
  loop:type.value.is==='video',
  autoplay:type.value.is==='video'
}:{})

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

<style lang="scss">
#background,#background-over{
  z-index: -10;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;

  &.changing{
    animation: bg_changing 1.6s linear backwards;
    @keyframes bg_changing {
      to{ transform: translateX(100%) }
    }
  }
}
#background {
  left: 0;
  transition: none;
  transition: filter .6s ease-in-out;

  &.dev {
    filter: brightness(.2);
  }
}
#background-over {
  &.left { left: -100%; }
  &.right { right: -100%; }
}
</style>
