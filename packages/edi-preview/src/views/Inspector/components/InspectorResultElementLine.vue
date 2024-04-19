<template>
  <div class="flex justify-between border-t py-2 pl-2 gap-1">
    <div class="flex-1">
      <div>
        <InspectorPopover
          :title="element.desc"
          :is-required="!!element.required"
          :desc="element.definition"
        >
          <span class="inline-flex items-center py-1 gap-2 rounded text-sm">
            <span class="w-4"></span>
            <ElementIcon />
            <span class="bg-neutral-700 text-white px-1 rounded-sm">{{ element.id.toUpperCase() }}</span>
            <span class="text-neutral-600">{{ element.desc }}</span>
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
