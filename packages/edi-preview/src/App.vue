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

onReceiveMessage("fileChange", (data) => {
  ediDocument.value = data ? new EdiDocument(data) : undefined;
});

onReceiveMessage("active", async (data) => {
  const activeContext = data as IActiveContext;
  const scrollToId = activeContext?.elementKey || activeContext?.segmentKey;
  activeId.value = scrollToId;

  if (!scrollToId) {
    return;
  }

  await nextTick();
  document.getElementById(scrollToId)?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

onMounted(() => {
  postMessage("ready");
  // Test
  // ediDocument.value = useTestData();
  // setActiveId("ele-UNB0201");
});
</script>
