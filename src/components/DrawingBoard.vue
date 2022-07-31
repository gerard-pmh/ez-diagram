<script lang="ts" setup>
import type { Ref } from "vue";
import { onMounted, ref } from "vue";

import { useMode } from "@/composables/use-mode";
import { DiagramRenderer } from "@/diagram/diagram-renderer";

const canvas: Ref<HTMLCanvasElement | undefined> = ref();
const input: Ref<HTMLInputElement | undefined> = ref();
let diagramRenderer: DiagramRenderer;

onMounted(async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  diagramRenderer = new DiagramRenderer(canvas.value!);
});

const { mode } = useMode();

let itemId1: number | undefined;
let itemId2: number | undefined;
const handleMouseDown = (event: MouseEvent) => {
  isMouseDown.value = true;
  switch (mode.value) {
    case "normal":
      itemId1 =
        diagramRenderer.intersectCorners(event.clientX, event.clientY) ??
        diagramRenderer.intersectBorders(event.clientX, event.clientY);
      if (itemId1) {
        diagramRenderer.diagram.unselectAll();
        diagramRenderer.diagram.selectItem(itemId1);
        diagramRenderer.render();
        mode.value = "resize";
      } else {
        itemId1 = diagramRenderer.intersect(event.clientX, event.clientY);
        if (itemId1) {
          diagramRenderer.diagram.unselectAll();
          diagramRenderer.diagram.selectItem(itemId1);
          diagramRenderer.render();
          mode.value = "selected";
        }
      }
      break;
    case "selected":
      diagramRenderer.diagram.unselectAll();
      itemId1 = diagramRenderer.intersect(event.clientX, event.clientY);
      if (itemId1) {
        diagramRenderer.diagram.selectItem(itemId1);
      } else {
        mode.value = "normal";
      }
      diagramRenderer.render();
      break;
    case "create":
      diagramRenderer.addItem(event.clientX, event.clientY);
      diagramRenderer.render();
      mode.value = "resize";
      break;
    case "resize":
      mode.value = "write";
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      input.value!.focus();
      break;
    case "connect_from":
      itemId1 = diagramRenderer.intersect(event.clientX, event.clientY);
      if (itemId1) {
        mode.value = "connect_to";
      } else {
        mode.value = "normal";
      }
      break;
    case "connect_to":
      itemId2 = diagramRenderer.intersect(event.clientX, event.clientY);
      if (itemId1 && itemId2) {
        diagramRenderer.diagram.connectItems(itemId1, itemId2);
        diagramRenderer.render();
      }
      itemId1 = undefined;
      itemId2 = undefined;
      mode.value = "normal";
      break;
  }
};

let isMouseDown = ref(false);
const handleMouseMove = (event: MouseEvent) => {
  switch (mode.value) {
    case "normal":
      if (isMouseDown.value) {
        diagramRenderer.context.translate(event.movementX, event.movementY);
        diagramRenderer.render();
      }
      break;
    case "selected":
      if (isMouseDown.value) {
        diagramRenderer.moveSelectedItems(event.movementX, event.movementY);
        diagramRenderer.render();
      }
      break;
    case "resize":
      diagramRenderer.diagram.resizeSelectedItems(event.movementX, event.movementY);
      diagramRenderer.render();
  }
};

const handleWheel = (event: WheelEvent) => {
  if (mode.value !== "normal") return;
  diagramRenderer.context.scale += event.deltaY < 0 ? 0.1 : -0.1;
  diagramRenderer.render();
};

const handleInput = (event: Event) => {
  if (mode.value === "write") {
    diagramRenderer.writeInItem((event.target as HTMLInputElement).value);
    diagramRenderer.render();
  }
};

const exitWriting = () => {
  diagramRenderer.diagram.unselectAll();
  diagramRenderer.render();
  mode.value = "normal";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  input.value!.value = "";
};
</script>

<template>
  <canvas
    ref="canvas"
    @mousedown="handleMouseDown"
    @mouseup="isMouseDown = false"
    @mouseleave="isMouseDown = false"
    @mousemove="handleMouseMove"
    @wheel="handleWheel"
  ></canvas>
  <input
    type="text"
    ref="input"
    @input="handleInput"
    @focusout="exitWriting"
    @keyup.enter="exitWriting"
  />
</template>

<style scoped>
canvas {
  position: fixed;
}
input {
  position: fixed;
  opacity: 0;
  pointer-events: none;
}
</style>
