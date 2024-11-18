<template>
  <div>
    <InspectorResultInterchange
      v-for="(interchange, i) in ediDocument.interchanges"
      :key="i"
      :interchange="interchange"
    />
  </div>
</template>
<script setup lang="ts">
import { EdiDocument } from "@/entities";
import InspectorResultInterchange from "@/views/Inspector/components/InspectorResultInterchange.vue";

defineProps<{
  ediDocument: EdiDocument
}>();
</script>