<template>
  <PreviewTreeCard
    :node="node"
    :icon-component="TransactionSetIcon"
    :icon-color-class="iconColorClass"
    :is-open="isOpen"
    :has-expandable-content="hasExpandableContent"
    :has-body-content="hasBodyContent"
    :has-visible-children="hasVisibleChildren"
    :visible-details="visibleDetails"
    :is-active="isActive"
    :header-style="headerStyle"
    @toggle="toggleOpen"
  >
    <PreviewTreeNode
      v-for="child in childNodes"
      :key="child.key"
      :node="child"
      :active-id="activeId"
      :depth="depth + 1"
    />
  </PreviewTreeCard>
</template>

<script setup lang="ts">
import type { PreviewNode } from "@/views/Inspector/previewTree";
import TransactionSetIcon from "@/views/Inspector/components/TransactionSetIcon.vue";
import PreviewTreeCard from "@/views/Inspector/components/PreviewTreeCard.vue";
import PreviewTreeNode from "@/views/Inspector/components/PreviewTreeNode.vue";
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
  hasExpandableContent,
  hasVisibleChildren,
  visibleDetails,
  hasBodyContent,
  isActive,
  headerStyle,
  toggleOpen
} = usePreviewTreeNodeState(props);

const iconColorClass = "text-[#2d8f62]";
</script>