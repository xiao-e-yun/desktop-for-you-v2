import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

import { State } from './state/types'
import state from './state'

import mutations from './mutations'

export const store = createStore<State>({
  state,
  mutations,
})

export const key: InjectionKey<Store<State>> = Symbol()
export const use_store = ()=>baseUseStore(key)