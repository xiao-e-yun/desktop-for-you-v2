import { Time, State } from "./types"

export default {
	props:{},
	fetch:{},
	time:{} as Time,
	logs:[],
	spf:0,
	high_ute:{
		_:{},
    old:0,
		length:0,
		callbacks:[],
	},
	visualization:{
		data:[]
	},
	flip:false,
} as State