<template>
  <section
    :id="node.nodeKey"
    class="preview-node min-w-0"
    :class="[`preview-node--${node.kind}`, sectionClass, isFilteredOut ? 'hidden' : '']"
    :style="sectionStyle"
  >
    <button
      type="button"
      class="preview-node__header w-full min-w-0 border-0 text-left transition-colors duration-100"
      :class="headerClass"
      :style="headerStyle"
      @click="$emit('toggle')"
    >
      <span
        class="inline-flex h-5 w-5 flex-none items-center justify-center text-[var(--preview-accent)]"
        :class="hasBodyContent ? '' : 'invisible'"
      >
        <RightIcon
          class="h-[13px] w-[13px] transition-transform duration-150"
          :class="{ 'rotate-90': isOpen }"
        />
      </span>

      <span
        v-if="node.kind !== 'element' && node.codeTag"
        class="preview-code-tag inline-flex h-[23px] min-w-[34px] flex-none items-center justify-center rounded px-[7px] font-mono text-[11.5px] font-semibold tracking-[0.02em]"
        :class="node.codeTagTone === 'green' ? 'bg-[#e7f6ee] text-[#1c7a4d]' : 'bg-[#eaf1fd] text-[#2f5f9e]'"
      >{{ node.codeTag }}</span>

      <span v-if="node.kind === 'element'" class="preview-element__designator inline-flex h-[22px] min-w-[50px] flex-none items-center justify-center justify-self-start self-center rounded bg-[#eaf1fd] px-[7px] font-mono text-[10.5px] font-semibold text-[#2f5f9e] max-[720px]:min-w-[44px] max-[720px]:px-1 max-[720px]:text-[9.5px]">{{ node.elementDesignator }}</span>
      <span v-if="node.kind === 'element'" class="min-w-0 truncate text-[13px] text-[var(--preview-text)]">{{ node.title }}</span>

      <span v-else class="flex min-w-0 flex-1 flex-col gap-px">
        <span class="truncate text-[14px] font-semibold leading-[1.35] text-[var(--preview-text)]">{{ node.title }}</span>
      </span>

      <span v-if="node.kind === 'element'" class="flex min-w-0 flex-col gap-px">
        <span
          class="truncate text-[12.5px] font-semibold"
          :class="isEmptyValue ? 'font-sans font-normal italic text-[#9aa9bd]' : 'font-mono text-[#18385f]'"
        >{{ elementValue }}</span>
        <span
          v-if="node.elementMeaning"
          class="preview-element__meaning truncate text-[11.5px] text-[var(--preview-text-soft)] max-[720px]:hidden"
        >{{ node.elementMeaning }}</span>
      </span>

      <span v-if="node.kind === 'element'" class="flex-none text-right text-[10.5px] tracking-[0.04em] text-[#93a3b8]">{{ node.elementRequired ? 'REQ' : 'OPT' }}</span>
      <span v-else class="ml-auto flex-none whitespace-nowrap text-[11px] text-[var(--preview-text-soft)]">{{ trailing }}</span>
    </button>

    <div v-if="isOpen && hasBodyContent" class="preview-node__body bg-white" :class="bodyClass">
      <template v-if="node.kind === 'segment' && !node.isLoop">
        <div v-if="node.meta" class="preview-segment__raw mb-3 flex items-stretch rounded-[5px] border border-[#e3eaf4] bg-[#f6f8fb]">
          <code class="preview-scroll min-w-0 flex-1 overflow-x-auto whitespace-pre px-3 py-[10px] font-mono text-[11.5px] leading-[1.5] text-[#596c87]">{{ node.meta }}</code>
          <button
            type="button"
            class="preview-segment__copy flex flex-none items-center justify-center self-stretch rounded-r border-0 border-l border-[#e3eaf4] px-[14px] text-[11.5px] leading-none text-[#5b7794] hover:bg-[#eaf1fa]"
            @click="copySegment"
          >{{ copied ? 'Copied' : 'Copy' }}</button>
        </div>
        <p v-if="node.purpose" class="preview-segment__purpose mb-3.5 mt-0 text-[12px] leading-[1.55] text-[#627996]">{{ node.purpose }}</p>
      </template>

      <div v-else-if="node.kind === 'element'" class="text-[12px] text-[var(--preview-text-soft)]">
        <p v-if="node.subtitle" class="mb-2 mt-0 text-[12px] leading-[1.5] text-[#627996]">{{ node.subtitle }}</p>
        <div class="preview-element__specs flex flex-col gap-[3px] [&_b]:ml-[3px] [&_b]:font-medium [&_b]:text-[#34577f]">
          <span v-if="node.elementId">Element ID <b>{{ node.elementId }}</b></span>
          <span>Type <b>{{ node.elementType || '—' }}</b></span>
          <span>Length <b>{{ node.elementLength || '—' }}</b></span>
          <span>Requirement <b>{{ node.elementRequired ? 'Required' : 'Optional' }}</b></span>
        </div>
      </div>

      <div v-if="hasVisibleChildren" class="preview-node__children flex min-w-0 flex-col" :class="childrenClass">
        <div
          v-if="showFieldHeader"
          class="preview-fields__head border-b border-[var(--preview-border-soft)] px-[10px] pb-2 text-[10px] uppercase tracking-[0.08em] text-[#93a3b8]"
          :class="FIELD_GRID"
        >
          <span class="col-start-2">Field</span>
          <span class="col-start-3">Name</span>
          <span class="col-start-4 max-[720px]:hidden">Value / Meaning</span>
          <span class="col-start-5"></span>
        </div>
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import RightIcon from "@/components/icons/RightIcon.vue";
import type { PreviewNode } from "@/views/Inspector/previewTree";

const props = defineProps<{
  node: PreviewNode;
  depth: number;
  isOpen: boolean;
  hasBodyContent: boolean;
  hasVisibleChildren: boolean;
  isActive: boolean;
  isFilteredOut: boolean;
}>();

defineEmits<{
  (eventName: "toggle"): void;
}>();

const STICKY_HEADER_HEIGHT = 50;
const STICKY_KINDS = ["interchange", "functional-group", "transaction-set", "segment"];

const HEADER_ROW = "flex items-center gap-[10px] px-[10px] py-2";
const HEADER_HOVER = "bg-white hover:bg-[var(--preview-hover)]";
const HEADER_OPEN = "border-b border-[var(--preview-border-soft)] bg-[var(--preview-panel-bg-strong)]";
const HEADER_ACTIVE = "bg-[#eef4fd] shadow-[inset_3px_0_0_var(--preview-accent)]";
const HEADER_STICKY = "sticky bg-white";
const BODY_INDENT = "ml-5 border-l border-[var(--preview-border-soft)] pl-[clamp(12px,2vw,24px)]";
const FIELD_GRID = "grid grid-cols-[20px_62px_minmax(0,1fr)_minmax(150px,0.95fr)_34px] gap-3 max-[720px]:grid-cols-[18px_52px_minmax(0,1fr)_minmax(0,0.8fr)_28px] max-[720px]:gap-2";

const isSticky = computed(() => STICKY_KINDS.includes(props.node.kind));
const stickyTop = computed(() => props.depth * STICKY_HEADER_HEIGHT);
const cursorClass = computed(() => (props.hasBodyContent ? "cursor-pointer" : "cursor-default"));

const headerStyle = computed(() => (isSticky.value
  ? {
      top: `${stickyTop.value}px`,
      zIndex: `${60 - props.depth}`
    }
  : undefined));
const sectionStyle = computed(() => ({ scrollMarginTop: `${stickyTop.value}px` }));

function classes(...items: Array<string | false | undefined>): string {
  return items.filter(Boolean).join(" ");
}

const sectionClass = computed(() => {
  if (props.node.kind === "element") {
    return "border-b border-[var(--preview-border-soft)] bg-white last:border-b-0";
  }
  if (props.node.kind === "segment" && !props.node.isLoop) {
    return "rounded-lg border border-[var(--preview-border)] bg-white";
  }
  return "";
});

const headerClass = computed(() => {
  const { kind, isLoop } = props.node;

  if (kind === "element") {
    return classes(
      FIELD_GRID,
      "min-h-[48px] items-center px-[10px] py-[7px]",
      cursorClass.value,
      props.isActive ? HEADER_ACTIVE : props.isOpen ? "bg-[#f7f9fc]" : HEADER_HOVER
    );
  }

  if (isLoop) {
    return classes(
      "sticky flex min-h-[50px] items-center gap-[10px] bg-white px-[10px] py-2",
      cursorClass.value,
      props.isActive ? HEADER_ACTIVE : "hover:bg-[var(--preview-hover)]"
    );
  }

  return classes(
    HEADER_ROW,
    "min-h-[50px]",
    props.isOpen && kind === "segment" ? "rounded-t-lg" : "rounded-lg",
    cursorClass.value,
    HEADER_STICKY,
    props.isActive ? HEADER_ACTIVE : props.isOpen && kind === "segment" ? HEADER_OPEN : HEADER_HOVER
  );
});

const bodyClass = computed(() => {
  const { kind, isLoop } = props.node;

  if (kind === "element") {
    return "bg-[#f7f9fc] px-[14px] pb-3 pl-[44px] pt-2.5 max-[720px]:pl-[34px]";
  }
  if (isLoop) {
    return classes(BODY_INDENT, "pt-2");
  }
  if (kind === "segment") {
    return "overflow-hidden rounded-b-lg p-3";
  }
  return classes(BODY_INDENT, "pt-2.5");
});

const childrenClass = computed(() => {
  const { kind, isLoop } = props.node;

  if (kind === "segment") {
    return isLoop ? "gap-3" : "gap-0 pl-[clamp(8px,1.2vw,16px)]";
  }
  if (kind === "element") {
    return "mt-2.5 gap-2";
  }
  return "gap-3";
});

const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const isEmptyValue = computed(() => (props.node.elementValue ?? "").length === 0);

const elementValue = computed(() => {
  const value = props.node.elementValue ?? "";
  if (value.length === 0) return "Empty";
  if (/^ +$/.test(value)) return `(${value.length} spaces)`;
  return value;
});

const trailing = computed(() => {
  if (props.node.kind === "segment") {
    return props.node.fieldCount === undefined ? "" : `${props.node.fieldCount} fields`;
  }
  return props.node.trailing ?? "";
});

const showFieldHeader = computed(() => props.node.kind === "segment" && props.node.fieldCount !== undefined);

async function copySegment() {
  const text = props.node.meta;
  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    if (copiedTimer) {
      clearTimeout(copiedTimer);
    }
    copiedTimer = setTimeout(() => {
      copied.value = false;
    }, 1200);
  } catch {
    copied.value = false;
  }
}
</script>
