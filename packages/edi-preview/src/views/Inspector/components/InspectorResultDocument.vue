<template>
  <div class="mb-[calc(100vh-28px)]">
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