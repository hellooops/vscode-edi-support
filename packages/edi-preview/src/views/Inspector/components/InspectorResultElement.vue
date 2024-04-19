<template>
  <InspectorResultLine
    v-if="element.components && element.components.length > 0"
    v-model:visible="visible"
    :name="element.id?.toUpperCase()"
    :description="element.desc"
    :isRequired="element.required"
    :content="element.definition"
    :id="element.key"
    :class="{'active-fragment': element.key === activeId}"
  >
    <InspectorResultElementList
      v-if="element.components"
      :elements="element.components"
      :segment="segment"
    />
  </InspectorResultLine>
  <InspectorResultElementLine
    v-else
    :element="element"
    :id="element.key"
  />
</template>
<script setup lang="ts">
import { ref, inject } from "vue";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultElementList from "@/views/Inspector/components/InspectorResultElementList.vue";
import InspectorResultElementLine from "@/views/Inspector/components/InspectorResultElementLine.vue";

defineProps<{
  element: IEdiElement
  segment: IEdiSegment
}>();

const visible = ref(true);
const activeId = inject("activeId");
</script>
