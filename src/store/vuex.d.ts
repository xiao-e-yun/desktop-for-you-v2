import { Store } from "vuex"
import { State } from "./state/types"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}