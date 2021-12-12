<x-template>
</x-template>

<template lang="pug">

transition(name="popup" appear)
  #console(v-if="props['menu/dev_tools']")
    Drag.item.react_props(:class="{ hide: !show.react_props }")
      p.title 響應式屬性
        small ReactProps
        button(@click="show.react_props = !show.react_props" @mousedown.stop) 一
      main(@mousedown.stop)
        p(
          v-for="(key,i) in Object.keys(props).sort()"
          :key="key"
        ) {{ key }}: {{ props[key as keyof props] }}


    Drag.item.react_props.global(:class="{ hide: !show.global }")
      p.title 全局響應式屬性
        small GlobalReactProps
        button(@click="show.global = !show.global" @mousedown.stop) 一
      main(@mousedown.stop)
        p(
          v-for="(val,index) in global"
          v-html="val"
          :key="index"
        )


    Drag.item.logger(:class="{ hide: !show.logger }")
      p.title 紀錄器
        small Logger
        button(@click="show.logger = !show.logger" @mousedown.stop) 一
      main(@mousedown.stop)
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
      main(@mousedown.stop)
        button(@click="clear_cache()") 清除快取


    transition(name="popup")
      div.popup(v-if="error")
        h1 需要重啟桌布
        i Need to restart wallpaper
</template>

<script lang="ts" setup>
import { store, use_store } from '@/store';
import { State } from '@/store/state/types';
import Drag from '@c/drag.vue';

const state = use_store().state
const logs:{ level: string; text: string; time: string }[] = store.state.logs

const props = state.props
type props = typeof props

const global = computed(()=>{
  const res: any[] = []

  function decode(val: any, index = 0): string {
    switch (typeof val) {
      case "number":
      case "string":
      case "boolean":
        return val.toString()
      case 'object':
        let props = ""
        const space = "&emsp;".repeat(++index)
        for (const key in val) if (val.hasOwnProperty(key)) props += `${space}${key}: ${decode(val[key], index)}<br>`
        return "<br>" + props
      default:
        return "<i>"+typeof val+"</i>"
    }
  }

  for (const key in state)
    if ([
      "props",
      "logs",
    ].indexOf(key)===-1)
      res.push(key + ": " + decode(state[key as keyof typeof state]))

  return res
})
</script>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      hot_reload: {
        timer: undefined as unknown as NodeJS.Timer,
        text: "",
      },
      error: false,
      show: {
        react_props: true,
        global: true,
        logger: true,
        helper: true,
      }
    }
  },
  methods: {
    clear_cache() {
      localStorage.removeItem("DesktopForYou$PropsCache")
      window.removeEventListener("beforeunload", this.before_unload)
      this.error = !this.error
    },
    before_unload() {
      const save = [
        "props",
        "fetch",
        "fps",
      ]

      const saved = {} as {[key:string]:any}
      for (const key in this.$store.state) {
        if (save.indexOf(key)===-1) continue
        type key = keyof State
        saved[key] = this.$store.state[key as key]
      }

      localStorage.setItem("DesktopForYou$PropsCache", JSON.stringify(saved))
    },
  },
  mounted() {

    window.addEventListener('beforeunload', this.before_unload)


    store.watch(
      (e) => e.props['menu/dev_tools'], async (e) => {
        if (e) {
          if (!this.hot_reload.text) this.hot_reload.text = await get()
          this.hot_reload.timer = setInterval(async () => {
            if (this.hot_reload.text !== (await get() || this.hot_reload.text)) location.reload()
          }, 1500)
        }
        else if (this.hot_reload.timer !== undefined)
          clearInterval(this.hot_reload.timer)


        function get(): Promise<string> {
          return new Promise((resolve) => {
            const xml_http = new XMLHttpRequest();
            xml_http.onreadystatechange = function () { if (xml_http.readyState === 4) resolve(xml_http.responseText) }
            xml_http.open("GET", "index.html")
            xml_http.send(null)
          })
        }
      }
      , { immediate: true, })
  },
})
</script>

<style lang="scss">
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

      & > main{
        margin: 1.2em .8em .8em;
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