<template>
  <div class="mb-3 flex flex-wrap items-center gap-2">
    <input
      :value="query"
      type="search"
      class="h-8 min-w-[200px] flex-1 rounded-md border border-[var(--preview-border)] bg-white px-3 text-[12.5px] text-[var(--preview-text)] outline-none placeholder:text-[#9aa9bd] focus:border-[var(--preview-accent)] focus:shadow-[0_0_0_2px_rgba(40,100,165,0.12)]"
      placeholder="Search segments, fields, values..."
      aria-label="Search segments, fields, values"
      @input="onInput"
    />
    <button
      type="button"
      class="h-8 flex-none rounded-md border border-[var(--preview-border)] bg-white px-3 text-[12.5px] whitespace-nowrap text-[var(--preview-text)] hover:bg-[var(--preview-hover)]"
      @click="$emit('expand-all')"
    >Expand segments</button>
    <button
      type="button"
      class="h-8 flex-none rounded-md border border-[var(--preview-border)] bg-white px-3 text-[12.5px] whitespace-nowrap text-[var(--preview-text)] hover:bg-[var(--preview-hover)]"
      @click="$emit('collapse-all')"
    >Collapse all</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  query: string;
}>();

const emit = defineEmits<{
  (eventName: "update:query", value: string): void;
  (eventName: "expand-all"): void;
  (eventName: "collapse-all"): void;
}>();

function onInput(event: Event) {
  emit("update:query", (event.target as HTMLInputElement).value);
}
</script>
