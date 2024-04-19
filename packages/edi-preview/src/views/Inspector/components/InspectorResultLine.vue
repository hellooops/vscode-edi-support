<template>
  <div>
    <InspectorPopover
      :title="description"
      :isRequired="isRequired"
      :desc="content"
    >
      <div class="inline-flex items-center px-2 py-1 gap-2 rounded transition-all hover:cursor-pointer text-sm" @click="handleToggleContentVisible">
        <RightIcon class="transition-all w-4 h-4" :class="{'rotate-90': visible}" />
        <SegmentIcon />
        <span class="bg-neutral-800 text-white px-1 rounded-sm">{{ name }}</span>
        <span class="text-neutral-800">{{ description }}</span>
      </div>
    </InspectorPopover>
    <div v-show="visible" class="pl-8 mt-2">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import InspectorPopover from "@/views/Inspector/components/InspectorPopover.vue";
import RightIcon from "@/components/icons/RightIcon.vue";
import SegmentIcon from "./SegmentIcon.vue";

const props = withDefaults(defineProps<{
  name?: string;
  description?: string;
  isRequired?: boolean;
  content?: string;
  visible: boolean;
}>(), {
  visible: true
});

const emit = defineEmits(["update:visible"]);

function handleToggleContentVisible() {
  emit("update:visible", !props.visible);
}
</script>
