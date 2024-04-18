<template>
  <InspectorResultSegmentList
    v-if="!errormsg"
    :segments="iEdiMessage.segments"
  />
  <InspectorResultError
    v-else
    :errormsg="errormsg"
  />
</template>
<script setup lang="ts">
import InspectorResultSegmentList from "@/views/Inspector/components/InspectorResultSegmentList.vue";
import InspectorResultError from "@/views/Inspector/components/InspectorResultError.vue";

defineProps<{
  iEdiMessage: IEdiMessage
  errormsg: string|undefined
}>();


</script>