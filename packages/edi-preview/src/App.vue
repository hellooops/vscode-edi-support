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

const initialPreviewData = (window as Window & { __EDI_PREVIEW_DATA__?: EdiDocumentObject }).__EDI_PREVIEW_DATA__;
const ediDocument = ref<EdiDocument | undefined>(initialPreviewData ? new EdiDocument(initialPreviewData) : undefined);
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

  for (let attempt = 0; attempt < 12; attempt++) {
    await nextTick();

    if (requestId !== scrollRequestId) {
      return;
    }

    const nodeElement = document.getElementById(nodeKey);
    if (!nodeElement) {
      await waitForAnimationFrame();
      continue;
    }

    // Ancestors expand right after the click, so wait until the node stops moving
    // before scrolling; otherwise the sticky header stack covers it.
    const beforeTop = nodeElement.getBoundingClientRect().top;
    await waitForAnimationFrame();
    await waitForAnimationFrame();

    if (requestId !== scrollRequestId) {
      return;
    }

    if (Math.abs(nodeElement.getBoundingClientRect().top - beforeTop) > 0.5) {
      continue;
    }

    nodeElement.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    return;
  }
}

function waitForAnimationFrame(): Promise<void> {
  return new Promise(resolve => {
    // Hidden webviews stop firing requestAnimationFrame; fall back to a timer.
    window.requestAnimationFrame(() => resolve());
    setTimeout(() => resolve(), 32);
  });
}
</script>
