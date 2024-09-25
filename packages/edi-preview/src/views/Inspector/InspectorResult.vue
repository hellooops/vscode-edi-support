<template>
  <InspectorResultSegmentList
    v-if="!errormsg"
    :segments="ediMessage.segments"
  />
  <InspectorResultError
    v-else
    :errormsg="errormsg"
  />
</template>
<script setup lang="ts">
import InspectorResultSegmentList from "@/views/Inspector/components/InspectorResultSegmentList.vue";
import InspectorResultError from "@/views/Inspector/components/InspectorResultError.vue";
import { EdiMessage } from "@/entities";

defineProps<{
  ediMessage: EdiMessage
  errormsg: string|undefined
}>();


</script>