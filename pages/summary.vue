<template>
  <div class="min-h-screen p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
    <header class="mb-8">
      <div class="flex items-start justify-between gap-4 mb-2">
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-2">Workout Complete! 🎉</h1>
          <p class="text-foreground/60">{{ formatDate(store.todayDate) }}</p>
        </div>

        <!-- Settings Button -->
        <NuxtLink
          to="/settings"
          class="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 active:bg-foreground/20 transition-colors touch-manipulation"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </NuxtLink>
      </div>
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
