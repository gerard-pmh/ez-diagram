<script lang="ts" setup>
import { useMode } from "@/composables/use-mode";

const { mode } = useMode();
</script>

<template>
  <div>
    <button @click="mode = 'create'">create</button>
    <button @click="mode = 'connect_from'">connect</button>
  </div>
</template>

<style scoped>
div {
  position: fixed;
}
</style>
