<template>
  <InspectorResultSegment
    v-for="segment in segments"
    :key="segment.key"
    :segment="segment"
    class="mb-6"
  >
  </InspectorResultSegment>
</template>
<script setup lang="ts">
import InspectorResultSegment from "@/views/Inspector/components/InspectorResultSegment.vue";

defineProps<{
  segments: IEdiSegment[]
}>();
</script>
