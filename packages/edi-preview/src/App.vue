<template>
  <div class="p-2">
    <InspectorResult
      v-if="iEdiMessage"
      :iEdiMessage="iEdiMessage"
      :errormsg="errormsg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import useVcm from "@/hooks/useVscodeMessage";
import InspectorResult from "@/views/Inspector/InspectorResult.vue";
import useTestData from "./hooks/useTestData";

const { onReceiveMessage } = useVcm();

const iEdiMessage = ref<IEdiMessage>();
const activeId = ref<string>();
provide("activeId", activeId);
const errormsg = ref("");

onReceiveMessage("fileChange", (data) => {
  iEdiMessage.value = data;
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
  // iEdiMessage.value = useTestData();
  // setActiveId("ele-UNB0201");
});
</script>
