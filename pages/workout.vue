<template>
  <div
    :class="[
      'min-h-screen p-6 transition-all duration-300 pt-[calc(1.5rem+env(safe-area-inset-top))]',
      store.state.restTimerState.endTime ? 'pb-48' : 'pb-32'
    ]"
  >
    <header class="mb-6">
      <div class="flex items-start justify-between gap-4 mb-3">
        <div>
          <h1 class="text-3xl font-bold mb-1">Today's Workout</h1>
          <p class="text-sm text-foreground/60">{{ formatDate(store.todayDate) }}</p>
        </div>

        <!-- Progress indicator -->
        <div class="flex flex-col items-end gap-1 flex-shrink-0">
          <span class="text-2xl font-bold tabular-nums">
            {{ store.workoutProgress.completed }}<span class="text-foreground/40">/{{ store.workoutProgress.total }}</span>
          </span>
          <div class="w-24 h-2 bg-foreground/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-accent-green transition-all duration-500 ease-out"
              :style="{ width: `${store.workoutProgress.percentage}%` }"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Context-Based Recommendation -->
    <div
      v-if="recommendation"
      :class="[
        'p-4 rounded-lg mb-6 border',
        recommendation.severity === 'success' ? 'bg-accent-green/10 border-accent-green/30' : '',
        recommendation.severity === 'warning' ? 'bg-accent-yellow/10 border-accent-yellow/30' : '',
        recommendation.severity === 'danger' ? 'bg-accent-red/10 border-accent-red/30' : ''
      ]"
    >
      <h3 class="font-semibold mb-1">Today's Recommendation</h3>
      <p class="text-sm text-foreground/80">{{ recommendation.message }}</p>
    </div>

    <!-- Program Day Header -->
    <div
      v-if="store.hasActiveProgram"
      class="mb-6 p-4 bg-accent-green/10 border border-accent-green/30 rounded-lg"
    >
      <h3 class="font-semibold text-accent-green mb-1">
        {{ store.currentProgramDay?.name }} (Day {{ store.currentProgramDay?.dayNumber }})
      </h3>
      <p class="text-sm text-foreground/80">
        {{ store.state.programState.currentProgram?.name }}
      </p>
    </div>

    <!-- Phase Tabs (only show when no program) -->
    <div v-if="!store.hasActiveProgram" class="flex gap-2 mb-6 overflow-x-auto">
      <button
        v-for="phase in phases"
        :key="phase.value"
        @click="selectedPhase = phase.value"
        :class="[
          'px-5 py-3 min-h-[48px] rounded-xl text-sm font-semibold whitespace-nowrap transition-colors',
          selectedPhase === phase.value
            ? 'bg-accent-green text-white'
            : 'bg-input border border-border text-foreground/60 hover:text-foreground'
        ]"
      >
        {{ phase.label }}
      </button>
    </div>

    <div class="space-y-4 mb-8">
      <ExerciseCard
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :exercise="exercise"
        :ghost="store.getGhost(exercise.id)"
        :completed="store.state.todayCompletedExercises.includes(exercise.id)"
        @click="navigateToExercise(exercise.id)"
        @long-press="handleLongPress(exercise)"
      />

      <!-- Empty state -->
      <div
        v-if="filteredExercises.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div class="w-24 h-24 mb-6 text-foreground/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2 text-foreground">No exercises in this phase</h3>
        <p class="text-sm text-foreground/60 max-w-[280px] leading-relaxed">
          {{ store.hasActiveProgram
            ? 'This workout day has no exercises. Check your program setup in settings.'
            : 'Add exercises to this phase to get started with your training.'
          }}
        </p>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-background border-t border-border">
      <BaseButton
        @click="finishWorkout"
        variant="secondary"
        class="w-full"
      >
        Finish Workout
      </BaseButton>
    </div>

    <RestTimer />

    <!-- Exercise Selector Modal -->
    <ExerciseSelectorModal
      :is-open="showExerciseSelector"
      :current-exercise="exerciseToReplace"
      @select="handleExerciseReplace"
      @cancel="closeExerciseSelector"
    />
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import type { Exercise } from '~/types'

const store = useWorkoutStore()
const router = useRouter()

const selectedPhase = ref<'rehab' | 'free-weights' | 'hypertrophy'>('rehab')

// Exercise replacement state
const showExerciseSelector = ref(false)
const exerciseToReplace = ref<Exercise | null>(null)

const phases = [
  { value: 'rehab', label: 'Rehab & Machines' },
  { value: 'free-weights', label: 'Free Weights' },
  { value: 'hypertrophy', label: 'Hypertrophy' }
] as const

const filteredExercises = computed(() => {
  if (store.hasActiveProgram) {
    // Program mode - show today's exercises
    return store.todayExercises
  } else {
    // Free mode - show filtered by phase
    return store.state.exercises.filter(
      exercise => exercise.phase === selectedPhase.value
    )
  }
})

const recommendation = computed(() => {
  const context = store.todayContext
  if (!context) return null

  const avgScore = (context.sleepQuality + context.energyLevel) / 2

  if (avgScore >= 8) {
    return {
      message: '🔥 You\'re feeling great! Push hard today - consider adding weight or extra reps.',
      severity: 'success' as const
    }
  } else if (avgScore >= 6) {
    return {
      message: '💪 Solid energy today. Focus on quality reps and maintain your weights.',
      severity: 'success' as const
    }
  } else if (avgScore >= 4) {
    return {
      message: '⚡ Moderate energy. Listen to your body - focus on form over weight today.',
      severity: 'warning' as const
    }
  } else {
    return {
      message: '⚠️ Low energy detected. Consider lighter weights or reducing volume. Rest is progress too.',
      severity: 'danger' as const
    }
  }
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

const navigateToExercise = (exerciseId: string) => {
  router.push(`/exercise/${exerciseId}`)
}

const finishWorkout = () => {
  router.push('/summary')
}

// Exercise replacement handlers
const handleLongPress = (exercise: Exercise) => {
  // Only allow replacement in program mode
  if (!store.hasActiveProgram) return

  exerciseToReplace.value = exercise
  showExerciseSelector.value = true
}

const handleExerciseReplace = (newExercise: Exercise) => {
  if (!exerciseToReplace.value) return

  const success = store.replaceExerciseInWorkout(
    exerciseToReplace.value.id,
    newExercise.id
  )

  if (success) {
    // Haptic feedback for success
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50])
    }
  }

  closeExerciseSelector()
}

const closeExerciseSelector = () => {
  showExerciseSelector.value = false
  exerciseToReplace.value = null
}

onMounted(() => {
  // Redirect if workout not active
  if (!store.state.workoutActive) {
    router.push('/')
  }
})
</script>
