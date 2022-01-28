import { State } from "@/store/state/types"
import { computed, watch } from "vue"

type Filter<W = keyof State["props"]> =
  (W extends `menu/visualization/${string}` ? W : never)[];
type Keys = Filter[number] extends `menu/visualization/${infer W}` ? W : never;

export default class Bars {
  draw(data: number[]) {
    if (!data.length) return

    const print = (offset: number) => {
      this.ctx.strokeStyle = (this.state.colors as [string, string])[
        offset % 2
      ]
      this.ctx.beginPath()
      let i = this.state.length / 2

      while (i--) {
        const x =
          this.state.margin +
          (i * (this.state.spacing * 2) + offset * this.state.spacing)
        const y = this.state.margin
        const size = data[this.state.draw[i * 2 + offset]]
        const height =
          y + Math.min(size,1) * this.state.level * 250

        this.line(x, y, height)
      }
      this.ctx.stroke()
    }

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    if (this.state.mcolor) print(0), print(1)
    else {
      this.ctx.beginPath()
      let i = this.state.length
      while (i) {
        const x = this.state.margin + --i * this.state.spacing
        const y = this.state.margin
        const size = data[this.state.draw[i]]
        const height =
          y + Math.min(size,1) * this.state.level * 250

        this.line(x, y, height)
      }
      this.ctx.stroke()
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
    console.log("[音效可視化 - Bars] 已銷毀")
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
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
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
    this.unwatch = watch(this.props, (v) => this.change(v), { deep: true, immediate: true })
    console.log("[音效可視化 - Bars] 加載完成")
  }

  private change(props: Record<Keys, string | number | boolean>) {
    const pos: number[] = []
    const total = 128
    const add = total / (props.quantity as number)
    for (let i = 0; Math.ceil(i) <= 127; i += add) pos.push(Math.floor(i))
    const draw = Array.from(new Set(pos)) //去重

    /** 水平 */
    const horizontal = props["type/direction"] === "horizontal"
    type Line = Record<typeof direction,(x:number,y:number,h:number)=>void>
    const direction = props.audio_direction as "up" | "down" | "both"
    this.line = horizontal
      ? ({
        up:(x,y,h)=>{
          this.ctx.moveTo(y, x)
          this.ctx.lineTo(h, x)
        },
        down:(x, y, h) => {
          const width = this.state.width
          this.ctx.moveTo(width - y, x)
          this.ctx.lineTo(width - h, x)
        },
        both:(x, _, h) => {
          const width = this.state.width
          const margin = this.state.margin
          this.ctx.moveTo(width / 2 + h - margin, x)
          this.ctx.lineTo(width / 2 - h + margin, x)
        },
      } as Line)[direction]
      :({
        up:(x, y, h) => {
          const height = this.state.height
          this.ctx.moveTo(x, height - y)
          this.ctx.lineTo(x, height - h)
        },
        down: (x, y, h) => {
          this.ctx.moveTo(x, y)
          this.ctx.lineTo(x, h)
        },
        both:(x, _, h) => {
          const height = this.state.height
          this.ctx.moveTo(x, height / 2 + h - this.state.margin)
          this.ctx.lineTo(x, height / 2 - h + this.state.margin)
        },
      } as Line)[direction]

    const width = props.width as number
    const level = props.amplitude as number
    const alpha = getAlpha(props.alpha as number)
    const spacing = width + (props.spacing as number)

    const left =
      (window.innerWidth / 100) * (this.props.value["pos/left"] as number)
    const top =
      (window.innerHeight / 100) * (this.props.value["pos/top"] as number)

    const mcolor = props.color === 1
    this.state = {
      draw,
      length: draw.length,
      level,
      spacing,
      margin: width / 2,
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
      width: (props.quantity as number) * spacing,
      height: Math.min(level * 250, window.innerHeight - top),
    }

    if (horizontal) {
      const { width, height } = this.state
      this.state.width = height
      this.state.height = width
    }

    switch (props.audio_direction) {
      case "up":
        {
          horizontal || (this.state.top = top - this.state.height)
        }
        break
      case "down":
        {
          horizontal && (this.state.left = left - this.state.width)
        }
        break
      case "both":
        {
          horizontal ?
          (this.state.left = left - this.state.width, this.state.width = this.state.width * 2) :
          (this.state.top = top - this.state.height, this.state.height = this.state.height * 2)
        }
        break
    }

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
  private line = (x: number, y: number, h: number) => {
    this.ctx.moveTo(y, x)
    this.ctx.lineTo(h, x)
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
