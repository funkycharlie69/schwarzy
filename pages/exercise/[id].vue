<template>
  <div :key="exerciseId" class="min-h-screen pb-24">
    <!-- Header -->
    <div class="sticky top-0 bg-background border-b border-border px-4 py-3 z-10">
      <button
        @click="handleBack"
        class="flex items-center gap-2 min-h-[44px] min-w-[44px] -ml-3 px-3 rounded-lg active:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground mb-3"
      >
        <ChevronLeft :size="20" />
        <span class="text-sm font-medium">Back</span>
      </button>

      <div class="flex items-start justify-between gap-3 mb-2">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold leading-tight mb-1">{{ exercise?.name }}</h1>
          <p class="text-sm text-foreground/60 leading-snug">{{ exercise?.defaultCue }}</p>
        </div>
        <div class="flex-shrink-0">
          <div class="px-2.5 py-1 bg-accent-green/20 border border-accent-green/40 rounded-md">
            <span class="text-xs font-bold text-accent-green whitespace-nowrap">
              {{ exercise?.repRangeMin }}-{{ exercise?.repRangeMax }} reps
            </span>
          </div>
        </div>
      </div>

      <a
        v-if="exercise"
        :href="store.getExerciseImageSearchUrl(exercise)"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-sm text-accent-green hover:underline active:text-accent-green/80"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="font-medium">View form</span>
      </a>
    </div>

    <div class="px-4 py-5 space-y-5">
      <!-- The Ghost -->
      <GhostDisplay :ghost="ghost" />

      <!-- Machine Setup -->
      <div>
        <label class="text-base font-semibold text-foreground mb-2 block">
          Machine Setup
        </label>
        <BaseInput
          v-model="machineSetup"
          placeholder="Seat 5, Back 3"
          @blur="saveMachineSetup"
        />
      </div>

      <!-- Iron Audit Banner -->
      <IronAuditBanner :suggestion="ironAudit" />

      <!-- Sets -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold">Your Sets</h3>

        <SetInput
          v-for="(set, index) in sets"
          :key="index"
          v-model="sets[index]"
          :set-number="index + 1"
          @complete="onSetComplete(index)"
        />

        <!-- Rep Range Feedback -->
        <div
          v-if="repFeedback"
          :class="[
            'p-3 rounded-lg border-l-4 text-sm font-semibold leading-snug',
            repFeedback.type === 'success' ? 'bg-accent-green/10 border-accent-green text-accent-green' : '',
            repFeedback.type === 'warning' ? 'bg-accent-yellow/10 border-accent-yellow text-accent-yellow' : '',
            repFeedback.type === 'danger' ? 'bg-accent-red/10 border-accent-red text-accent-red' : ''
          ]"
        >
          {{ repFeedback.message }}
        </div>
      </div>

      <!-- Pain Rating -->
      <div>
        <h3 class="text-xl font-bold mb-3">How did it feel?</h3>
        <PainToggle v-model="rating" />
      </div>

      <!-- Save Button -->
      <div class="pt-2">
        <BaseButton
          @click="saveAndReturn"
          :disabled="!hasCompletedSets"
          class="w-full h-14 text-lg"
        >
          {{ hasCompletedSets ? 'Save Exercise' : 'Complete at least 1 set' }}
        </BaseButton>
      </div>
    </div>

    <ConfirmModal
      :is-open="showBackConfirm"
      title="Unsaved Sets"
      message="You have unsaved sets. Are you sure you want to go back? Your progress will be lost."
      confirm-text="Discard"
      cancel-text="Keep Editing"
      danger
      @confirm="router.back()"
      @cancel="showBackConfirm = false"
    />

    <RestTimer />
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { useWorkoutStore } from '~/stores/workout'
import type { PainRating } from '~/types'

const route = useRoute()
const router = useRouter()
const store = useWorkoutStore()

const exerciseId = computed(() => route.params.id as string)
const exercise = computed(() =>
  store.state.exercises.find(e => e.id === exerciseId.value)
)

// Load existing data if available
const existingLog = computed(() =>
  store.todayLogs.find(log => log.exerciseId === exerciseId.value)
)

const machineSetup = ref(store.state.machineSettings[exerciseId.value] || '')

// Initialize sets with smart defaults
const getDefaultSets = () => {
  if (existingLog.value?.sets) {
    return existingLog.value.sets
  }

  // Try to use ghost data first, then exercise defaults
  const ghost = store.getGhost(exerciseId.value)
  const defaultWeight = ghost?.sets[0]?.weight || exercise.value?.defaultWeight || 0
  const defaultReps = ghost?.sets[0]?.reps || exercise.value?.defaultReps || 0

  return [
    { weight: defaultWeight, reps: defaultReps, completed: false },
    { weight: defaultWeight, reps: defaultReps, completed: false },
    { weight: defaultWeight, reps: defaultReps, completed: false }
  ]
}

const sets = ref(getDefaultSets())
const rating = ref<PainRating>(existingLog.value?.rating || 'strong')
const showBackConfirm = ref(false)

// Watch for route changes to reset data when navigating to a different exercise
watch(() => route.params.id, (newId) => {
  const newExerciseId = newId as string
  const newExistingLog = store.todayLogs.find(log => log.exerciseId === newExerciseId)
  const newExercise = store.state.exercises.find(e => e.id === newExerciseId)

  machineSetup.value = store.state.machineSettings[newExerciseId] || ''

  // Use smart defaults for new exercise
  if (newExistingLog?.sets) {
    sets.value = newExistingLog.sets
  } else {
    const ghost = store.getGhost(newExerciseId)
    const defaultWeight = ghost?.sets[0]?.weight || newExercise?.defaultWeight || 0
    const defaultReps = ghost?.sets[0]?.reps || newExercise?.defaultReps || 0

    sets.value = [
      { weight: defaultWeight, reps: defaultReps, completed: false },
      { weight: defaultWeight, reps: defaultReps, completed: false },
      { weight: defaultWeight, reps: defaultReps, completed: false }
    ]
  }

  rating.value = newExistingLog?.rating || 'strong'
})

const ghost = computed(() => store.getGhost(exerciseId.value))
const ironAudit = computed(() => store.getIronAudit(exerciseId.value))

const hasCompletedSets = computed(() =>
  sets.value.some(set => set.completed)
)

const repFeedback = computed(() => {
  const completedSets = sets.value.filter(s => s.completed)
  if (completedSets.length === 0) return null

  const targetMin = exercise.value?.repRangeMin || 0
  const targetMax = exercise.value?.repRangeMax || 0

  const allInRange = completedSets.every(
    s => s.reps >= targetMin && s.reps <= targetMax
  )
  const allAboveRange = completedSets.every(s => s.reps > targetMax)
  const allBelowRange = completedSets.every(s => s.reps < targetMin)

  if (allInRange) {
    return {
      type: 'success' as const,
      message: `✓ Perfect! All sets in the ${targetMin}-${targetMax} rep target zone.`
    }
  } else if (allAboveRange) {
    return {
      type: 'warning' as const,
      message: `⚠️ All sets above ${targetMax} reps - consider adding weight next time.`
    }
  } else if (allBelowRange) {
    return {
      type: 'danger' as const,
      message: `⚠️ All sets below ${targetMin} reps - weight might be too heavy.`
    }
  } else {
    return {
      type: 'warning' as const,
      message: `Some sets outside ${targetMin}-${targetMax} rep range. Aim for consistency.`
    }
  }
})

const saveMachineSetup = () => {
  store.saveMachineSetting(exerciseId.value, machineSetup.value)
}

const onSetComplete = (index: number) => {
  // Auto-start rest timer
  store.startRestTimer(exerciseId.value, 90)
}

const handleBack = () => {
  // Check if there are unsaved changes (completed sets)
  const hasUnsavedChanges = hasCompletedSets.value && !existingLog.value

  if (hasUnsavedChanges) {
    showBackConfirm.value = true
  } else {
    router.back()
  }
}

const saveAndReturn = () => {
  if (!hasCompletedSets.value) return

  store.saveWorkoutLog(
    exerciseId.value,
    sets.value,
    rating.value
  )

  router.back()
}

onMounted(() => {
  // Redirect if workout not active
  if (!store.state.workoutActive) {
    router.push('/')
  }
})
</script>
