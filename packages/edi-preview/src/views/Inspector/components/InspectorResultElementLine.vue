<template>
  <div class="border-t py-2 pl-2">
    <div class="flex justify-between gap-1" :class="{'active-fragment': element.key === activeId}">
      <div class="flex-1">
        <div>
          <span class="inline-flex items-center py-1 gap-2 rounded text-sm">
            <span class="w-4"></span>
            <ElementIcon />
            <span class="bg-neutral-800 text-white px-1 rounded-sm">{{ element.id.toUpperCase() }}</span>
            <span class="opacity-80">{{ element.desc }}</span>
          </span>
        </div>
      </div>
      <div class="flex-1 space-y-1">
        <div class="flex items-center gap-4 text-sm">
          <span class="font-semibold">{{ element.value }}</span>
          <span>{{ element.codeValue }}</span>
        </div>
        <div class="text-xs opacity-80 space-x-2">
          <span>{{ element.required ? "Required" : "Optional" }}</span>
          <span>{{ getMinMaxStr() }}</span>
          <span v-if="element.dataType">{{ element.dataType }}</span>
        </div>
        <p class="opacity-70 text-xs">{{ element.definition }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject } from "vue";
import ElementIcon from "./ElementIcon.vue";

const props = defineProps<{
  element: IEdiElement
}>();

function getMinMaxStr() {
  let result: string = "";
  if (props.element.minLength !== undefined) {
    result += `Min ${props.element.minLength}`;
  }

  if (props.element.maxLength !== undefined) {
    if (result) result += " / ";
    result += `Max ${props.element.maxLength}`;
  }

  return result;
}

const activeId = inject("activeId");
</script>
