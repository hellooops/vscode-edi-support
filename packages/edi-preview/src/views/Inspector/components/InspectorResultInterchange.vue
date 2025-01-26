<template>
  <InspectorResultLine
    v-if="!interchange.isFake()"
    v-model:visible="visible"
    type="Interchange"
    :name="'Interchange'"
    :description="'ID: ' + (interchange.id ?? 'Unkown')"
    :parent-height="interchange.getParentHeight()"
  >
    <template #content>
      <div class="flex space-x-4 line-clamp-1">
        <span class="line-clamp-1">
          <span>From {{ interchange.meta.senderQualifer }}:{{ interchange.meta.senderID }}</span>
          <span> to {{ interchange.meta.receiverQualifer }}:{{ interchange.meta.receiverID }}</span>
        </span>
        <span class="line-clamp-1">
          Time: {{ Utils.normalizeMetaDateAndTime(interchange.meta.date, interchange.meta.time) }}
        </span>
      </div>
    </template>
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
  <InspectorResultFunctionalGroup
    v-else
    v-for="(functionalGroup, i) in interchange.functionalGroups"
    :key="i"
    :functionalGroup="functionalGroup"
  />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { EdiInterchange } from "@/entities";
import { Utils } from "@/utils";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultSegment from "@/views/Inspector/components/InspectorResultSegment.vue";
import InspectorResultFunctionalGroup from "@/views/Inspector/components/InspectorResultFunctionalGroup.vue";

const props = defineProps<{
  interchange: EdiInterchange
}>();

const visible = ref(true);
</script>