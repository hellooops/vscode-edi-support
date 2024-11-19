<template>
  <InspectorResultLine
    v-model:visible="visible"
    type="FunctionalGroup"
    :name="'Functional Group'"
    :description="'ID: ' + (functionalGroup.id ?? 'Unkown')"
    :parent-height="functionalGroup.getParentHeight()"
  >
    <template #content>
      <p class="line-clamp-1">
        Time: {{ Utils.normalizeMetaDateAndTime(functionalGroup.meta.date, functionalGroup.meta.time) }}
      </p>
    </template>
    <InspectorResultSegment
      v-if="functionalGroup.startSegment"
      :segment="functionalGroup.startSegment"
    />
    <InspectorResultTransactionSet
      v-for="(transactionSet, i) in functionalGroup.transactionSets"
      :key="i"
      :transactionSet="transactionSet"
    />
    <InspectorResultSegment
      v-if="functionalGroup.endSegment"
      :segment="functionalGroup.endSegment"
    />
  </InspectorResultLine>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { EdiFunctionalGroup } from "@/entities";
import { Utils } from "@/utils";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultSegment from "@/views/Inspector/components/InspectorResultSegment.vue";
import InspectorResultTransactionSet from "@/views/Inspector/components/InspectorResultTransactionSet.vue";

defineProps<{
  functionalGroup: EdiFunctionalGroup
}>();

const visible = ref(true);
</script>