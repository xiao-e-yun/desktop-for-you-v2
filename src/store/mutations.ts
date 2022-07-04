import { RealName } from "@/main"
import { MutationTree } from "vuex"
import { store } from "."
import { Time, Log, State } from "./state/types"

export default {
  set_prop(
    state,
    edit: { key: keyof RealName["prop"]; val: boolean | string | number }
  ) {
    const { key, val } = edit
    switch (key) {
      case "style": {
        state.props[key] &&
          document.body.classList.remove(state.props[key] as string)
        val && document.body.classList.add(val as string)
        break
      }
      case "menu/force_fixed_fps": {
        store.commit("render_mode", {
          name: "fixed_fps",
          val,
        })
        break
      }
    }

    state.props[key] = val
  },
  dir_fetch(state, edit: { key: keyof RealName["fetch"]; files: string[] }) {
    if (edit.files.length) state.fetch[edit.key] = edit.files
    else delete state.fetch[edit.key]
  },
  sync_time(state, reload_or_fps: boolean | number = false) {
    if (typeof reload_or_fps === "number")
      return (state.spf = 1000 / reload_or_fps) //* second per frame

    const now_time = new Date()
    if (Object.keys(state.time).length === 0) reload_or_fps = true
    const time = state.time

    if (reload_or_fps) console.info("[時間] 強制刷新時間")

    // 更新時間
    time.time = now_time.getTime()
    for (const item of [
      ["second", "getSeconds"], // 秒
      ["minute", "getMinutes"], // 分
      ["hour", "getHours"], // 時
      ["date", "getDate"], // 日
      ["month", "getMonth"], // 月
    ]) {
      time[item[0] as "second"] = now_time[item[1] as "getSeconds"]()
      if (item[0] === "date") time.day = now_time.getDay() //額外更新星期
      if (!reload_or_fps && time[item[0] as keyof Time]) break
    }
  },
  render_mode(
    state,
    set?: {
      name: string;
      val: boolean;
      callback?: () => void | undefined;
    }
  ) {
    const highUTE = state.high_ute
    if (set) {
      const name = set.name
      const used = name in highUTE._
      if (set.val && !used) highUTE._[name] = set.callback
      else if (!set.val && used) delete highUTE._[name]
      else return //無視重複
    }
    highUTE.length = Object.keys(highUTE._).length
    highUTE.callbacks = Object.values(highUTE._).filter(
      Boolean
    ) as (() => void)[]
    store.commit("sync_time", true)

    if (highUTE.length === 0)
      state._sync_timer = setInterval(() => store.commit("sync_time"), 100)
    else if (highUTE.old === 0) {
      if (state._sync_timer) clearInterval(state._sync_timer)

      let last = 0
      const request_animation = (id: number) => {
        if (highUTE.length === 0) return // 停止
        requestAnimationFrame(request_animation)
        const now = performance.now()
        if (now - last <= state.spf) return cancelAnimationFrame(id)
        store.commit("sync_time")

        const callbacks = highUTE.callbacks
        let length = callbacks.length
        while (length) callbacks[--length]()
        last = now
      }
      requestAnimationFrame(request_animation)
    }
    highUTE.old = highUTE.length
  },
  audio(state, data: number[]) {
    state.visualization.data = data
  },
  flip(state, flip: boolean) {
    state.flip = flip
  },
  _log(state, log?: Log) {
    if (log) state.logs.unshift(log)
    else {
      let length = state.logs.length
      while (length--) state.logs.pop()
    }
  },
} as MutationTree<State>
