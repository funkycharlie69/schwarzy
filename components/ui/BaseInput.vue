<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :inputmode="inputmode"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="w-full px-4 py-3 text-lg bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
