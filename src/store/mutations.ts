import { RealName } from "@/main"
import { MutationTree } from "vuex"
import { store } from "."
import { Time, Log, State } from "./state/types"

export default {
	set_prop(state, edit: { key: keyof RealName["prop"], val: boolean | string | number }) {
		const { key, val } = edit
		switch (key) {
		case "style": {
			state.props[key] && document.body.classList.remove(state.props[key] as string)
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
	dir_fetch(state,edit:{key:keyof RealName["fetch"],files:string[]}){
		if(edit.files.length) state.fetch[edit.key] = edit.files
		else delete state.fetch[edit.key]
	},
	sync_time(state, reload: boolean | number = false) {
		if (typeof reload === "number") return state.spf = 1000 / reload //* second per frame


		const now_time = new Date()
		if (Object.keys(state.time).length === 0) reload = true
		const time = state.time

		// 更新時間
		time.time = now_time.getTime()
		for (const item of [
			["second", "getSeconds"], // 秒
			["minute", "getMinutes"], // 分
			["hour", "getHours"], // 時
			["date", "getDate"], // 日
			["month", "getMonth"], // 月
		]) {
			time[item[0] as keyof Time] = now_time[item[1] as "getDate"/*無視*/]()
			if (item[0] === "date") time.day = now_time.getDay()
			if (!reload && time[item[0] as keyof Time]) return
		}
	},
	render_mode(state, set?: {
    name: string,
    val: boolean,
    callback?: () => void | undefined,
  }) {
		const high_ute = state.high_ute
		if (set) {
			const name = set.name
			const used = name in high_ute._
			if (set.val && !used) high_ute._[name] = set.callback
			else if (!set.val && used) delete high_ute._[name]
			else return //無視重複
		}
		high_ute.length = Object.keys(high_ute._).length
		high_ute.callbacks = Object.values(high_ute._).filter(Boolean) as (() => void)[]
		store.commit("sync_time", true)

		if (Object.keys(high_ute).length === 0) state._sync_timer = setInterval(() => store.commit("sync_time"), 100)
		else {
			if (state._sync_timer) clearInterval(state._sync_timer)

			let last = 0
			const request_animation = (id: number)=>{
				if (!state.high_ute.length) return // 停止
				requestAnimationFrame(request_animation)
				const now = performance.now()
				if ((now - last) <= state.spf) return cancelAnimationFrame(id)
				store.commit("sync_time")

				const callbacks = high_ute.callbacks
				let length = callbacks.length
				while(length) callbacks[--length]()
				last = now
			}
			requestAnimationFrame(request_animation)

		}
	},
	audio(state,data:number[]){ state.visualization.data = data },
	flip( state, flip:boolean){ state.flip = flip },
	_log(state, log?: Log) {
		if (log) state.logs.unshift(log)
		else {
			let length = state.logs.length
			while (length--) state.logs.pop()
		}
	},
} as MutationTree<State>