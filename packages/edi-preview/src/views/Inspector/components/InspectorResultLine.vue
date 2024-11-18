<template>
  <div>
    <div
      class="text-sm px-2 py-1 sticky bg-editor flex flex-col"
      :style="{'top': stickyTop, zIndex}"
    >
      <div class="inline-flex items-center gap-2 rounded transition-all hover:cursor-pointer leading-5" @click="handleToggleContentVisible">
        <RightIcon class="transition-all w-4 h-4" :class="{'rotate-90': visible}" />
        <InterchangeIcon v-if="type === 'Interchange'" />
        <FunctionalGroupIcon v-else-if="type === 'FunctionalGroup'" />
        <TransactionSetIcon v-else-if="type === 'TransactionSet'" />
        <SegmentIcon v-else-if="type === 'Segment'" />
        <ElementIcon v-else-if="type === 'Element'" />
        <span class="invert-color px-1 rounded-sm">{{ name }}</span>
        <span class="opacity-80">{{ description }}</span>
      </div>
      <p
        v-if="$slots.content || content"
        class="pl-[52px] opacity-70 overflow-ellipsis line-clamp-1 leading-5"
        :title="content"
      >
        <template v-if="$slots.content"><slot name="content"></slot></template>
        <template v-else>{{ content }}</template>
      </p>
    </div>
    <div v-show="visible" class="pl-8 mt-2">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import RightIcon from "@/components/icons/RightIcon.vue";
import SegmentIcon from "./SegmentIcon.vue";
import ElementIcon from "./ElementIcon.vue";
import InterchangeIcon from "./InterchangeIcon.vue";
import FunctionalGroupIcon from "./FunctionalGroupIcon.vue";
import TransactionSetIcon from "./TransactionSetIcon.vue";

const props = withDefaults(defineProps<{
  name?: string;
  description?: string;
  isRequired?: boolean;
  content?: string;
  visible: boolean;
  parentHeight: number;
  type: "Interchange" | "FunctionalGroup" | "TransactionSet" | "Segment" | "Element"
}>(), {
  visible: true
});

const emit = defineEmits(["update:visible"]);

function handleToggleContentVisible() {
  emit("update:visible", !props.visible);
}

const stickyTop = computed(() => `${props.parentHeight}px`);
const zIndex = computed(() => 1000 - props.parentHeight);
</script>
