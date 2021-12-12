<template lang="pug">
transition(name="popup" appear): canvas#visualization(
  ref="node"
  :width="width"
  :height="height"
  v-show="state._"
  :style="style"
)
</template>

<script lang="ts" setup>
import { reactive, ref, StyleValue, watch, nextTick } from "vue";
import { use_store } from "@/store";

let width = ref(window.innerWidth);
let height = ref(window.innerHeight);

const node = ref<HTMLCanvasElement>();
const style = ref<StyleValue>();

const state = reactive({
  _: undefined as unknown as boolean,
  callback: undefined as undefined | (() => void),
  props: {} as { [key: string]: unknown },
})

const store = use_store()
const props = store.state.props

watch(node, () => {
  if (!node.value) return

  let changed = false
  const ctx = node.value.getContext("2d") as CanvasRenderingContext2D
  watch(props, (_) => {
    for (const key in _)
      if (key.indexOf("menu/visualization") === 0) {
        const props = state.props
        const props_key = key.substring("menu/visualization/".length)
        const val = _[key as keyof typeof _]
        if (props[props_key] === val) continue
        props[props_key] = val
        changed = true
      }


    //
    const val = _["menu/visualization"]
    if (val === state._) return
    state._ = val as boolean

    let id = 0

      ; (window as any).wallpaperRegisterAudioListener(state._ ? (d: string[]) => {
        ++id > 100 && (id = 0)
        store.commit("audio", d)
      } : () => { })
    if (state._) {
      let last_id:number|undefined = undefined

      let mcolor: boolean = false
      let colors: string[] = []

      let draw: number[] = []
      let length = draw.length
      let level = 1

      let spacing = 1

      let margin = 1

      let last:number[] = []
      const visualization = store.state.visualization
      state.callback = () => {
        if (last_id === id ) return
        const data = visualization.data
        
        if(changed) change()
        else if (last_id !== undefined){
          let data_length = 128
          let same = 0
          while(data_length) if(data[--data_length] === last[data_length]) ++same
          last = data
          if(same === 128) return
        }
        last_id = id

        ctx.clearRect(0, 0, width.value, height.value)

        if(mcolor){
          print(0)
          print(1)
        }else{
          ctx.beginPath()
          let i = length
          while (i) {
            const xx = margin + (--i * spacing)
            const y = data[draw[i]]

            ctx.moveTo(xx, height.value - margin)
            ctx.lineTo(xx, height.value - margin - sineOut(y < 1 ? y : 1) * level * 250)
          }
          ctx.stroke()
        }


        function print(offset:number){
          set_color(offset)
          ctx.beginPath()
          let i = length / 2
          while (i) {
            const xx = margin + (--i * (spacing * 2) + (offset * spacing))
            const y = data[draw[i * 2 + offset]]
  
            ctx.moveTo(xx, height.value - margin)
            ctx.lineTo(xx, height.value - margin - sineOut(y < 1 ? y : 1) * level * 250)
          }
          ctx.stroke()
        }

        function set_color(i: number) { if (mcolor) ctx.strokeStyle = colors[i % 2] }
        function sineOut(t: number) { return Math.sin((t * Math.PI) / 2) }
      }


      function change() {
        const props = state.props as {
          alpha: number,
          amplitude: number,
          cap: "round" | "butt",
          color: number,
          ["color/color"]: string,
          ["color/one-color"]: string,
          ["color/two-color"]: string,
          pos: boolean,
          ["pos/left"]: number,
          ["pos/top"]: number,
          quantity: number,

          width: number,
          spacing: number,

          shadow: boolean,
          ["shadow/alpha"]: number,
          ["shadow/blur"]: number,
          ["shadow/color"]: string,
        }

        level = props.amplitude
        spacing = props.width + props.spacing

        const left = window.innerWidth / 100 * props["pos/left"]
        const bottom = window.innerHeight / 100 * (100 - props["pos/top"])
        height.value = Math.min(level * 250,window.innerHeight - bottom)
        width.value = props.quantity * (spacing)
        margin = props.width / 2

        // 陰影
        style.value = {
          filter: `drop-shadow(0 0 ${props["shadow/blur"]}px ${hex(props["shadow/color"]) + get_alpha(props["shadow/alpha"])})`,
          left: left + "px",
          bottom: bottom + "px",
        }

        // 該畫哪個
        let pos: number[] = []
        const total = 128
        const add = total / props.quantity
        for (let i = 0; Math.ceil(i) <= 127; i += add) pos.push(Math.floor(i))
        draw = Array.from(new Set(pos)) //去重
        length = draw.length

        nextTick(() => { // 調整長寬 ctx會重置
          mcolor = props.color === 1
          const alpha = get_alpha(props.alpha)
          if (mcolor) colors = [hex(props["color/one-color"]) + alpha, hex(props["color/two-color"]) + alpha]
          else ctx.strokeStyle = hex(props["color/color"]) + alpha

          ctx.lineWidth = props.width
          ctx.lineCap = props.cap

          changed = false
        })
        function get_alpha(alpha: number) { return (0x100 + alpha * 2.55).toString(16).slice(1, 3) }
        function hex(rgb: string) {
          const arr = rgb.split(",")
          const r = parseInt(arr[0]) * 0x10000
          const g = parseInt(arr[1]) * 0x100
          const b = parseInt(arr[2])
          return "#" + (0x1000000 + r + g + b).toString(16).slice(1)
        }

      }
    } else state.callback = undefined

    //同步
    store.commit("render_mode", {
      name: "visualization",
      val: state._,
      callback: state.callback,
    })
  }, {
    immediate: true,
    deep: true,
  })
})


</script>

<style lang="scss">
#visualization {
  pointer-events: none;
  position: fixed;
  bottom: 0;
  left: 0;
  @include flip;
}
</style>