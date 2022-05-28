<template lang="pug">
Background

Sakura

Visualization

Clock
Date
Logo

Console
</template>

<script lang="ts" setup>
import Visualization from '@/visualization/index.vue';
import Background from '@c/background.vue';
import Console from '@c/console.vue'
import Clock from '@p/clock.vue';
import Date from '@p/date.vue';
import Logo from '@p/logo.vue';
import Sakura from '@f/sakura.vue';
</script>

<style lang="scss">
body {
  font-family: "Arial" "Microsoft JhengHei";
  overflow: hidden;
  margin: 0;
  height: 100vh;
  width: 100vw;
  color: $main;

  &.flip {
    transform: scaleX(-100%);
  }
}
</style>
<style src="@/root.scss" />