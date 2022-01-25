<template lang="pug">
div(
  :style="style"
  ref="el"
  @mousedown="mousedown"
)
  slot
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Drag',
  data() {
    return {
      style: {
        margin: "",
        left: "",
        top: "",
      },
      move: {
        x: -1,
        y: -1,
        offset_x: 0,
        offset_y: 0,
        height: 0,
        width: 0,
      },
    }
  },
  methods: {
    mousedown(e: MouseEvent) {
      this.move = {
        x: e.clientX,
        y: e.clientY,
        offset_x: e.offsetX,
        offset_y: e.offsetY,
        height: (this.$refs.el as HTMLDivElement).offsetHeight,
        width: (this.$refs.el as HTMLDivElement).offsetWidth,
      }

      this.moving(e)
      window.addEventListener("mousemove", this.moving, {
        capture: false,
        passive: true,
      })
      
      window.addEventListener("mouseup", (e: MouseEvent) => {
        const left = e.clientX - this.move.offset_x
        const top = e.clientY - this.move.offset_y
        const win_width = window.innerWidth
        const win_height = window.innerHeight
        const { width, height } = this.move

        this.style.left = (
          left < 0 ? 0 :
            (left + width) > win_width ? win_width - width : left
        ).toString() + "px"
        this.style.top = (
          top < 0 ? 0 :
            (top + height) > win_height ? win_height - height : top
        ).toString() + "px"

        window.removeEventListener("mousemove", this.moving)
      }, {
        capture: false,
        passive: true,
        once: true,
      })
    },
    moving(e: MouseEvent) {
      const left = e.clientX - this.move.offset_x
      const top = e.clientY - this.move.offset_y

      this.style.left = left.toString() + "px"
      this.style.top = top.toString() + "px"
    }
  },
})
</script>