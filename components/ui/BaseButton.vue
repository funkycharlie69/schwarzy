<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'touch-target rounded-lg font-semibold transition-colors',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false
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
