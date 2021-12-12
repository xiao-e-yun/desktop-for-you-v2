import { createApp, reactive } from 'vue'
import builder from '../builder/browser'
import types_json from "../types.json"
import { store, key as store_key } from '@/store'
import App from '@/app.vue'

if(!store.state.dev) (($console: Console) => {
  function timeline() {
    const time = new Date()
    const fixed = (num: number, pad: number = 2): string => num.toString().padStart(pad, '0')
    return `${fixed(time.getHours())}:${fixed(time.getMinutes())}:${fixed(time.getSeconds())}:${fixed(time.getMilliseconds(), 3)}`
  }
  
  type console_type = "debug"|"info"|"log"|"warn"|"error"
  function log(level:console_type, ...args: any[]) {
    $console[level](...args)
    store.commit("_log",{
      level,
      time: timeline(),
      text: args.join(" ")
    })
  }

  window.console = {
    ...$console,
    debug(...args: any[]) { log("debug", ...args) },
    info(...args: any[]) { log("info", ...args) },
    log(...args: any[]) { log("log", ...args) },
    warn(...args: any[]) { log("warn", ...args) },
    error(...args: any[]) { log("error", ...args) },
    clear() {
      store.commit("_log")
      $console.clear()
    },
  }
})(window.console)


export type RealName = {
  prop: typeof types_json["mapping"],
  fetch: typeof types_json["directory"]["fetch"],
}

const cache = JSON.parse(localStorage.getItem("DesktopForYou$PropsCache") || '{}')
type State = typeof store.state
type Key = keyof State;
for (const key in cache) (store.state[key as Key] as State[Key]) = cache[key]

const filter = {
  "hue-rotate": 1,
  brightness: 1,
  contrast: 1,
  saturate: 1, 
  mixin(){
    return (this.contrast !== 1 ? `contrast(${this.contrast/50}) `: "") + 
      (this.brightness !== 1 ? `brightness(${this.brightness/50}) ` : "") +
      (this.saturate !== 1 ? `saturate(${this.saturate/50}) ` : "") +
      (this['hue-rotate'] !== 1 ? `hue-rotate(${(this['hue-rotate'] - 50) * 3.6}deg)` : "")
  },
  flip: false,
}
builder(window, types_json, {
  props(key, val) {
    const base = ["$flip","$wec_brs","$wec_con","$wec_hue","$wec_sa"]
    if(!base.includes(key)) return store.commit('set_prop', { key, val })

    
    const name = {
      "$flip": "flip",
      "$wec_brs": "brightness",
      "$wec_con": "contrast",
      "$wec_hue": "hue-rotate",
      "$wec_sa": "saturate",
    }[key as "$flip"] as "flip"
    type Val = number | boolean;
    (filter as unknown as Record<string,Val>)[name] = val as Val
    
    const body = document.body
    body.classList[filter?.flip?"add":"remove"]("flip")
    body.style.filter = filter ? filter?.mixin() : ""
    if(name==="flip") store.commit(name,val)
  },
  fetch(key,files) {
    store.commit('dir_fetch', { key, files })
  },
  general(props) {
    store.commit("sync_time", props.fps)
  },
})

store.commit("render_mode")

createApp(App)
  .use(store, store_key)
  .mount('body')