<template>
  <div
    @click="$emit('click')"
    class="bg-input border border-border rounded-lg p-4 cursor-pointer hover:border-foreground/50 transition-colors"
  >
    <h3 class="text-xl font-bold mb-2">{{ exercise.name }}</h3>
    <p class="text-sm text-foreground/60 mb-3">{{ exercise.defaultCue }}</p>

    <GhostDisplay v-if="ghost" :ghost="ghost" />
    <div v-else class="text-sm text-foreground/40 italic">
      First time - no previous data
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise, GhostSession } from '~/types'

interface Props {
  exercise: Exercise
  ghost: GhostSession | null
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>
