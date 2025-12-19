<template>
  <div
    v-if="suggestion"
    :class="[
      'p-3 rounded-lg border-l-4',
      bannerClass
    ]"
  >
    <div class="flex items-start gap-2">
      <span class="text-lg leading-none mt-0.5 flex-shrink-0">{{ iconForSeverity }}</span>
      <p class="text-sm font-semibold leading-snug">{{ suggestion.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IronAuditSuggestion } from '~/types'

interface Props {
  suggestion: IronAuditSuggestion | null
}

const props = defineProps<Props>()

const bannerClass = computed(() => {
  if (!props.suggestion) return ''

  const classes = {
    success: 'bg-accent-green/10 text-accent-green border-accent-green',
    warning: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow',
    danger: 'bg-accent-red/10 text-accent-red border-accent-red'
  }
  return classes[props.suggestion.severity]
})

const iconForSeverity = computed(() => {
  if (!props.suggestion) return ''

  const icons = {
    success: '💪',
    warning: '⚠️',
    danger: '🚨'
  }
  return icons[props.suggestion.severity]
})
</script>
