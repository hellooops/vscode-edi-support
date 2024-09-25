<template>
  <div class="p-2">
    <InspectorResult
      v-if="ediMessage"
      :ediMessage="ediMessage"
      :errormsg="errormsg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import useVcm from "@/hooks/useVscodeMessage";
import InspectorResult from "@/views/Inspector/InspectorResult.vue";
import useTestData from "./hooks/useTestData";
import { EdiMessage } from "@/entities";

const { onReceiveMessage } = useVcm();

const ediMessage = ref<EdiMessage>();
const activeId = ref<string>();
provide("activeId", activeId);
const errormsg = ref("");

onReceiveMessage("fileChange", (data) => {
  ediMessage.value = data ? new EdiMessage(data) : undefined;
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
  ediMessage.value = useTestData();
  setActiveId("ele-UNB0201");
});
</script>
