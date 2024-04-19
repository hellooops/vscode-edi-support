<template>
  <div class="text-center text-lg">
    {{ errormsg }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errormsg: string|undefined
}>();
</script>
