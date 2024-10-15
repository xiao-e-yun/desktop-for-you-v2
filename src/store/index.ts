import { defineStore } from 'pinia'
import { RealName } from '@/main'
import state from "./state"
import { Time } from './state/types'

export const useStore = defineStore('main', {
  state: ()=>state,
  
  actions: {

    //
    setProp(
      key: keyof RealName["prop"],
      val: boolean | string | number
    ) {
      switch (key) {
        case "style": {
          this.props[key] &&
            document.body.classList.remove(this.props[key] as string)
          val && document.body.classList.add(val as string)
          break
        }
        case "menu/force_fixed_fps": {
          this.watchUpdate(
            "fixedFps",
            val as boolean,
          )
          break
        }
      }
  
      if(this.props[key] !== val)
        this.props[key] = val
    },

    //取得資料夾
    dirFetch(
      key: keyof RealName["fetch"],
      files: string[]
    ) {
      if (files.length) this.fetch[key] = files
      else delete this.fetch[key]
    },

    //調整FPS
    changeFPS(fps: number) {
      this.spf = 1000 / fps //* second per frame
    },

    //同步時間
    syncTime(reload: boolean = false) {
  
      const now_time = new Date()
      if (Object.keys(this.time).length === 0) reload = true
      const time = this.time
  
      if (reload) console.info("[時間] 強制刷新時間")
  
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
        if (!reload && time[item[0] as keyof Time]) break
      }
    },

    //逐幀更新OR每秒更新
    watchUpdate(
      name?: string,
      val?: boolean,
      callback?: () => void | undefined
    ) {
      const highUTE = this.highUTE

      
      if (name) { //初始化時不觸發
        // 啟用或關閉地定義的特效
        const used = name in highUTE.using
        if (val && !used) highUTE.using[name] = callback
        else if (!val && used) delete highUTE.using[name]
        else return //無視重複
      }

      // 更新Callback列表及長度
      const values = Object.values(highUTE.using)
      highUTE.callbacks = values.filter(Boolean) as (() => void)[]
      highUTE.length = values.length
      this.syncTime(true) //重新同步時間

      //每秒更新
      if (highUTE.length === 0)
        this._syncTimer = setInterval(() => this.syncTime, 100)

      //逐幀更新
      else if (highUTE.old === 0) {
        if (this._syncTimer) clearInterval(this._syncTimer) //清除計時器

        let last = 0 //上次更新時間
        
        //每幀更新函式
        const requestAnimation = (now: number) => {

          if (highUTE.length === 0) return // 停止
          requestAnimationFrame(requestAnimation)

          if (now - last <= this.spf) return
          this.syncTime()

          const callbacks = highUTE.callbacks
          let length = callbacks.length
          while (length) callbacks[--length]()
          last = now

        }

        requestAnimation(0)
        
      }

      //設置上次模式
      highUTE.old = highUTE.length
    },

  }

})