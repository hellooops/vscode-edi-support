<template>
  <div class="flex justify-between border-t py-2 pl-1 gap-1">
    <div class="flex-1">
      <div>
        <InspectorPopover
          :title="element.desc"
          :is-required="!!element.required"
          :desc="element.definition"
        >
          <span class="inline-flex items-center">
            <span><ElementIcon width="12px" height="12px" /></span>
            <span class="ml-2">{{ element.id.toUpperCase() }}</span>
            <span class="ml-2">{{ element.desc }}</span>
          </span>
        </InspectorPopover>
      </div>
    </div>
    <div class="flex-1">
      <div>
        <span class="font-semibold">{{ element.value }}</span>
      </div>
      <span class="text-neutral-500 text-xs">{{ element.definition }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import ElementIcon from "./ElementIcon.vue";
import InspectorPopover from "@/views/Inspector/components/InspectorPopover.vue";

defineProps<{
  element: IEdiElement
}>();
</script>
