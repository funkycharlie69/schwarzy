<template>
  <div v-if="ghost" class="space-y-2">
    <div class="flex items-center gap-2 text-sm text-foreground/60">
      <Ghost :size="16" />
      <span>Last session: {{ formatDate(ghost.date) }}</span>
      <span :class="ratingColor">{{ ratingIcon }}</span>
    </div>
    <div class="text-sm">
      <span class="font-medium">{{ ghost.sets.length }} sets</span>
      <span class="text-foreground/60 mx-2">|</span>
      <span class="font-medium">{{ ghost.totalVolume }}kg total</span>
    </div>
  </div>
  <div v-else class="p-4 bg-input/50 border border-border rounded-lg">
    <div class="flex items-center gap-2 text-sm text-foreground/60">
      <Ghost :size="16" />
      <span>No previous session - Time to set a baseline!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ghost } from 'lucide-vue-next'
import type { GhostSession } from '~/types'

interface Props {
  ghost: GhostSession | null
}

const props = defineProps<Props>()

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

const ratingIcon = computed(() => {
  if (!props.ghost) return ''
  const icons = {
    flawless: '💎',
    strong: '🟢',
    compromised: '🟡',
    danger: '🔴',
    // Backwards compatibility
    clean: '🟢',
    pump: '🟡',
    pain: '🔴'
  }
  return icons[props.ghost.rating] || '🟢'
})

const ratingColor = computed(() => {
  if (!props.ghost) return ''
  const colors = {
    flawless: 'text-blue-500',
    strong: 'text-accent-green',
    compromised: 'text-accent-yellow',
    danger: 'text-accent-red',
    // Backwards compatibility
    clean: 'text-accent-green',
    pump: 'text-accent-yellow',
    pain: 'text-accent-red'
  }
  return colors[props.ghost.rating] || 'text-accent-green'
})
</script>
