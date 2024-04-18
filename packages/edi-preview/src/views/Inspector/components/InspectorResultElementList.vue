<template>
  <InspectorResultElement
    v-for="ele in elements"
    :key="ele.key"
    :element="ele"
    :segment="segment"
  >
  </InspectorResultElement>
</template>
<script setup lang="ts">
import InspectorResultElement from "@/views/Inspector/components/InspectorResultElement.vue";

defineProps<{
  elements: IEdiElement[]
  segment: IEdiSegment
}>();
</script>
