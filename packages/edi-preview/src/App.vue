<template>
  <div class="px-2">
    <div class="mt-4">
      <InspectorResult
        v-if="ediDocument"
        :ediDocument="ediDocument"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import useVcm from "@/hooks/useVscodeMessage";
import InspectorResult from "@/views/Inspector/InspectorResult.vue";
import useTestData from "./hooks/useTestData";
import { EdiDocument } from "@/entities";

const { onReceiveMessage } = useVcm();

const ediDocument = ref<EdiDocument>();
const activeId = ref<string>();
provide("activeId", activeId);

onReceiveMessage("fileChange", (data) => {
  ediDocument.value = data ? new EdiDocument(data) : undefined;
});

onReceiveMessage("active", (data) => {
  const activeContext = data as IActiveContext;
  const scrollToId = activeContext?.elementKey || activeContext?.segmentKey;
  if (scrollToId) {
    setActiveId(scrollToId);
    const domElement = document.getElementById(scrollToId)!;
    const segmentOrElement = ediDocument.value?.getSegmentOrElementByKey(scrollToId)!;
    const headerOffset = segmentOrElement.getParentHeight();
    const elementPosition = domElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
});

function setActiveId(id: string) {
  activeId.value = id;
}

onMounted(() => {
  // Test
  ediDocument.value = useTestData();
  setActiveId("ele-UNB0201");
});
</script>
