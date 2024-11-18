<template>
  <InspectorResultLine
    v-model:visible="visible"
    type="Segment"
    :name="segment.id!.toUpperCase()"
    :isRequired="undefined"
    :description="segment.desc"
    :content="segment.purpose" 
    :id="segment.key"
    :class="{'active-fragment': segment.key === activeId}"
    :parent-height="segment.getParentHeight()"
  >
    <InspectorResultElementList
      v-if="segment.elements && segment.elements.length > 0"
      :elements="segment.elements"
    />
  </InspectorResultLine>
</template>
<script setup lang="ts">
import { ref, inject } from "vue";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultElementList from "@/views/Inspector/components/InspectorResultElementList.vue";
import { EdiSegment } from "@/entities";

defineProps<{
  segment: EdiSegment
}>();

const visible = ref(true);
const activeId = inject("activeId");
</script>
