<template>
  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <label class="text-lg font-medium">{{ label }}</label>
      <span class="text-2xl font-bold">{{ modelValue }}</span>
    </div>
    <div class="relative">
      <!-- Filled track indicator -->
      <div
        class="absolute h-3 bg-accent-green rounded-l-lg pointer-events-none top-0"
        :style="{ width: `${((modelValue - min) / (max - min)) * 100}%` }"
      />
      <!-- Slider input -->
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="$emit('update:modelValue', parseInt(($event.target as HTMLInputElement).value))"
        class="relative w-full h-3 bg-input rounded-lg appearance-none cursor-pointer slider-thumb"
      />
    </div>
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fafafa;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.slider-thumb::-moz-range-thumb {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fafafa;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
