<template lang="pug">
transition(name="popup" appear): .panel(
  v-if="props[$props.name]"
  :style="style"
  :class="{dev:props['menu/dev_tools']}"
)
  small.panel-id(v-if="props['menu/dev_tools']") {{ $props.name }}
  slot
</template>

<script lang="ts" setup>
import { use_store } from "@/store";
import { computed, StyleValue } from "vue";

const $props = defineProps<{
  name: keyof typeof props;
  drop_shadow?: boolean;
}>();

const props = use_store().state.props;
function $(prop: string) {
  return props[($props.name + "/" + prop) as keyof typeof props];
}
const style = computed(() => {
  const background = (() => {
    if ($("bg/opacity") === 0) return;
    let res = "";
    res += `rgba(${$("bg/color")},${($("bg/opacity") as number) / 100})`;
    res += ((url) => (url ? ` url("${url}")` : ""))($("bg/img"));
    return res;
  })();

  const border =
    !$("border/width") && !$("border/opacity")
      ? undefined
      : $("border/width") +
        `px solid rgba(${$("border/color")},${
          ($("border/opacity") as number) / 100
        })`;

  const Shadow = (() => {
    const name = ($props.drop_shadow ? "drop_shadow" : "shadow") + "/";
    const fx =
      !$(name + "width") && !$(name + "opacity")
        ? undefined
        : `0 0 ${$(name + "width")}px rgba(${$(name + "color")},${
            ($(name + "opacity") as number) / 100
          })`;

    if (!fx) return;
    else if (background === undefined || $props.drop_shadow)
      return { filter: `drop-shadow(${fx})` };
    else return { boxShadow: fx };
  })();

  return {
    ...{
      border,
      ...Shadow,
      background,
      top: $("pos/top") + "%",
      left: $("pos/left") + "%",
      fontSize: $("size") + "px",
      backdropFilter: `blur(${$("bg/blur")}px)`,
      borderRadius: $("radius") + "px",
    },
    ...{
      "--color": $("color") ? $("color") : null,
      "--border":
        props["menu/dev_tools"] && border ? $("border/width") + "px" : null,
    },
  } as StyleValue;
});
</script>

<style lang="scss">
@include style("neon") {
  & .panel * {
    font-weight: 600;
    text-shadow: 0 0 0.6em rgba(var(--color), 0.65);
    font-family: "neon", "Microsoft JhengHei";
  }
}

.panel {
  pointer-events: none;
  color: rgb(var(--color));
  & * {
    font-family: "whitrabt", "Microsoft JhengHei";
  }

  position: fixed;
  white-space: nowrap;
  width: max-content;

  &.dev {
    & > .panel-id {
      font-family: "whitrabt", "Microsoft JhengHei" !important;
      text-shadow: none;
      position: absolute;
      display: block;
      color: $side-1;
      font-size: 12px;
      padding: 4px;
      top: 0;
      left: 0;
      z-index: 1;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      border-style: solid;
      border-width: 1px;
      filter: drop-shadow(0 0 2px #fff);
    }
    &::before {
      border-color: rgb(255, 120, 100);
      height: 200vh;
      width: calc(100% + (var(--border) * 2) - 2px);
      top: -100vh;
      left: calc(var(--border) * -1);
    }
    &::after {
      border-color: rgb(100, 120, 255);
      height: calc(100% + (var(--border) * 2) - 2px);
      width: 200vw;
      left: -100vw;
      top: calc(var(--border) * -1);
    }
  }
}
</style>
