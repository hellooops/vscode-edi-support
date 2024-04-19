<template>
  <div>
    <div class="text-sm px-2 py-1">
      <div class="inline-flex items-center gap-2 rounded transition-all hover:cursor-pointer" @click="handleToggleContentVisible">
        <RightIcon class="transition-all w-4 h-4" :class="{'rotate-90': visible}" />
        <SegmentIcon />
        <span class="bg-neutral-800 text-white px-1 rounded-sm">{{ name }}</span>
        <span class="text-neutral-800">{{ description }}</span>
      </div>
      <div>
      </div>
      <p class="pl-12 text-neutral-600">{{ content }}</p>
    </div>
    <div v-show="visible" class="pl-8 mt-2">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
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
