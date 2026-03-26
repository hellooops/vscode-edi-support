<template>
  <section
    :id="node.key"
    class="relative isolate rounded-[14px] border bg-white/95"
    :class="[
      isActive
        ? 'border-[rgba(0,122,204,0.45)] shadow-[0_14px_34px_rgba(0,122,204,0.16)]'
        : !hasExpandableContent
          ? 'border-[var(--preview-border)] shadow-[0_8px_18px_rgba(40,40,40,0.05)]'
          : 'border-[var(--preview-border)] shadow-[0_10px_28px_rgba(50,50,50,0.08)]'
    ]"
  >
    <div class="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-sky-500/[0.03] to-transparent"></div>

    <button
      type="button"
      class="sticky z-[1] flex min-h-[46px] w-full items-start gap-[10px] rounded-[14px] border-0 bg-white/95 px-[10px] py-2 text-left backdrop-blur-sm"
      :class="[
        hasExpandableContent ? 'cursor-pointer hover:bg-[rgba(232,232,232,0.78)]' : 'cursor-default',
        'max-[600px]:flex-wrap'
      ]"
      :style="headerStyle"
      @click="$emit('toggle')"
    >
      <span
        class="inline-flex h-6 w-6 flex-none items-center justify-center rounded-md border text-[var(--preview-accent-strong)]"
        :class="hasExpandableContent ? 'border-[#d7d7d7] bg-white' : 'border-transparent bg-transparent'"
      >
        <RightIcon
          v-if="hasExpandableContent"
          class="h-[14px] w-[14px] transition-transform duration-150"
          :class="{ 'rotate-90': isOpen }"
        />
      </span>

      <span class="inline-flex h-[18px] w-[18px] flex-none items-center justify-center" :class="iconColorClass">
        <component :is="iconComponent" />
      </span>

      <span class="flex min-w-0 flex-1 flex-col gap-[2px] pr-2">
        <span class="truncate text-[13px] font-medium text-[var(--preview-text)]">{{ node.title }}</span>
        <span v-if="node.subtitle" class="truncate text-xs text-[var(--preview-text-soft)]">{{ node.subtitle }}</span>
        <span v-if="node.meta" class="truncate font-mono text-xs text-[#4b4b4b]">
          {{ node.meta }}
        </span>
      </span>

      <span v-if="node.badge" class="ml-auto inline-flex min-w-16 flex-none items-center justify-center self-start rounded-full px-[10px] py-[3px] text-xs leading-none" :class="badgeClass">
        {{ node.badge }}
      </span>
    </button>

    <div v-if="isOpen && hasBodyContent" class="relative z-[1] px-[10px] pb-[10px] pl-[42px] max-[600px]:pl-[14px]">
      <div v-if="visibleDetails.length" class="pb-1">
        <div v-for="detail in visibleDetails" :key="`${node.key}-${detail.label}`" class="flex items-start gap-2 py-1 text-[var(--preview-text-soft)] max-[600px]:flex-col max-[600px]:gap-1">
          <span class="basis-[120px] shrink-0 max-[600px]:basis-auto">{{ detail.label }}:</span>
          <span class="min-w-0 text-[var(--preview-text)]" :class="detail.mono ? 'font-mono leading-[1.45]' : 'leading-[1.45]'">{{ detail.value }}</span>
        </div>
      </div>

      <div v-if="hasVisibleChildren" class="mt-[6px] space-y-2">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";
import RightIcon from "@/components/icons/RightIcon.vue";
import type { PreviewDetail, PreviewNode } from "@/views/Inspector/previewTree";

const props = defineProps<{
  node: PreviewNode;
  iconComponent: Component;
  iconColorClass: string;
  isOpen: boolean;
  hasExpandableContent: boolean;
  hasBodyContent: boolean;
  hasVisibleChildren: boolean;
  visibleDetails: PreviewDetail[];
  isActive: boolean;
  headerStyle: {
    top: string;
    zIndex: string;
  };
}>();

defineEmits<{
  (eventName: "toggle"): void;
}>();

const badgeClass = computed(() =>
  props.node.badge === "Required"
    ? "bg-[linear-gradient(180deg,#1789da,#007acc)] text-white"
    : "bg-[var(--preview-accent-soft)] text-[var(--preview-accent-strong)]"
);

const iconComponent = computed(() => props.iconComponent);
const iconColorClass = computed(() => props.iconColorClass);
</script>