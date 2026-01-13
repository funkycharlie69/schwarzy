<template>
  <div :class="['space-y-2', justCompleted ? 'animate-set-complete' : '']">
    <!-- Set label row -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 flex items-center justify-center bg-foreground/10 rounded-full text-xl font-bold">
          {{ setNumber }}
        </div>
        <span class="text-4xl font-semibold">
          {{ completed ? 'Set ' + setNumber + ' - Completed' : 'Set ' + setNumber }}
        </span>
      </div>
      <button
        v-if="canRemove"
        @click="$emit('remove')"
        class="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-accent-red hover:bg-accent-red/10 rounded-full transition-all active:scale-95"
        type="button"
        aria-label="Remove set"
        title="Remove set"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Input sections stacked vertically for mobile -->
    <div class="space-y-3">
      <!-- Weight Input with Stepper -->
      <div>
        <label class="text-sm font-semibold text-foreground/70 mb-2 block">Weight (kg)</label>
        <div class="flex items-center gap-2.5">
          <button
            v-if="!completed"
            @click.prevent="adjustWeight(-2.5)"
            class="w-14 h-14 flex items-center justify-center bg-foreground/5 border border-border rounded-lg text-foreground hover:bg-foreground/10 active:scale-95 transition-all touch-manipulation"
            type="button"
            aria-label="Decrease weight"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <input
            type="text"
            v-model="weightInput"
            placeholder="0"
            inputmode="decimal"
            :readonly="completed"
            :class="[
              'flex-1 px-3 py-4 text-2xl font-bold text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green/40 min-h-[56px]',
              completed
                ? 'bg-input/50 border-2 border-accent-green/60 text-foreground cursor-not-allowed'
                : 'bg-input border-2 border-border'
            ]"
            @input="handleWeightInput"
            @focus="handleFocus"
          />
          <button
            v-if="!completed"
            @click.prevent="adjustWeight(2.5)"
            class="w-14 h-14 flex items-center justify-center bg-foreground/5 border border-border rounded-lg text-foreground hover:bg-foreground/10 active:scale-95 transition-all touch-manipulation"
            type="button"
            aria-label="Increase weight"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Reps Input with Stepper -->
      <div>
        <label class="text-sm font-semibold text-foreground/70 mb-2 block">Reps</label>
        <div class="flex items-center gap-2.5">
          <button
            v-if="!completed"
            @click.prevent="adjustReps(-1)"
            class="w-14 h-14 flex items-center justify-center bg-foreground/5 border border-border rounded-lg text-foreground hover:bg-foreground/10 active:scale-95 transition-all touch-manipulation"
            type="button"
            aria-label="Decrease reps"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            v-model.number="reps"
            placeholder="0"
            inputmode="numeric"
            :readonly="completed"
            :class="[
              'flex-1 px-3 py-4 text-2xl font-bold text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green/40 min-h-[56px]',
              completed
                ? 'bg-input/50 border-2 border-accent-green/60 text-foreground cursor-not-allowed'
                : 'bg-input border-2 border-border'
            ]"
            @focus="handleFocus"
          />
          <button
            v-if="!completed"
            @click.prevent="adjustReps(1)"
            class="w-14 h-14 flex items-center justify-center bg-foreground/5 border border-border rounded-lg text-foreground hover:bg-foreground/10 active:scale-95 transition-all touch-manipulation"
            type="button"
            aria-label="Increase reps"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Complete/Edit Button - Full Width -->
      <button
        @click="toggleComplete"
        :disabled="!completed && (!weight || !reps)"
        :class="[
          'w-full h-14 flex items-center justify-center gap-2 rounded-lg font-semibold text-base transition-all duration-200',
          completed
            ? 'bg-accent-green text-white hover:bg-accent-yellow active:scale-[0.98] shadow-md'
            : 'bg-input border-2 border-border hover:bg-foreground/10 hover:border-accent-green/40',
          !completed && (!weight || !reps) ? 'opacity-40 cursor-not-allowed' : ''
        ]"
        :title="completed ? 'Edit this set' : 'Mark as complete'"
        type="button"
      >
        <Transition name="icon-swap" mode="out-in">
          <Check v-if="!completed" :size="22" :stroke-width="2.5" key="check" />
          <Edit v-else :size="20" :stroke-width="2.5" key="edit" />
        </Transition>
        <span>{{ completed ? 'Edit Set' : 'Complete Set' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Edit } from 'lucide-vue-next'
import { useHaptic } from '~/composables/useHaptic'

interface Props {
  modelValue: {
    weight: number
    reps: number
    completed: boolean
  }
  setNumber: number
  canRemove?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: { weight: number; reps: number; completed: boolean }]
  'complete': []
  'remove': []
}>()

const weight = ref(props.modelValue.weight || 0)
const weightInput = ref(props.modelValue.weight ? String(props.modelValue.weight) : '')
const reps = ref(props.modelValue.reps || 0)
const completed = ref(props.modelValue.completed || false)
const justCompleted = ref(false)

const { haptic } = useHaptic()

// Handle weight input with comma-to-period conversion
const handleWeightInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  // Replace comma with period for decimal separator
  value = value.replace(',', '.')

  // Update the input field with corrected value
  if (value !== target.value) {
    target.value = value
    weightInput.value = value
  }

  // Parse as number
  const numValue = parseFloat(value)
  weight.value = isNaN(numValue) ? 0 : numValue
}

watch([weight, reps], () => {
  emit('update:modelValue', {
    weight: weight.value,
    reps: reps.value,
    completed: completed.value
  })
})

// Update weightInput when weight changes externally
watch(() => props.modelValue.weight, (newWeight) => {
  if (newWeight !== weight.value) {
    weight.value = newWeight
    weightInput.value = newWeight ? String(newWeight) : ''
  }
})

// Adjust weight by increment (usually +/- 2.5kg)
const adjustWeight = (increment: number) => {
  if (completed.value) return

  const newWeight = Math.max(0, weight.value + increment)
  weight.value = Math.round(newWeight * 2) / 2 // Round to nearest 0.5
  weightInput.value = String(weight.value)
}

// Adjust reps by increment (usually +/- 1)
const adjustReps = (increment: number) => {
  if (completed.value) return

  const newReps = Math.max(0, reps.value + increment)
  reps.value = newReps
}

const toggleComplete = () => {
  if (!completed.value) {
    // Completing the set
    if (!weight.value || !reps.value) return

    haptic('success')
    justCompleted.value = true
    setTimeout(() => justCompleted.value = false, 300)

    completed.value = true
    emit('update:modelValue', {
      weight: weight.value,
      reps: reps.value,
      completed: true
    })
    emit('complete')
  } else {
    // Uncompleting the set to allow editing
    haptic('light')
    completed.value = false
    emit('update:modelValue', {
      weight: weight.value,
      reps: reps.value,
      completed: false
    })
  }
}

const handleFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement

  // Select all text for easy replacement
  target.select()

  // Scroll input into view when keyboard appears (iOS)
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 300) // Delay to allow keyboard animation
}
</script>

<style scoped>
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: all 0.15s ease;
}

.icon-swap-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-10deg);
}

.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(10deg);
}

@keyframes setComplete {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.animate-set-complete {
  animation: setComplete 0.3s ease-out;
}
</style>
