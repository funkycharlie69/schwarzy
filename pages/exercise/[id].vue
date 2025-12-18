<template>
  <div :key="exerciseId" class="min-h-screen pb-32">
    <!-- Header -->
    <div class="sticky top-0 bg-background border-b border-border p-6 z-10">
      <button
        @click="handleBack"
        class="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4"
      >
        <ChevronLeft :size="20" />
        Back
      </button>

      <h1 class="text-2xl font-bold mb-1">{{ exercise?.name }}</h1>
      <p class="text-sm text-foreground/60 mb-2">{{ exercise?.defaultCue }}</p>

      <a
        v-if="exercise"
        :href="store.getExerciseImageSearchUrl(exercise)"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-sm text-accent-green hover:underline mb-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        View exercise images
      </a>

      <div class="mt-2 inline-block px-3 py-1 bg-accent-green/20 border border-accent-green/40 rounded-full">
        <span class="text-xs font-semibold text-accent-green">
          Target: {{ exercise?.repRangeMin }}-{{ exercise?.repRangeMax }} reps
        </span>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- The Ghost -->
      <GhostDisplay :ghost="ghost" />

      <!-- Machine Setup -->
      <div>
        <label class="text-sm font-medium text-foreground/80 mb-2 block">
          Machine Setup
        </label>
        <BaseInput
          v-model="machineSetup"
          placeholder="e.g., Seat 5, Back 3"
          @blur="saveMachineSetup"
        />
      </div>

      <!-- Iron Audit Banner -->
      <IronAuditBanner :suggestion="ironAudit" />

      <!-- Sets -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold">Sets</h3>

        <SetInput
          v-for="(set, index) in sets"
          :key="index"
          v-model="sets[index]"
          @complete="onSetComplete(index)"
        />

        <!-- Rep Range Feedback -->
        <div
          v-if="repFeedback"
          :class="[
            'p-3 rounded-lg border text-sm',
            repFeedback.type === 'success' ? 'bg-accent-green/10 border-accent-green/30 text-accent-green' : '',
            repFeedback.type === 'warning' ? 'bg-accent-yellow/10 border-accent-yellow/30 text-accent-yellow' : '',
            repFeedback.type === 'danger' ? 'bg-accent-red/10 border-accent-red/30 text-accent-red' : ''
          ]"
        >
          {{ repFeedback.message }}
        </div>
      </div>

      <!-- Pain Rating -->
      <div>
        <h3 class="text-lg font-semibold mb-3">How did it feel?</h3>
        <PainToggle v-model="rating" />
      </div>

      <!-- Save Button -->
      <BaseButton
        @click="saveAndReturn"
        :disabled="!hasCompletedSets"
        class="w-full"
      >
        Save Exercise
      </BaseButton>
    </div>

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
const sets = ref(
  existingLog.value?.sets || [
    { weight: 0, reps: 0, completed: false },
    { weight: 0, reps: 0, completed: false },
    { weight: 0, reps: 0, completed: false }
  ]
)
const rating = ref<PainRating>(existingLog.value?.rating || 'strong')

// Watch for route changes to reset data when navigating to a different exercise
watch(() => route.params.id, (newId) => {
  const newExerciseId = newId as string
  const newExistingLog = store.todayLogs.find(log => log.exerciseId === newExerciseId)

  machineSetup.value = store.state.machineSettings[newExerciseId] || ''
  sets.value = newExistingLog?.sets || [
    { weight: 0, reps: 0, completed: false },
    { weight: 0, reps: 0, completed: false },
    { weight: 0, reps: 0, completed: false }
  ]
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
    const confirmed = confirm(
      'You have unsaved sets. Are you sure you want to go back? Your progress will be lost.'
    )

    if (!confirmed) return
  }

  router.back()
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
