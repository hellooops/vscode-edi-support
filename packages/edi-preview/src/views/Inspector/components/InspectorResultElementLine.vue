<template>
  <div class="border-t py-2 pl-2">
    <div class="flex justify-between gap-1" :class="{'active-fragment': element.key === activeId}">
      <div class="flex-1 flex flex-col">
        <span class="inline-flex items-center gap-2 rounded text-sm leading-5">
          <span class="w-4"></span>
          <ElementIcon />
          <span class="invert-color px-1 rounded-sm">{{ element.id?.toUpperCase() ?? element.designator }}</span>
          <span class="opacity-80">{{ element.desc }}</span>
        </span>
      </div>
      <div class="flex-1 space-y-1">
        <div class="flex items-center gap-4 text-sm">
          <span class="font-semibold">{{ element.value }}</span>
          <span>{{ element.codeValue }}</span>
        </div>
        <p v-if="element.length !== undefined" class="opacity-70 text-xs">Length: {{ element.length }}</p>
        <div class="text-xs opacity-80 space-x-2">
          <span>{{ element.required ? "Required" : "Optional" }}</span>
          <span v-if="getMinMaxStr()">{{ getMinMaxStr() }}</span>
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
