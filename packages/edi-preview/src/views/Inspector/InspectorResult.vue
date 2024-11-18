<template>
  <InspectorResultDocument
    :ediDocument="ediDocument"
  />
</template>
<script setup lang="ts">
import InspectorResultDocument from "@/views/Inspector/components/InspectorResultDocument.vue";
import { EdiDocument } from "@/entities";

defineProps<{
  ediDocument: EdiDocument
}>();
</script>