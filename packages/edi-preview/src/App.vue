<template>
  <InspectorResult
    v-if="iEdiMessage"
    :iEdiMessage="iEdiMessage"
    :errormsg="errormsg"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import useVscodeMessage from "@/hooks/useVscodeMessage";
import InspectorResult from "@/views/Inspector/InspectorResult.vue";
import useTestData from "./hooks/useTestData";

const { onRefresh } = useVscodeMessage();

const iEdiMessage = ref<IEdiMessage>();
const errormsg = ref("");

iEdiMessage.value = useTestData();

onRefresh((message) => {
  iEdiMessage.value = message;
});

</script>
