<template>
  <div
    @click="$emit('click')"
    :class="[
      'relative bg-input border-2 rounded-xl p-4 cursor-pointer transition-all active:scale-[0.98]',
      completed
        ? 'border-accent-green/50 bg-accent-green/5'
        : 'border-border hover:border-foreground/30'
    ]"
  >
    <!-- Completion checkmark badge -->
    <div
      v-if="completed"
      class="absolute top-3 right-3 w-7 h-7 bg-accent-green rounded-full flex items-center justify-center shadow-lg"
    >
      <Check :size="18" :stroke-width="3" class="text-white" />
    </div>

    <!-- Exercise content -->
    <div :class="completed ? 'opacity-75' : ''">
      <h3 class="text-xl font-bold mb-2">{{ exercise.name }}</h3>
      <p class="text-sm text-foreground/60 mb-3">{{ exercise.defaultCue }}</p>

      <GhostDisplay v-if="ghost" :ghost="ghost" />
      <div v-else class="text-sm text-foreground/40 italic">
        First time - no previous data
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { Exercise, GhostSession } from '~/types'

interface Props {
  exercise: Exercise
  ghost: GhostSession | null
  completed?: boolean
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>
