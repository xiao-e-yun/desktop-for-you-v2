import { Time, State } from "./types";

export default {
  props:{},
  fetch:{},
  time:{} as Time,
  logs:[],
  spf:0,
  high_ute:{
    _:{},
    length:0,
    callbacks:[],
  },
  visualization:{
    data:[]
  },
  flip:false,
  dev:(()=>import.meta.env.MODE === 'development' && (console.log("開發者模式") as undefined || true))(),
} as State