import { State } from "@/store/state/types"
import { computed, nextTick, watch } from "vue"

type Filter<W = keyof State["props"]> =
  (W extends `menu/visualization/${string}` ? W : never)[];
type Keys = Filter[number] extends `menu/visualization/${infer W}` ? W : never;

export default class Bars {
  draw(data: number[]) {
    if (!data.length) return

    const print = (offset: number, angle: number, length: number) => {
      this.ctx.strokeStyle = (this.state.colors as [string, string])[
        offset % 2
      ]
      this.ctx.beginPath()
      let i = length
      while (i--) {
        const y = this.state.spacing
        const size = data[this.state.draw[i * 2 + offset]]
        const w = sineOut(size < 1 ? size : 1) * this.state.level
        
        this.line(y, w)
        this.ctx.rotate(angle)
      }
      this.ctx.stroke()
    }

    const w = this.state.width
    const x = -w / 2
    this.ctx.clearRect(x, x, w, w)
    if (this.state.mcolor) {
      const length = this.state.length / 2
      const angle = (Math.PI * 2) / length
      this.ctx.rotate(-angle / 2)
      print(0, angle, length)
      this.ctx.rotate(angle / 2)
      print(1, angle, length)
    } else {
      this.ctx.beginPath()
      let i = this.state.length
      const angle = (Math.PI * 2) / i
      while (i--) {
        const y = this.state.spacing
        const size = data[this.state.draw[i]]
        const w = sineOut(size < 1 ? size : 1) * this.state.level

        this.line(y, w)
        this.ctx.rotate(angle)
      }
      this.ctx.stroke()
    }

    function sineOut(t: number) {
      return Math.sin((t * Math.PI) / 2)
    }
  }
  destroy() {
    this.unwatch()
    const exit = (this as unknown as {
      ctx: undefined;
      props: undefined;
      state: undefined;
      change: undefined;
      unwatch: undefined;
    })
    exit.ctx = undefined
    exit.props = undefined
    exit.state = undefined
    exit.change = undefined
    exit.unwatch = undefined
    console.log("[音效可視化 - Circles] 已銷毀")
  }
  constructor(
    props: State["props"],
    ctx: CanvasRenderingContext2D,
    onChanged: (
      props: Record<Keys, string | number | boolean>,
      state: Bars["state"]
    ) => void
  ) {
    this.ctx = ctx
    this.props = computed(() => {
      const keys = Object.keys(props)
      const filter = keys.filter((k) =>
        k.startsWith("menu/visualization/")
      ) as Filter
      return (() => {
        const res: Partial<Record<Keys, string | number | boolean>> = {}
        for (const k of filter) res[k.slice(19) as Keys] = props[k]
        return res
      })() as Record<Keys, string | number | boolean>
    })
    this.onChanged = onChanged
    this.unwatch = watch(this.props, (v) => this.change(v), {
      deep: true,
      immediate: true,
    })
    console.log("[音效可視化 - Circles] 加載完成")
  }
  private change(props: Record<Keys, string | number | boolean>) {
    const pos: number[] = []
    const total = 128
    const add = total / (props.quantity as number)
    for (let i = 0; Math.ceil(i) <= 127; i += add) pos.push(Math.floor(i))
    const draw = Array.from(new Set(pos)) //去重

    type Line = Record<typeof direction, (d: number, h: number) => void>;
    const direction = props.audio_direction as "up" | "down" | "both"
    this.line = (
      {
        up: (d, h) => {
          this.ctx.moveTo(d, 0)
          this.ctx.lineTo(d + h, 0)
        },
        down: (d, h) => {
          const move = d - h >= margin ? d - h: margin
          this.ctx.moveTo(move, 0)
          this.ctx.lineTo(d, 0)
        },
        both: (d, h) => {
          const move = d - h >= 0 ? d - h: 0
          this.ctx.moveTo(move, 0)
          this.ctx.lineTo(d + h, 0)
        },
      } as Line
    )[direction]

    const lineWidth = props.width as number
    const margin = lineWidth / 2
    const level = props.amplitude as number * 250
    const alpha = getAlpha(props.alpha as number)
    const spacing = props.spacing as number * 100

    const diameter = spacing * 2 + level
    const left =
      window.innerWidth / 100 * (this.props.value["pos/left"] as number) - diameter / 2
    const top =
      window.innerHeight / 100 * (this.props.value["pos/top"] as number) - diameter / 2

    const mcolor = props.color === 1
    this.state = {
      draw,
      length: draw.length,
      level,
      spacing,
      margin,
      mcolor,
      alpha,
      colors: (() => {
        if (mcolor)
          return [
            hex(props["color/one-color"] as string) + alpha,
            hex(props["color/two-color"] as string) + alpha,
          ]
      })(),
      left,
      top,
      width: diameter,
      height: diameter,
    }

    nextTick(() => {
      const hw = diameter / 2
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.translate(hw, hw)
    })

    this.onChanged(props, this.state)

    function getAlpha(alpha: number) {
      return (0x100 + alpha * 2.55).toString(16).slice(1, 3)
    }
    function hex(rgb: string) {
      const arr = rgb.split(",")
      const r = parseInt(arr[0]) * 0x10000
      const g = parseInt(arr[1]) * 0x100
      const b = parseInt(arr[2])
      return "#" + (0x1000000 + r + g + b).toString(16).slice(1)
    }
  }
  private line = (d: number, h: number) => {
    this.ctx.moveTo(d, 0)
    this.ctx.lineTo(d + h, 0)
  }
  private ctx
  private props
  private state = {
    length: 0,
    draw: [] as number[],
    level: 1,
    margin: 1,
    spacing: 1,
    mcolor: false,
    colors: undefined as undefined | [string, string],
    height: 0,
    width: 0,
    top: 0,
    left: 0,
    alpha: "ff",
  }
  private onChanged
  private unwatch
}
