<template>
  <InspectorResultLine
    v-model:visible="visible"
    type="TransactionSet"
    :name="'Transaction Set'"
    :description="'ID: ' + (transactionSet.id ?? 'Unkown')"
    :parent-height="transactionSet.getParentHeight()"
  >
    <template #content>
      <p class="line-clamp-1 space-x-2">
        <span>{{ transactionSet.meta.release }}</span>
        <span>{{ transactionSet.meta.version }}</span>
        <span>{{ transactionSet.meta.messageInfo?.name }}</span>
      </p>
      <p
        v-if="transactionSet.meta.messageInfo?.introduction"
        class="line-clamp-2"
        :title="transactionSet.meta.messageInfo?.introduction"
      >
        <span>{{ transactionSet.meta.messageInfo?.introduction }}</span>
      </p>
    </template>
    <InspectorResultSegmentList
      :segments="transactionSet.getSegments()"
    />
  </InspectorResultLine>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { EdiTransactionSet } from "@/entities";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultSegmentList from "@/views/Inspector/components/InspectorResultSegmentList.vue";

defineProps<{
  transactionSet: EdiTransactionSet
}>();

const visible = ref(true);
</script>