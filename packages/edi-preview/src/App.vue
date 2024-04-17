<template>
  <div>
    <h1>edi preview</h1>
    <span>count: {{ count }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const count = ref(0);

let interval: number | undefined = undefined;

onMounted(() => {
  interval = setInterval(() => {
    count.value += 1;
  }, 1000);
});

onUnmounted(() => {
  interval && clearInterval(interval);
});
</script>
