import { createPinia } from 'pinia'
import { useStore } from './store'
import { createApp } from "vue"

import TypesJson from "../types.json"
import builder from "../builder/browser"

import app from "@/app.vue"

const pinia = createPinia()
const store = useStore(pinia)

//cache
const propsCache = JSON.parse(localStorage.getItem("DesktopForYou$PropsCache")||"{}")
store.$state.props = propsCache

addEventListener("beforeunload", beforeunload)

export function beforeunload() {
  localStorage.setItem("DesktopForYou$PropsCache", JSON.stringify(store.props))
}


export type RealName = {
  prop: typeof TypesJson["mapping"];
  fetch: typeof TypesJson["directory"]["fetch"];
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
}

console.info("[初始化] 加載配置生成器")
builder(window, TypesJson, {
  props(key, val) {

    const base = ["$flip", "$wec_brs", "$wec_con", "$wec_hue", "$wec_sa"]
    if (!base.includes(key)) return store.setProp(key, val)

    // 特殊屬性
    const body = document.body

    // 切換翻轉
    if(key as "$flip" === "$flip")
      return body.classList[val as boolean ? "add" : "remove"]("flip")

    // 切換配置
    const name = {
      $wec_brs: "brightness",
      $wec_con: "contrast",
      $wec_hue: "hue-rotate",
      $wec_sa: "saturate",
    }[key as "$wec_brs"]
    filter[name as "brightness"] = val as number
    body.style.filter = filter ? filter?.mixin() : ""
  },
  fetch(key, files) {
    store.dirFetch(key, files)
  },
  general(props) {
    store.changeFPS(props.fps)
  },
  paused(paused) {
    if (!paused) store.syncTime(true)
  },
})

console.info("[初始化] 設置更新模式")
store.watchUpdate() //初始化

console.info("[初始化] 創建軟體")
createApp(app).use(pinia).mount("body")