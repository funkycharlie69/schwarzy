<template>
  <div class="grid grid-cols-2 gap-2">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :class="[
        'flex flex-col items-center justify-center gap-1 py-3 rounded-lg font-semibold transition-all active:scale-95',
        modelValue === option.value
          ? option.activeClass
          : 'bg-input border-2 border-border text-foreground/60 hover:border-foreground/30'
      ]"
    >
      <span class="text-2xl">{{ option.icon }}</span>
      <span class="text-sm">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PainRating } from '~/types'

interface Props {
  modelValue: PainRating
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: PainRating]
}>()

const options = [
  {
    value: 'flawless' as PainRating,
    label: 'Flawless',
    icon: '💎',
    activeClass: 'bg-blue-500 border-2 border-blue-500 text-white'
  },
  {
    value: 'strong' as PainRating,
    label: 'Strong',
    icon: '🟢',
    activeClass: 'bg-accent-green border-2 border-accent-green text-white'
  },
  {
    value: 'compromised' as PainRating,
    label: 'Compromised',
    icon: '🟡',
    activeClass: 'bg-accent-yellow border-2 border-accent-yellow text-background'
  },
  {
    value: 'danger' as PainRating,
    label: 'Danger',
    icon: '🔴',
    activeClass: 'bg-accent-red border-2 border-accent-red text-white'
  }
]
</script>
