<template>
  <div class="dark fixed inset-0 overflow-auto">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Keep screen awake while app is active
useWakeLock()
</script>
