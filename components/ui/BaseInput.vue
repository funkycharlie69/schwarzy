<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :inputmode="inputmode"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="w-full px-4 py-3 text-base bg-input border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green/40 placeholder:text-foreground/40"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: 'text' | 'number'
  placeholder?: string
  inputmode?: 'text' | 'numeric' | 'decimal'
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  inputmode: 'text'
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>
