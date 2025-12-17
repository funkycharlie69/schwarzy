<template>
  <div class="flex gap-2">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :class="[
        'flex-1 touch-target rounded-lg font-semibold transition-colors',
        modelValue === option.value
          ? option.activeClass
          : 'bg-input border border-border text-foreground/60 hover:text-foreground'
      ]"
    >
      {{ option.icon }} {{ option.label }}
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
    activeClass: 'bg-blue-500 text-white'
  },
  {
    value: 'strong' as PainRating,
    label: 'Strong',
    icon: '🟢',
    activeClass: 'bg-accent-green text-white'
  },
  {
    value: 'compromised' as PainRating,
    label: 'Compromised',
    icon: '🟡',
    activeClass: 'bg-accent-yellow text-background'
  },
  {
    value: 'danger' as PainRating,
    label: 'Danger',
    icon: '🔴',
    activeClass: 'bg-accent-red text-white'
  }
]
</script>
