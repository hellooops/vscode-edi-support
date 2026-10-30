<template>
  <div class="relative min-h-screen bg-[var(--preview-page-bg)] px-[clamp(16px,3vw,40px)] py-6 text-[var(--preview-text)] max-[600px]:p-3">
    <div class="relative mx-auto max-w-[1360px]">
      <template v-if="treeNodes.length">
        <PreviewDocumentOverview :summary="summary" />

        <PreviewTreeToolbar
          :query="query"
          @update:query="onQueryChange"
          @expand-all="expandAll"
          @collapse-all="collapseAll"
        />

        <p v-if="hasNoMatches" class="m-0 mb-3 text-[12.5px] text-[var(--preview-text-soft)]">No matching segments or fields.</p>

        <div class="space-y-3">
          <PreviewTreeNode
            v-for="node in treeNodes"
            :key="node.nodeKey"
            :node="node"
            :active-id="activeId"
            :depth="0"
          />
        </div>
      </template>

      <div v-else class="rounded-md border border-dashed border-[var(--preview-border)] bg-white px-6 py-12 text-center text-[var(--preview-text-soft)]">
        <p class="mb-2 text-lg font-semibold text-[var(--preview-text)]">No preview nodes</p>
        <p class="m-0">The current EDI document did not produce any preview content.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { EdiDocument } from "@/entities";
import PreviewDocumentOverview from "@/views/Inspector/components/PreviewDocumentOverview.vue";
import PreviewTreeNode from "@/views/Inspector/components/PreviewTreeNode.vue";
import PreviewTreeToolbar from "@/views/Inspector/components/PreviewTreeToolbar.vue";
import { providePreviewTreeControls } from "@/views/Inspector/components/previewTreeControls";
import { buildPreviewNodes } from "@/views/Inspector/previewTree";
import { buildPreviewSummary } from "@/views/Inspector/previewSummary";

const props = defineProps<{
  ediDocument: EdiDocument;
  activeId?: string;
}>();

const treeNodes = computed(() => buildPreviewNodes(props.ediDocument));
const summary = computed(() => buildPreviewSummary(props.ediDocument));

const { query, searchResult, expandAll, collapseAll } = providePreviewTreeControls(treeNodes);
const hasNoMatches = computed(() => searchResult.value?.visible.size === 0);

function onQueryChange(value: string) {
  query.value = value;
}
</script>
