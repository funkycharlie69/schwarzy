<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
        @click.self="onCancel"
      >
        <div class="w-full max-w-2xl bg-background rounded-t-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
          <!-- Header -->
          <div class="p-6 border-b border-border sticky top-0 bg-background z-10">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-bold">Replace Exercise</h3>
              <button
                @click="onCancel"
                class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/10 active:bg-foreground/20 transition-colors touch-manipulation"
              >
                <X :size="20" />
              </button>
            </div>
            <p class="text-sm text-foreground/60">
              Select an exercise to replace <span class="font-semibold text-foreground">{{ currentExercise?.name }}</span>
            </p>
          </div>

          <!-- Phase Tabs -->
          <div class="flex gap-2 px-6 pt-4 border-b border-border sticky top-[100px] bg-background z-10">
            <button
              v-for="phase in phases"
              :key="phase.value"
              @click="selectedPhase = phase.value"
              :class="[
                'px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold whitespace-nowrap transition-colors touch-manipulation',
                selectedPhase === phase.value
                  ? 'bg-accent-green text-white'
                  : 'bg-input border border-border text-foreground/60 hover:text-foreground'
              ]"
            >
              {{ phase.label }}
            </button>
          </div>

          <!-- Exercise List -->
          <div class="flex-1 overflow-y-auto overscroll-contain">
            <div class="p-6 space-y-2">
              <button
                v-for="exercise in filteredExercises"
                :key="exercise.id"
                @click="onSelect(exercise)"
                :disabled="exercise.id === currentExercise?.id"
                :class="[
                  'w-full text-left p-4 rounded-xl border-2 transition-all touch-manipulation',
                  exercise.id === currentExercise?.id
                    ? 'bg-foreground/5 border-border opacity-50 cursor-not-allowed'
                    : 'bg-input border-border hover:border-accent-green active:scale-[0.98]'
                ]"
              >
                <h4 class="font-semibold mb-1">{{ exercise.name }}</h4>
                <p class="text-sm text-foreground/60">{{ exercise.defaultCue }}</p>
              </button>

              <!-- Empty state -->
              <div
                v-if="filteredExercises.length === 0"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <p class="text-foreground/40">No exercises in this phase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Exercise } from '~/types'
import { useWorkoutStore } from '~/stores/workout'

interface Props {
  isOpen: boolean
  currentExercise: Exercise | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [exercise: Exercise]
  cancel: []
}>()

const store = useWorkoutStore()

const selectedPhase = ref<'rehab' | 'free-weights' | 'hypertrophy'>('rehab')

const phases = [
  { value: 'rehab', label: 'Rehab' },
  { value: 'free-weights', label: 'Free Weights' },
  { value: 'hypertrophy', label: 'Hypertrophy' }
] as const

const filteredExercises = computed(() => {
  return store.state.exercises.filter(
    exercise => exercise.phase === selectedPhase.value
  )
})

const onSelect = (exercise: Exercise) => {
  emit('select', exercise)
}

const onCancel = () => {
  emit('cancel')
}

// Reset phase when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.currentExercise) {
    selectedPhase.value = props.currentExercise.phase
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div {
  transform: translateY(100%);
}

.modal-leave-to > div {
  transform: translateY(100%);
}
</style>
