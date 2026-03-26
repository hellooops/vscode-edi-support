<template>
  <div class="relative min-h-screen p-4 max-[600px]:p-3">
    <div class="pointer-events-none absolute -left-[90px] -top-12 h-[220px] w-[280px] rounded-full bg-sky-500/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -right-[72px] bottom-[20%] h-[240px] w-[240px] rounded-full bg-sky-500/10 blur-3xl"></div>

    <div class="relative mx-auto max-w-[1360px]">
      <div v-if="treeNodes.length" class="space-y-[10px]">
        <PreviewTreeNode
          v-for="node in treeNodes"
          :key="node.key"
          :node="node"
          :active-id="activeId"
          :depth="0"
        />
      </div>

      <div v-else class="rounded-2xl border border-dashed border-[var(--preview-border)] bg-white/70 px-6 py-12 text-center text-[var(--preview-text-soft)]">
        <p class="mb-2 text-lg font-semibold text-[var(--preview-text)]">No preview nodes</p>
        <p class="m-0">The current EDI document did not produce any preview content.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { EdiDocument } from "@/entities";
import PreviewTreeNode from "@/views/Inspector/components/PreviewTreeNode.vue";
import { buildPreviewNodes } from "@/views/Inspector/previewTree";

const props = defineProps<{
  ediDocument: EdiDocument;
  activeId?: string;
}>();

const treeNodes = computed(() => buildPreviewNodes(props.ediDocument));
</script>
