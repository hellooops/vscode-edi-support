<template>
  <div>
    <InspectorPopover
      :title="description"
      :isRequired="isRequired"
      :desc="content"
    >
      <div class="inline-flex hover:bg-[#EFEFF0] p-1 rounded transition-all hover:cursor-pointer" @click="handleToggleContentVisible">
        <RightOutlined class="transition-all" :class="{'rotate-90': visible}" />
        <span class="ml-2 bg-black-100 text-white px-1">{{ name }}</span>
        <span class="ml-2 text-black-100">{{ description }}</span>
      </div>
    </InspectorPopover>
    <div v-show="visible" class="pl-2 mt-2">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import InspectorPopover from "@/views/Inspector/components/InspectorPopover.vue";

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
