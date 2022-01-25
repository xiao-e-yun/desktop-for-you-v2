import { store, key as store_key } from "@/store"
import { createApp, watch } from "vue"

// 快取資料
const cache = JSON.parse(
  localStorage.getItem("DesktopForYou$PropsCache") || "{}"
)
type State = typeof store.state;
type Key = keyof State;
for (const key in cache) (store.state[key as Key] as State[Key]) = cache[key]

if (!(import.meta.env.MODE === "development"))
  (($console: Console) => {
    function timeline() {
      const time = new Date()
      const fixed = (num: number, pad = 2): string =>
        num.toString().padStart(pad, "0")
      return `${fixed(time.getHours())}:${fixed(time.getMinutes())}:${fixed(
        time.getSeconds()
      )}:${fixed(time.getMilliseconds(), 3)}`
    }
    type console_type = "debug" | "info" | "log" | "warn" | "error";
    function log(level: console_type, ...args: unknown[]) {
      const arg = args
        .map((e) => (typeof e === "object" ? JSON.stringify(e) : e))
        .join(" ")
      $console[level](arg)
      store.commit("_log", {
        level,
        time: timeline(),
        text: arg,
      })
    }

    /* eslint-disable */
    const nomal = {
      ...$console,
      log() {}, // eslint-disable-line
      warn() {}, // eslint-disable-line
      info() {}, // eslint-disable-line
      debug() {}, // eslint-disable-line
      error() {}, // eslint-disable-line
      clear() {}, // eslint-disable-line
    }
    /* eslint-enable */

    const dev = {
      ...$console,
      debug(...args: unknown[]) {
        log("debug", ...args)
      },
      info(...args: unknown[]) {
        log("info", ...args)
      },
      log(...args: unknown[]) {
        log("log", ...args)
      },
      warn(...args: unknown[]) {
        log("warn", ...args)
      },
      error(...args: unknown[]) {
        log("error", ...args)
      },
      clear() {
        store.commit("_log")
        $console.clear()
      },
    }

    watchFn(store.state.props["menu/dev_tools"] as boolean)
    watch(
      () => store.state.props["menu/dev_tools"],
      (v) => watchFn(v as boolean),
    )
    function watchFn(v: boolean){
      if (v) {
        window.console = dev
        console.debug("[開發者模式] 正在紀錄中")
      } else {
        console.clear()
        window.console = nomal
      }
    }
  })(window.console)
//
import builder from "../builder/browser"
import types_json from "../types.json"
import app from "@/app.vue"


export type RealName = {
  prop: typeof types_json["mapping"];
  fetch: typeof types_json["directory"]["fetch"];
};

console.info("[初始化] 創建效果配置")
const filter = {
  "hue-rotate": 1,
  brightness: 1,
  contrast: 1,
  saturate: 1,
  mixin() {
    return (
      (this.contrast !== 1 ? `contrast(${this.contrast / 50}) ` : "") +
      (this.brightness !== 1 ? `brightness(${this.brightness / 50}) ` : "") +
      (this.saturate !== 1 ? `saturate(${this.saturate / 50}) ` : "") +
      (this["hue-rotate"] !== 1
        ? `hue-rotate(${(this["hue-rotate"] - 50) * 3.6}deg)`
        : "")
    )
  },
  flip: false,
}
console.info("[初始化] 加載配置生成器")
builder(window, types_json, {
  props(key, val) {
    const base = ["$flip", "$wec_brs", "$wec_con", "$wec_hue", "$wec_sa"]
    if (!base.includes(key)) return store.commit("set_prop", { key, val })

    const name = {
      $flip: "flip",
      $wec_brs: "brightness",
      $wec_con: "contrast",
      $wec_hue: "hue-rotate",
      $wec_sa: "saturate",
    }[key as "$flip"] as "flip"
    type Val = number | boolean;
    (filter as unknown as Record<string, Val>)[name] = val as Val

    const body = document.body
    body.classList[filter?.flip ? "add" : "remove"]("flip")
    body.style.filter = filter ? filter?.mixin() : ""
    if (name === "flip") store.commit(name, val)
  },
  fetch(key, files) {
    store.commit("dir_fetch", { key, files })
  },
  general(props) {
    store.commit("sync_time", props.fps)
  },
})

console.info("[初始化] 設置更新模式")
store.commit("render_mode")

console.info("[初始化] 創建軟體")
createApp(app).use(store, store_key).mount("body")
