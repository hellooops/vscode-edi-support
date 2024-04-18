<template>
  <div>
    <h1>edi preview</h1>
    <span>count: {{ count }}</span>
    <button @click="vscodeLog('' + count)">Hello</button>
    <p>{{ message }}</p>
    <p>{{ other }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import useVscodeMessage from "@/hooks/useVscodeMessage";

const count = ref(0);
const message = ref("");
const other = ref<any>();

let interval: number | undefined = undefined;

const { vscodeLog, onFileChange } = useVscodeMessage();

onFileChange((data) => {
  message.value = data.fileName + " | " + data.text;
  other.value = (data as any).result.ediVersion;
});


onMounted(() => {
  interval = setInterval(() => {
    count.value += 1;
  }, 1000);
});

onUnmounted(() => {
  interval && clearInterval(interval);
});
</script>
