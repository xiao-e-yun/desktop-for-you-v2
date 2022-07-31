<template lang="pug">
transition(name="popup" appear)
  #console(v-if="props['menu/dev_tools']")
    Drag.item.react_props(:class="{ hide: !show.react_props }")
      p.title 響應式屬性
        small ReactProps
        button(@click="show.react_props = !show.react_props" @mousedown.stop) 一
      main(
        @mousedown.stop
        v-if="show.react_props"
      )
        p(
          v-for="[key,value] in reactProps"
          :key="key"
        ) {{ key }}: {{ value }}


    Drag.item.react_props.global(:class="{ hide: !show.global }")
      p.title 全局響應式屬性
        small GlobalReactProps
        button(@click="show.global = !show.global" @mousedown.stop) 一
      main(
        @mousedown.stop
        v-if="show.global"
      )
        p(
          v-for="(val,index) in global"
          v-html="val"
          :key="index"
        )


    Drag.item.logger(:class="{ hide: !show.logger }")
      p.title 紀錄器
        small Logger
        button(@click="show.logger = !show.logger" @mousedown.stop) 一
      main(
        @mousedown.stop
        v-if="show.logger"
      )
        p(
          v-for="(log,index) in logs"
          :class="log.level"
          :key="index"
        )
          span.time {{ log.time }}
          span.text {{ log.text }}
          span.level {{ log.level }}


    Drag.item.helper(:class="{ hide: !show.helper }")
      p.title 小幫手
        small Helper
        button(@click="show.helper = !show.helper" @mousedown.stop) 一
      main(
        @mousedown.stop
        v-if="show.helper"
      )
        button(@click="clearCache()") 清除快取


    transition(name="popup")
      div.popup(v-if="error")
        h1 需要重啟桌布
        i Need to restart wallpaper
</template>

<script lang="ts" setup>
import { beforeunload } from "@/main";
import { useStore } from "@/store";
import type { Log, State } from "@/store/state/types";
import Drag from "@c/drag.vue";
import { computed, reactive, ref } from "vue";

const store = useStore();
const logs: { level: string; text: string; time: string }[] = store.logs;

const props = store.props;
type props = typeof props;

const global = computed(() => {
  const res: string[] = [];

  const state = store.$state

  for (const key in state)
    if (["props", "logs"].indexOf(key) === -1) {
      let val = state[key as keyof State];
      if (Array.isArray(val))
        val = (val.length > 12
          ? [...val.slice(0, 12), "..."]
          : val) as unknown as Log[];
      res.push(
        key +
          ":&nbsp;" +
          JSON.stringify(val, undefined, 2)
            .replaceAll("\n", "<br>")
            .replaceAll(" ", "&nbsp;")
      );
    }

  return res;
});

const reactProps = computed<[string,string | number | boolean | undefined][]>(()=>Object.keys(props).sort().map(key=>[key,props[key as keyof props]]));

const show = reactive({
  react_props: true,
  helper: true,
  global: true,
  logger: true,
})

const error = ref(false)

function clearCache() {
  localStorage.clear()
  removeEventListener("beforeunload", beforeunload)
  error.value = true
}

console.log("[控制台] 加載完成")
</script>

<style lang="scss" module>
#console {
  @include flip;
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  & > .item {
    will-change: contents;
    pointer-events: auto;
    $offset: 0.6rem;

    margin: $offset;
    color: $main;
    position: absolute;
    background-color: rgba($side-3, 0.6);
    backdrop-filter: blur(6px);

    & > .title {
      z-index: 1;
      padding: 0.2em 0.4em;
      font-size: 1.2em;
      font-weight: bold;
      background-color: $side-2;
      position: absolute;
      width: max-content;
      margin: 0;
      left: -$offset;
      top: -$offset;
      transition-property: color, background-color;
      transition-timing-function: ease;
      transition-duration: 0.2s;

      & > button {
        vertical-align: text-top;
        font-weight: bold;
        background-color: $main;
        border: none;
        color: $bg;
        margin: 0.4em 0 0 1em;
      }

      &:hover {
        cursor: move;
        color: $bg;
        background-color: $main;

        & > button {
          color: $main;
          font-weight: bold;
          background-color: $side-2;

          &:hover {
            background-color: $bg;
          }
        }
      }
    }

    & > main {
      overflow: auto;
      margin: 1.2em 0.8em 0.8em;
      height: calc(100% - 2em);
    }

    &.hide {
      background-color: rgba($side-2, 0);
      height: max-content !important;
      width: max-content !important;
      & > .title {
        margin: 0;
      }
      & > main {
        display: none;
      }
    }

    &.react_props {
      width: 15vw;
      left: 83vw;
      height: 90vh;
      top: 2vh;

      &.global {
        left: 65vw;
      }

      & > main > p {
        width: max-content;
      }
    }

    &.logger {
      width: 40vw;
      left: 2vw;
      height: 30vh;
      top: 2vh;

      & > main {
        margin: 1.2em 0.8em 0.8em;
        transform: scaleY(-100%);
        height: calc(100% - 2em);
        & > p {
          transform: scaleY(-100%);
          display: inline-flex;
          justify-content: space-between;
          width: 100%;

          & > span {
            &.text {
              width: 96%;
              word-break: break-word;
              margin: 0 2%;
            }
            &.level,
            &.time {
              width: max-width;
            }
          }

          &.debug {
            color: #96b4ff;
          }
          &.warn {
            color: rgb(255, 180, 80);
          }
          &.error {
            color: rgb(255, 60, 60);
          }
        }
      }
    }

    &.helper {
      width: 30vw;
      left: 2vw;
      height: 30vh;
      top: 62vh;

      & > main {
        margin: 2em 0.8em 0.8em;
        button {
          margin: 0.4em;
          padding: 0.2em 0.4em;
          font-size: 1.2em;
          font-weight: bold;
          color: $side-1;
          background-color: $side-3;
          border: none;
          cursor: pointer;
          transition-property: color, background-color;
          transition-timing-function: ease;
          transition-duration: 0.2s;

          &:hover {
            color: $bg;
            background-color: $main;
          }
        }
      }
    }
  }

  & > .popup {
    z-index: 1;
    color: $main;
    position: fixed;
    top: -25vh;
    width: 100vw;
    height: 150vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: rgba(#000, 0.4);
    backdrop-filter: blur(2em);

    h1 {
      font-size: 4em;
      font-weight: bold;
      margin: 0;
    }
    i {
      font-style: normal;
      font-weight: bold;
      font-size: 2em;
    }
  }
}
</style>