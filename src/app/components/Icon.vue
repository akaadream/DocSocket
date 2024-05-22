<script setup lang="ts">
const props = defineProps(['name'])
</script>

<template>
  <i class="fas icon" :class="props.name"></i>
</template>