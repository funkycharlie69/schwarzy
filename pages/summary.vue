<template>
  <div class="min-h-screen p-6">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Workout Complete! 🎉</h1>
      <p class="text-foreground/60">{{ formatDate(store.todayDate) }}</p>
    </header>

    <!-- Total Volume -->
    <div class="bg-input border border-border rounded-lg p-6 mb-8">
      <p class="text-sm text-foreground/60 mb-1">Total Volume</p>
      <p class="text-4xl font-bold">{{ formatVolume(totalVolume) }}</p>
    </div>

    <!-- Charts -->
    <div class="space-y-6 mb-8">
      <h2 class="text-xl font-bold">Progress Charts</h2>

      <WeightProgressChart
        v-for="exercise in store.state.exercises"
        :key="exercise.id"
        :exercise-name="exercise.name"
        :history="store.getWeightHistory(exercise.id)"
      />
    </div>

    <!-- Actions -->
    <div class="space-y-3">
      <BaseButton
        @click="finishWorkout"
        class="w-full"
      >
        Finish & Exit
      </BaseButton>

      <BaseButton
        @click="router.push('/workout')"
        variant="secondary"
        class="w-full"
      >
        Back to Workout
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useVolumeCalculation } from '~/composables/useVolumeCalculation'

const store = useWorkoutStore()
const router = useRouter()
const { formatVolume } = useVolumeCalculation()

const totalVolume = computed(() => store.getTotalVolume())

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

const finishWorkout = () => {
  // Confirmation dialog for destructive action
  const confirmed = confirm(
    'Are you sure you want to finish this workout? This will end your session and you cannot undo this action.'
  )

  if (confirmed) {
    store.finishWorkout()
    router.push('/')
  }
}

onMounted(() => {
  // Redirect if workout not active
  if (!store.state.workoutActive) {
    router.push('/')
  }
})
</script>
