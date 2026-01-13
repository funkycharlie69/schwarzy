<template>
  <div :key="exerciseId" class="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))]">
    <!-- Header -->
    <div class="sticky top-0 bg-background border-b border-border px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] z-10">
      <div class="flex items-center justify-between mb-3">
        <button
          @click="handleBack"
          class="flex items-center gap-2 min-h-[44px] min-w-[44px] -ml-3 px-3 rounded-lg active:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground"
        >
          <ChevronLeft :size="20" />
          <span class="text-sm font-medium">Back</span>
        </button>

        <!-- Settings Button -->
        <NuxtLink
          to="/settings"
          class="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 active:bg-foreground/20 transition-colors touch-manipulation"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </NuxtLink>
      </div>

      <div class="flex items-start justify-between gap-3 mb-2">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold leading-tight mb-1">{{ exercise?.name }}</h1>
          <p class="text-sm text-foreground/60 leading-snug">{{ exercise?.defaultCue }}</p>
        </div>
        <div class="flex">
          <div class="px-2.5 py-1 bg-accent-green/20 border border-accent-green/40 rounded-md items-center">
            <span class="text-lg font-bold text-accent-green text-wrap">
              {{ exercise?.repRangeMin }}-{{ exercise?.repRangeMax }} <br />reps target
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
        <span class="font-medium">View image of machine/exercise</span>
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
          :can-remove="sets.length > 1"
          @complete="onSetComplete(index)"
          @remove="removeSet(index)"
        />

        <!-- Add Set Button -->
        <button
          @click="addSet"
          class="w-full h-14 flex items-center justify-center gap-2 bg-foreground/5 border-2 border-dashed border-border hover:border-accent-green/40 hover:bg-foreground/10 rounded-lg font-semibold text-base transition-all active:scale-[0.98]"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Set</span>
        </button>

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
      :is-open="showDeleteConfirm"
      title="Delete Completed Set?"
      message="This set has been logged. Are you sure you want to delete it?"
      confirm-text="Delete"
      cancel-text="Cancel"
      danger
      @confirm="confirmDeleteSet"
      @cancel="showDeleteConfirm = false"
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

// Auto-save when rating changes (if there are completed sets)
watch(rating, () => {
  if (hasCompletedSets.value) {
    autoSave()
  }
})

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
  // Auto-save whenever a set is completed
  autoSave()

  // Auto-start rest timer
  store.startRestTimer(exerciseId.value, 90)
}

const addSet = () => {
  // Get the last set's values as template
  const lastSet = sets.value[sets.value.length - 1]
  const newSet = {
    weight: lastSet.weight,
    reps: lastSet.reps,
    completed: false
  }
  sets.value.push(newSet)
}

const showDeleteConfirm = ref(false)
const setToDelete = ref<number | null>(null)

const removeSet = (index: number) => {
  // Prevent removing the last set
  if (sets.value.length <= 1) return

  // If the set is completed, show confirmation
  if (sets.value[index].completed) {
    setToDelete.value = index
    showDeleteConfirm.value = true
  } else {
    // Uncompleted sets can be deleted immediately
    sets.value.splice(index, 1)
  }
}

const confirmDeleteSet = () => {
  if (setToDelete.value !== null) {
    sets.value.splice(setToDelete.value, 1)
    autoSave() // Update the store after deletion
    router.go(0) // Refresh the page
  }
  showDeleteConfirm.value = false
  setToDelete.value = null
}

const handleBack = () => {
  // Auto-save before navigating back
  if (hasCompletedSets.value) {
    autoSave()
  }
  router.back()
}

const autoSave = () => {
  // Only auto-save if there are completed sets
  if (!hasCompletedSets.value) return

  store.saveWorkoutLog(
    exerciseId.value,
    sets.value,
    rating.value
  )
}

const saveAndReturn = () => {
  if (!hasCompletedSets.value) return

  // Final save with current rating
  autoSave()

  router.back()
}

onMounted(() => {
  // Redirect if workout not active
  if (!store.state.workoutActive) {
    router.push('/')
  }
})
</script>
