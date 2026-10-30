<template>
  <PreviewTreeCard
    :node="node"
    :depth="depth"
    :is-open="isOpen"
    :has-body-content="hasBodyContent"
    :has-visible-children="hasVisibleChildren"
    :is-active="isActive"
    :is-filtered-out="isFilteredOut"
    @toggle="toggleOpen"
  >
    <PreviewTreeNode
      v-for="child in childNodes"
      :key="child.nodeKey"
      :node="child"
      :active-id="activeId"
      :depth="depth + 1"
    />
  </PreviewTreeCard>
</template>

<script setup lang="ts">
import type { PreviewNode } from "@/views/Inspector/previewTree";
import PreviewTreeCard from "@/views/Inspector/components/PreviewTreeCard.vue";
import { usePreviewTreeNodeState } from "@/views/Inspector/components/usePreviewTreeNodeState";

const props = withDefaults(defineProps<{
  node: PreviewNode;
  activeId?: string;
  depth?: number;
}>(), {
  activeId: undefined,
  depth: 0
});

const {
  isOpen,
  childNodes,
  hasVisibleChildren,
  hasBodyContent,
  isActive,
  isFilteredOut,
  toggleOpen
} = usePreviewTreeNodeState(props);
</script>
