<template>
  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <label class="text-lg font-medium">{{ label }}</label>
      <span class="text-2xl font-bold">{{ modelValue }}</span>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="$emit('update:modelValue', parseInt(($event.target as HTMLInputElement).value))"
      class="w-full h-3 bg-input rounded-lg appearance-none cursor-pointer slider-thumb"
    />
    <div class="flex justify-between text-sm text-foreground/60">
      <span>{{ minLabel }}</span>
      <span>{{ maxLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  modelValue: number
  min?: number
  max?: number
  step?: number
  minLabel?: string
  maxLabel?: string
}

withDefaults(defineProps<Props>(), {
  min: 1,
  max: 10,
  step: 1,
  minLabel: '1',
  maxLabel: '10'
})

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<style scoped>
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fafafa;
  cursor: pointer;
}

.slider-thumb::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fafafa;
  cursor: pointer;
  border: none;
}
</style>
