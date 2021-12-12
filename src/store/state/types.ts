import { RealName } from '@/main'

export interface State {
  /** 桌布屬性 */
  props:Partial<Record<keyof RealName["prop"], boolean | string | number>>
  fetch:Partial<Record<keyof RealName["fetch"], string[]>>
  /** second per frame PS.FPS的相反 */
  spf:number
  /** 系統時鐘 */
  time:Time
  /** 紀錄器 */
  logs:Log[]
  /** 高使用率(啟用特效時) */
  high_ute:{
    _:{[key:string]:(()=>void)|undefined},
    callbacks:(()=>void)[]
    length:number
  }
  /** 音效可視化 */
  visualization:{
    data: number[]
  },
  /** 同步計時器 */
  _sync_timer?:NodeJS.Timer
  /** 效果 */
  flip:boolean
  /** 開發者模式 */
  dev:boolean
}



export type Time = {
  /** 時間戳 */
  time: number
  /** 星期 */
  day:number
  /** 月 */
  month:number
  /** 日 */
  date:number
  /** 時 */
  hour:number
  /** 分 */
  minute:number
  /** 秒 */
  second:number
}

export type Log = {
  level: string,
  time: string,
  text: string
}