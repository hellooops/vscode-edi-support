<template>
  <a-popover :mouseEnterDelay="0.6">
    <template #content>
      <div class="text-xs flex flex-col gap-2 max-w-[280px]">
        <span class="text-sm font-semibold">{{ title }}</span>
        <div>
          <span
            v-if="isRequired !== undefined"
            class="px-1"
            :class="{'bg-[var(--ct-color-required)]': isRequired, 'bg-[var(--ct-color-optional)]': !isRequired}"
          >{{ isRequired ? "Required" : "Optional" }}
          </span>
          <span v-if="max !== undefined" class="ml-2">Max use {{ max }}</span>
        </div>
        <span>{{ desc }}</span>
      </div>
    </template>
    <slot></slot>
  </a-popover>
</template>
<script setup lang="ts">
defineProps<{
  title?: string;
  isRequired?: boolean;
  max?: string;
  desc?: string;
}>();

</script>
