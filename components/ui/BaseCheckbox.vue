<template>
  <label class="flex items-center gap-3 touch-target cursor-pointer">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="w-6 h-6 rounded border-2 border-border bg-input checked:bg-accent-green checked:border-accent-green cursor-pointer"
    />
    <span class="text-lg">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string
  modelValue: boolean
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
