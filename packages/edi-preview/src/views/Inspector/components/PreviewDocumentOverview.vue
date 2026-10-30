<template>
  <div class="preview-overview px-0.5 pb-[18px] pt-0.5">
    <p class="m-0 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--preview-text-soft)]">Document overview</p>

    <div class="flex items-end justify-between gap-6 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-3.5">
      <div class="min-w-0">
        <h1 class="preview-overview__title m-0 truncate text-[28px] font-bold leading-[1.2] text-[var(--preview-text)]" :title="summary.title">
          {{ summary.title }}
        </h1>
        <p class="mb-0 mt-1.5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-[#5b7794]">
          <template v-if="summary.sender || summary.receiver">
            <span>{{ summary.sender || '—' }}</span>
            <span class="text-[11px] text-[var(--preview-text-soft)]">→</span>
            <span>{{ summary.receiver || '—' }}</span>
          </template>
          <span v-if="summary.controlNumber" class="text-[var(--preview-text-soft)]">/ Control #{{ summary.controlNumber }}</span>
        </p>
      </div>

      <div class="flex flex-none items-start gap-9 max-[720px]:gap-[26px]">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-start gap-0.5">
          <span class="text-[23px] font-semibold leading-[1.15] text-[var(--preview-text)]">{{ stat.value }}</span>
          <span class="text-[12px] text-[var(--preview-text-soft)]">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PreviewDocumentSummary } from "@/views/Inspector/previewSummary";

const props = defineProps<{
  summary: PreviewDocumentSummary;
}>();

const stats = computed(() => [
  { label: "Transactions", value: props.summary.transactions },
  { label: "Segments", value: props.summary.segments },
  { label: "Elements", value: props.summary.elements }
]);
</script>
