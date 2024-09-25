<template>
  <div>
    <div
      class="text-sm px-2 py-1 sticky bg-white flex flex-col"
      :style="{'top': stickyTop, zIndex}"
    >
      <div class="inline-flex items-center gap-2 rounded transition-all hover:cursor-pointer leading-5" @click="handleToggleContentVisible">
        <RightIcon class="transition-all w-4 h-4" :class="{'rotate-90': visible}" />
        <SegmentIcon />
        <span class="invert-color px-1 rounded-sm">{{ name }}</span>
        <span class="opacity-80">{{ description }}</span>
      </div>
      <p class="pl-[52px] opacity-70 overflow-ellipsis line-clamp-1 leading-5" :title="content">{{ content }}</p>
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

const props = withDefaults(defineProps<{
  name?: string;
  description?: string;
  isRequired?: boolean;
  content?: string;
  visible: boolean;
  level: number;
}>(), {
  visible: true
});

const emit = defineEmits(["update:visible"]);

function handleToggleContentVisible() {
  emit("update:visible", !props.visible);
}

const stickyTop = computed(() => `${(props.level - 1) * 48}px`);
const zIndex = computed(() => (10 - props.level) * 10);
</script>
