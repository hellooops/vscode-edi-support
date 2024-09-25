<template>
  <InspectorResultLine
    v-if="element.components && element.components.length > 0"
    v-model:visible="visible"
    :isSegment="false"
    :name="element.id?.toUpperCase()"
    :description="element.desc"
    :isRequired="element.required"
    :content="element.definition"
    :id="element.key"
    :class="{'active-fragment': element.key === activeId}"
    :level="element.getLevel()"
  >
    <InspectorResultElementList
      v-if="element.components"
      :elements="element.components"
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
import { EdiElement } from "@/entities";

defineProps<{
  element: EdiElement
}>();

const visible = ref(true);
const activeId = inject("activeId");
</script>
