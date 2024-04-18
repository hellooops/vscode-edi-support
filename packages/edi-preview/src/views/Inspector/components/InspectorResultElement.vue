<template>
  <InspectorResultLine
    v-if="element.components && element.components.length > 0"
    v-model:visible="visible"
    :name="element.id?.toUpperCase()"
    :description="element.desc"
    :isRequired="element.required"
    :content="element.definition"
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
    :segment="segment"
  />
</template>
<script setup lang="ts">
import { ref } from "vue";
import InspectorResultLine from "@/views/Inspector/components/InspectorResultLine.vue";
import InspectorResultElementList from "@/views/Inspector/components/InspectorResultElementList.vue";
import InspectorResultElementLine from "@/views/Inspector/components/InspectorResultElementLine.vue";

defineProps<{
  element: IEdiElement
  segment: IEdiSegment
}>();

const visible = ref(true);
</script>
