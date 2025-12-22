<template>
  <div class="dark">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Keep screen awake while app is active
useWakeLock()
</script>
