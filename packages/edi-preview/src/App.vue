<template>
  <div class="p-2">
    {{ activeLine }}
    <InspectorResult
      v-if="iEdiMessage"
      :iEdiMessage="iEdiMessage"
      :errormsg="errormsg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useVcm from "@/hooks/useVscodeMessage";
import InspectorResult from "@/views/Inspector/InspectorResult.vue";
import useTestData from "./hooks/useTestData";

const { onReceiveMessage, } = useVcm();

const iEdiMessage = ref<IEdiMessage>();
const activeLine = ref<number>();
const errormsg = ref("");

// iEdiMessage.value = useTestData();

onReceiveMessage("fileChange", (data) => {
  iEdiMessage.value = data;
});

onReceiveMessage("activeLine", (data) => {
  activeLine.value = data;
});

</script>
