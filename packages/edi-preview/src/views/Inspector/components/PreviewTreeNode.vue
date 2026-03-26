<template>
  <component
    :is="nodeComponent"
    :node="node"
    :active-id="activeId"
    :depth="depth"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PreviewNode } from "@/views/Inspector/previewTree";
import PreviewTreeElement from "@/views/Inspector/components/PreviewTreeElement.vue";
import PreviewTreeFunctionalGroup from "@/views/Inspector/components/PreviewTreeFunctionalGroup.vue";
import PreviewTreeInterchange from "@/views/Inspector/components/PreviewTreeInterchange.vue";
import PreviewTreeSegment from "@/views/Inspector/components/PreviewTreeSegment.vue";
import PreviewTreeTransactionSet from "@/views/Inspector/components/PreviewTreeTransactionSet.vue";

const props = withDefaults(defineProps<{
  node: PreviewNode;
  activeId?: string;
  depth?: number;
}>(), {
  activeId: undefined,
  depth: 0
});

const nodeComponent = computed(() => {
  switch (props.node.kind) {
    case "interchange":
      return PreviewTreeInterchange;
    case "functional-group":
      return PreviewTreeFunctionalGroup;
    case "transaction-set":
      return PreviewTreeTransactionSet;
    case "segment":
      return PreviewTreeSegment;
    default:
      return PreviewTreeElement;
  }
});
</script>
