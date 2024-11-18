<template>
  <div class="px-2">
    <!-- <div class="fixed top-0 z-[1000] bg-editor w-full px-2 text-xs h-[48px] leading-[48px] font-semibold">
      <p class="space-x-2">
        <template v-if="ediMessage?.ediType">
          <span>{{ ediMessage?.ediType?.toUpperCase() }}</span>
          <span>/</span>
        </template>
        <template v-if="ediMessage?.ediVersion.release">
          <span>{{ ediMessage?.ediVersion.release }}</span>
          <span>/</span>
        </template>
        <span>{{ ediMessage?.ediVersion.version }}</span>
      </p>
    </div> -->
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
    document.getElementById(scrollToId)?.scrollIntoView({
      block: "start",
      behavior: "smooth",
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
