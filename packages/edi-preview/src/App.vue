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

window.addEventListener("message", (event) => {
  const vscodeMessage = event.data as VSCodeMessage;
  vscodeLog(vscodeMessage.name);
  count.value = -50;
  if (vscodeMessage.name === "fileChange") {
    count.value = -100;
  }
});


function vscodeLog(message: string) {
  vscode.postMessage({
    name: "log",
    data: message
  });
}

onMounted(() => {
  interval = setInterval(() => {
    count.value += 1;
  }, 1000);
});

onUnmounted(() => {
  interval && clearInterval(interval);
});
</script>
