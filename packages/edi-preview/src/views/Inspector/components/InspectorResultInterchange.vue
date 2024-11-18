<template>
  <InspectorResultLine
    v-model:visible="visible"
    type="Interchange"
    :name="'Interchange'"
    :description="'ID: ' + (interchange.id ?? 'Unkown')"
    :parent-height="interchange.getParentHeight()"
  >
    <template #content>
      <p>
        <span>From {{ interchange.meta.senderID }}({{ interchange.meta.senderQualifer }})</span>
        <span> to {{ interchange.meta.receiverID }}({{ interchange.meta.receiverQualifer }})</span>
      </p>
      
    </template>
    <InspectorResultSegment
      v-if="interchange.startSegment"
      :segment="interchange.startSegment"
    />
    <template v-if="isFunctionalGroupFake">
      <InspectorResultTransactionSet
        v-for="(transactionSet, i) in interchange.functionalGroups[0].transactionSets"
        :key="i"
        :transactionSet="transactionSet"
      />
    </template>
    <template v-else>
      <InspectorResultFunctionalGroup
        v-for="(functionalGroup, i) in interchange.functionalGroups"
        :key="i"
        :functionalGroup="functionalGroup"
      />
    </template>
    <InspectorResultSegment
      v-if="interchange.endSegment"
      :segment="interchange.endSegment"
    />
  </InspectorResultLine>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { EdiInterchange } from "@/entities";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultSegment from "@/views/Inspector/components/InspectorResultSegment.vue";
import InspectorResultFunctionalGroup from "@/views/Inspector/components/InspectorResultFunctionalGroup.vue";
import InspectorResultTransactionSet from "@/views/Inspector/components/InspectorResultTransactionSet.vue";

const props = defineProps<{
  interchange: EdiInterchange
}>();

const visible = ref(true);

const isFunctionalGroupFake = computed(() => {
  return props.interchange.functionalGroups.length === 1 && props.interchange.functionalGroups[0].isFake()
});
</script>