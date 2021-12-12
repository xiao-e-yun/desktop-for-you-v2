import { Store } from 'vuex'
import { State } from "."

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}