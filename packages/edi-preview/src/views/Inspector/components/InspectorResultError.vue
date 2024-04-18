<template>
  <div class="text-center text-lg text-neutral-900">
    {{ errormsg }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errormsg: string|undefined
}>();
</script>
