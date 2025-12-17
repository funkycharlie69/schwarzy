<template>
  <div
    v-if="suggestion"
    :class="[
      'p-4 rounded-lg mb-4',
      bannerClass
    ]"
  >
    <p class="font-semibold">{{ suggestion.message }}</p>
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
    success: 'bg-accent-green/20 text-accent-green border border-accent-green/30',
    warning: 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30',
    danger: 'bg-accent-red/20 text-accent-red border border-accent-red/30'
  }
  return classes[props.suggestion.severity]
})
</script>
