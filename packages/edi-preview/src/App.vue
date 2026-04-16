<template>
  <PreviewTreeView
    v-if="ediDocument"
    :ediDocument="ediDocument"
    :active-id="activeId"
  />
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted } from "vue";
import useVcm from "@/hooks/useVscodeMessage";
import { EdiDocument } from "@/entities";
import useTestData from "./hooks/useTestData";
import PreviewTreeView from "@/views/Inspector/PreviewTreeView.vue";

const { onReceiveMessage, postMessage } = useVcm();

const ediDocument = ref<EdiDocument>();
const activeId = ref<string>();
let scrollRequestId = 0;

onReceiveMessage("fileChange", (data) => {
  ediDocument.value = data ? new EdiDocument(data) : undefined;
});

onReceiveMessage("active", async (data) => {
  const activeContext = data as IActiveContext;
  const scrollToId = activeContext?.elementNodeKey || activeContext?.segmentNodeKey;
  activeId.value = scrollToId;

  if (!scrollToId) {
    return;
  }

  await scrollNodeIntoView(scrollToId);
});

onMounted(() => {
  postMessage("ready");
  // Test
  // ediDocument.value = useTestData();
  // setActiveId("ele-UNB0201");
});

async function scrollNodeIntoView(nodeKey: string) {
  const requestId = ++scrollRequestId;

  for (let attempt = 0; attempt < 8; attempt++) {
    await nextTick();

    if (requestId !== scrollRequestId) {
      return;
    }

    const nodeElement = document.getElementById(nodeKey);
    if (nodeElement) {
      nodeElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    await waitForAnimationFrame();
  }
}

function waitForAnimationFrame(): Promise<void> {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => resolve());
  });
}
</script>
