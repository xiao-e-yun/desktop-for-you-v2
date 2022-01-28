<template lang="pug">
transition(name="popup" appear): canvas#visualization(
  ref="node"
  :width="width"
  :height="height"
  :style="style"
  v-show="state._"
)
</template>

<script lang="ts" setup>
import { reactive, ref, CSSProperties, watch, nextTick } from "vue";
import { use_store } from "@/store";
import bars from "./bars";
import circles from "./circles";

let width = ref(window.innerWidth);
let height = ref(window.innerHeight);

const node = ref<HTMLCanvasElement>();
const style = reactive({}) as CSSProperties;

const store = use_store();
const props = store.state.props;

const state = reactive({
  _: props["menu/visualization"],
  old: -1,
  props: {} as { [key: string]: unknown },
});

console.info("[音效可視化] 等待節點渲染");
const stop = watch(node, () => {
  if (!node.value) return;
  stop();

  console.info("[音效可視化] 取得畫布上下文");
  const ctx = node.value.getContext("2d") as CanvasRenderingContext2D;
  let serve: bars | circles;
  watch(
    props,
    (_) => {
      state._ = _["menu/visualization"];
      const mode = _["menu/visualization/type"];
      if (state._ && mode !== state.old) {
        if(serve) serve.destroy();
        state.old = mode as number;
        serve = new [bars, circles][_["menu/visualization/type"] as number](
          props,
          ctx,
          (props, state) => {
            height.value = state.height;
            width.value = state.width;

            // 陰影
            style.filter = `drop-shadow(0 0 ${props["shadow/blur"]}px ${
              hex(props["shadow/color"] as string) +
              getAlpha(props["shadow/alpha"] as number)
            })`;
            style.top = state.top + "px";
            style.left = state.left + "px";

            nextTick(() => {
              // 調整長寬 ctx會重置
              ctx.lineWidth = props.width as number;
              ctx.lineCap = props.cap as CanvasLineCap;
              ctx.strokeStyle =
                hex(props["color/color"] as string) + state.alpha;
            });

            function getAlpha(alpha: number) {
              return (0x100 + alpha * 2.55).toString(16).slice(1, 3);
            }
            function hex(rgb: string) {
              const arr = rgb.split(",");
              const r = parseInt(arr[0]) * 0x10000;
              const g = parseInt(arr[1]) * 0x100;
              const b = parseInt(arr[2]);
              return "#" + (0x1000000 + r + g + b).toString(16).slice(1);
            }
          }
        );
      }
      if (!serve) return;

      let id = 0;
      type Window = {
        wallpaperRegisterAudioListener(
          callback: (data: number[]) => void
        ): void;
      };
      (window as unknown as Window).wallpaperRegisterAudioListener(
        state._
          ? (d) => {
              ++id > 100 && (id = 0);
              const right = d.splice(64,128).reverse()        
              store.commit("audio", d.concat(right));
            }
          : () => {}
      );

      store.commit("render_mode", {
        name: "visualization",
        val: state._,
        callback: state._ ? () => serve.draw(store.state.visualization.data) : () => {},
      });
    },
    { deep: true, immediate: true }
  );
});
</script>

<style lang="scss">
#visualization {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
