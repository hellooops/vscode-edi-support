<template>
  <InspectorResultLine
    v-model:visible="visible"
    type="Interchange"
    :name="'Interchange'"
    :description="'ID: ' + (interchange.id ?? 'Unkown')"
    :parent-height="interchange.getParentHeight()"
  >
    <InspectorResultSegment
      v-if="interchange.startSegment"
      :segment="interchange.startSegment"
    />
    <InspectorResultFunctionalGroup
      v-for="(functionalGroup, i) in interchange.functionalGroups"
      :key="i"
      :functionalGroup="functionalGroup"
    />
    <InspectorResultSegment
      v-if="interchange.endSegment"
      :segment="interchange.endSegment"
    />
  </InspectorResultLine>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { EdiInterchange } from "@/entities";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultSegment from "@/views/Inspector/components/InspectorResultSegment.vue";
import InspectorResultFunctionalGroup from "@/views/Inspector/components/InspectorResultFunctionalGroup.vue";

defineProps<{
  interchange: EdiInterchange
}>();

const visible = ref(true);
</script>