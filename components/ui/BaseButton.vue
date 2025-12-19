<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'touch-target rounded-lg font-semibold transition-all',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      loading ? 'cursor-wait' : '',
      variantClasses
    ]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      <span><slot /></span>
    </span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-foreground text-background hover:bg-foreground/90 px-6 py-3',
    secondary: 'bg-input text-foreground border border-border hover:bg-zinc-800 px-6 py-3',
    danger: 'bg-accent-red text-white hover:bg-accent-red/90 px-6 py-3'
  }
  return variants[props.variant]
})
</script>
