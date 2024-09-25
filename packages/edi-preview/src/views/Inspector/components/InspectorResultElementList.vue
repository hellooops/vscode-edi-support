<template>
  <InspectorResultElement
    v-for="ele in elements"
    :key="ele.key"
    :element="ele"
  />
</template>
<script setup lang="ts">
import InspectorResultElement from "@/views/Inspector/components/InspectorResultElement.vue";
import { EdiElement } from "@/entities";

defineProps<{
  elements: EdiElement[]
}>();
</script>
