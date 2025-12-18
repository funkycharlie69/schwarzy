<template>
  <div class="min-h-screen p-6 pb-32">
    <header class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Today's Workout</h1>
      <p class="text-foreground/60">{{ formatDate(store.todayDate) }}</p>
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
          'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
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
        @click="navigateToExercise(exercise.id)"
      />
    </div>

    <div class="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
      <BaseButton
        @click="finishWorkout"
        variant="secondary"
        class="w-full"
      >
        Finish Workout
      </BaseButton>
    </div>

    <RestTimer />
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'

const store = useWorkoutStore()
const router = useRouter()

const selectedPhase = ref<'rehab' | 'free-weights' | 'hypertrophy'>('rehab')

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

onMounted(() => {
  // Redirect if workout not active
  if (!store.state.workoutActive) {
    router.push('/')
  }
})
</script>
