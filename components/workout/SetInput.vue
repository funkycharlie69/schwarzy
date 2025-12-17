<template>
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <label class="text-xs font-medium text-foreground/60 mb-1 block">Weight (kg)</label>
      <input
        type="number"
        v-model.number="weight"
        placeholder="0"
        inputmode="decimal"
        :readonly="completed"
        :class="[
          'w-full px-4 py-3 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20',
          completed
            ? 'bg-input/50 border border-accent-green/50 text-foreground cursor-not-allowed'
            : 'bg-input border border-border'
        ]"
        @focus="handleFocus"
      />
    </div>
    <div class="flex-1">
      <label class="text-xs font-medium text-foreground/60 mb-1 block">Reps</label>
      <input
        type="number"
        v-model.number="reps"
        placeholder="0"
        inputmode="numeric"
        :readonly="completed"
        :class="[
          'w-full px-4 py-3 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20',
          completed
            ? 'bg-input/50 border border-accent-green/50 text-foreground cursor-not-allowed'
            : 'bg-input border border-border'
        ]"
        @focus="handleFocus"
      />
    </div>
    <button
      @click="toggleComplete"
      :disabled="!completed && (!weight || !reps)"
      :class="[
        'touch-target rounded-lg px-4',
        completed
          ? 'bg-accent-green text-white hover:bg-accent-yellow'
          : 'bg-input border border-border hover:bg-zinc-800',
        !completed && (!weight || !reps) ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :title="completed ? 'Click to edit' : 'Mark as complete'"
    >
      <Check v-if="!completed" :size="24" />
      <Edit v-else :size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Check, Edit } from 'lucide-vue-next'

interface Props {
  modelValue: {
    weight: number
    reps: number
    completed: boolean
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: { weight: number; reps: number; completed: boolean }]
  'complete': []
}>()

const weight = ref(props.modelValue.weight || 0)
const reps = ref(props.modelValue.reps || 0)
const completed = ref(props.modelValue.completed || false)

watch([weight, reps], () => {
  emit('update:modelValue', {
    weight: weight.value,
    reps: reps.value,
    completed: completed.value
  })
})

const toggleComplete = () => {
  if (!completed.value) {
    // Completing the set
    if (!weight.value || !reps.value) return

    completed.value = true
    emit('update:modelValue', {
      weight: weight.value,
      reps: reps.value,
      completed: true
    })
    emit('complete')
  } else {
    // Uncompleting the set to allow editing
    completed.value = false
    emit('update:modelValue', {
      weight: weight.value,
      reps: reps.value,
      completed: false
    })
  }
}

const handleFocus = (event: FocusEvent) => {
  // Scroll input into view when keyboard appears (iOS)
  const target = event.target as HTMLElement
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 300) // Delay to allow keyboard animation
}
</script>
