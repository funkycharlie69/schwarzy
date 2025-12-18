import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { WorkoutState, Exercise, WorkoutLog, UserContext, PainRating, GhostSession, IronAuditSuggestion } from '~/types'

// Hardcoded exercises - The Rock's Arsenal
const DEFAULT_EXERCISES: Exercise[] = [
  // --- PHASE 1: REHAB & MACHINES (The Foundation) ---
  {
    id: 'leg-press',
    name: 'Leg Press (Machine)',
    defaultCue: 'Feet shoulder-width, NO knee locking, control the negative.',
    phase: 'rehab',
    repRangeMin: 12,
    repRangeMax: 15
  },
  {
    id: 'chest-press-machine',
    name: 'Chest Press (Machine)',
    defaultCue: 'Seat height: nipples aligned with handles. Tuck elbows slightly.',
    phase: 'rehab',
    repRangeMin: 12,
    repRangeMax: 15
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    defaultCue: 'Torso vertical, pull to belly button, squeeze shoulder blades.',
    phase: 'rehab',
    repRangeMin: 12,
    repRangeMax: 15
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    defaultCue: 'Lean back slightly, drive elbows down, do NOT pull with hands.',
    phase: 'rehab',
    repRangeMin: 12,
    repRangeMax: 15
  },
  {
    id: 'face-pulls',
    name: 'Cable Face Pulls',
    defaultCue: 'Thumbs back, pull to forehead, spread hands apart. SQUEEZE rear delts.',
    phase: 'rehab',
    repRangeMin: 15,
    repRangeMax: 20
  },
  {
    id: 'bicep-curl-machine',
    name: 'Bicep Curl (Machine)',
    defaultCue: 'Armpits over pad, slow curl, no swinging. Protect the elbow.',
    phase: 'rehab',
    repRangeMin: 12,
    repRangeMax: 15
  },
  {
    id: 'tricep-pushdown-rope',
    name: 'Tricep Pushdown (Rope)',
    defaultCue: 'Elbows glued to ribs, pull rope apart at bottom. Squeeze triceps.',
    phase: 'rehab',
    repRangeMin: 12,
    repRangeMax: 15
  },

  // --- PHASE 2: FREE WEIGHTS & STABILITY (The Transition) ---
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    defaultCue: 'Weight tight to chest, elbows inside knees, sit between heels.',
    phase: 'free-weights',
    repRangeMin: 10,
    repRangeMax: 12
  },
  {
    id: 'db-floor-press-neutral',
    name: 'DB Floor Press (Neutral Grip)',
    defaultCue: 'Palms face each other. Lower until elbows TAP floor. Press up.',
    phase: 'free-weights',
    repRangeMin: 10,
    repRangeMax: 12
  },
  {
    id: 'db-hammer-curl',
    name: 'DB Hammer Curls',
    defaultCue: 'Thumbs up grip. controlled movement. Best for elbow health.',
    phase: 'free-weights',
    repRangeMin: 10,
    repRangeMax: 12
  },
  {
    id: 'single-arm-db-row',
    name: 'Single Arm DB Row',
    defaultCue: 'Support on bench. Pull dumbbell to hip pocket. Flat back.',
    phase: 'free-weights',
    repRangeMin: 10,
    repRangeMax: 12
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    defaultCue: 'Torso upright, back knee almost touches floor, drive through front heel.',
    phase: 'free-weights',
    repRangeMin: 10,
    repRangeMax: 12
  },
  {
    id: 'plank',
    name: 'Plank',
    defaultCue: 'Glutes squeezed, core tight, push floor away with forearms.',
    phase: 'free-weights',
    repRangeMin: 30,
    repRangeMax: 60
  },

  // --- PHASE 3: HYPERTROPHY & STRENGTH (The Future) ---
  {
    id: 'incline-db-press',
    name: 'Incline DB Press',
    defaultCue: 'Bench at 30 degrees. Control weights, feel the upper chest.',
    phase: 'hypertrophy',
    repRangeMin: 8,
    repRangeMax: 12
  },
  {
    id: 'romanian-deadlift-db',
    name: 'Romanian Deadlift (Dumbbells)',
    defaultCue: 'Hips back first, slight knee bend, feel hamstring stretch. Flat back.',
    phase: 'hypertrophy',
    repRangeMin: 8,
    repRangeMax: 12
  },
  {
    id: 'assisted-pull-up',
    name: 'Assisted Pull-Up',
    defaultCue: 'Full stretch at bottom, chest to bar at top. No shrugging.',
    phase: 'hypertrophy',
    repRangeMin: 6,
    repRangeMax: 10
  },
  {
    id: 'cable-chest-fly',
    name: 'Cable Chest Fly',
    defaultCue: 'Slight bend in elbows, hug a big tree. Squeeze chest at center.',
    phase: 'hypertrophy',
    repRangeMin: 10,
    repRangeMax: 15
  },
  {
    id: 'overhead-press-seated-db',
    name: 'Seated DB Overhead Press',
    defaultCue: 'Core tight, press up but do not lock out fully. Keep elbows forward.',
    phase: 'hypertrophy',
    repRangeMin: 8,
    repRangeMax: 12
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    defaultCue: 'Toes up, squeeze quads at top. Do not kick, CONTROL.',
    phase: 'hypertrophy',
    repRangeMin: 10,
    repRangeMax: 15
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl (Seated/Lying)',
    defaultCue: 'Hips down, curl heels to butt. Squeeze hamstrings.',
    phase: 'hypertrophy',
    repRangeMin: 10,
    repRangeMax: 15
  }
];

export const useWorkoutStore = defineStore('workout', () => {
  // Reactive localStorage state
  const state = useStorage<WorkoutState>('schwarzy-workout-data', {
    userContext: [],
    exercises: DEFAULT_EXERCISES,
    logs: [],
    machineSettings: {},
    workoutActive: false,
    currentWorkoutDate: null,
    restTimerState: {
      exerciseId: null,
      endTime: null,
      originalDuration: 90
    },
    programState: {
      currentProgram: null,
      currentDayIndex: 0,
      lastWorkoutDate: null
    }
  })

  // Migration: Update exercises if they're missing new properties
  const migrateExercises = () => {
    const firstExercise = state.value.exercises[0]
    if (firstExercise && !('phase' in firstExercise)) {
      // Old data detected, update with new exercises
      state.value.exercises = DEFAULT_EXERCISES
    }

    // Migrate programState if missing
    if (!state.value.programState) {
      state.value.programState = {
        currentProgram: null,
        currentDayIndex: 0,
        lastWorkoutDate: null
      }
    }
  }
  migrateExercises()

  // Getters
  const todayDate = computed(() => new Date().toISOString().split('T')[0])

  const todayContext = computed(() =>
    state.value.userContext.find(ctx => ctx.date === todayDate.value)
  )

  const todayLogs = computed(() =>
    state.value.logs.filter(log => log.date === todayDate.value)
  )

  // Program-related getters
  const hasActiveProgram = computed(() => {
    return state.value.programState.currentProgram !== null
  })

  const currentProgramDay = computed(() => {
    const program = state.value.programState.currentProgram
    if (!program) return null
    return program.days[state.value.programState.currentDayIndex]
  })

  const todayExercises = computed(() => {
    const program = state.value.programState.currentProgram
    if (!program) return state.value.exercises

    const currentDay = program.days[state.value.programState.currentDayIndex]
    return state.value.exercises.filter(ex =>
      currentDay.exerciseIds.includes(ex.id)
    )
  })

  // Get last session for an exercise (excluding today)
  const getLastSession = (exerciseId: string): WorkoutLog | null => {
    const pastLogs = state.value.logs
      .filter(log => log.exerciseId === exerciseId && log.date !== todayDate.value)
      .sort((a, b) => b.date.localeCompare(a.date))

    return pastLogs[0] || null
  }

  // Get Ghost (previous session summary)
  const getGhost = (exerciseId: string): GhostSession | null => {
    const lastSession = getLastSession(exerciseId)
    if (!lastSession) return null

    const totalVolume = lastSession.sets.reduce(
      (sum, set) => sum + (set.weight * set.reps),
      0
    )

    return {
      date: lastSession.date,
      sets: lastSession.sets,
      rating: lastSession.rating,
      totalVolume
    }
  }

  // Get Iron Audit suggestion
  const getIronAudit = (exerciseId: string): IronAuditSuggestion => {
    const lastSession = getLastSession(exerciseId)

    if (!lastSession) {
      return {
        type: 'maintain',
        suggestedWeight: null,
        message: 'First time doing this exercise. Start with a comfortable weight.',
        severity: 'success'
      }
    }

    const lastWeight = lastSession.sets[0]?.weight || 0
    const lastRating = lastSession.rating

    if (lastRating === 'flawless') {
      return {
        type: 'increase',
        suggestedWeight: lastWeight + 5,
        message: `💎 Flawless execution! Try +5kg today (${(lastWeight + 5).toFixed(1)}kg)`,
        severity: 'success'
      }
    }

    if (lastRating === 'strong') {
      return {
        type: 'increase',
        suggestedWeight: lastWeight + 2.5,
        message: `Suggestion: Try +2.5kg today (${(lastWeight + 2.5).toFixed(1)}kg)`,
        severity: 'success'
      }
    }

    if (lastRating === 'danger') {
      const reducedWeight = Math.round(lastWeight * 0.9 * 2) / 2 // Round to nearest 0.5kg
      return {
        type: 'decrease',
        suggestedWeight: reducedWeight,
        message: `⚠️ DANGER: Drop weight 10% & Slow Down (${reducedWeight.toFixed(1)}kg)`,
        severity: 'danger'
      }
    }

    // 'compromised' rating - maintain
    return {
      type: 'maintain',
      suggestedWeight: lastWeight,
      message: `Maintain ${lastWeight.toFixed(1)}kg - focus on form today`,
      severity: 'warning'
    }
  }

  // Get last 10 sessions for chart
  const getWeightHistory = (exerciseId: string) => {
    return state.value.logs
      .filter(log => log.exerciseId === exerciseId)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10)
      .map(log => ({
        date: log.date,
        maxWeight: Math.max(...log.sets.map(s => s.weight)),
        avgWeight: log.sets.reduce((sum, s) => sum + s.weight, 0) / log.sets.length
      }))
  }

  // Actions
  const saveContext = (sleepQuality: number, energyLevel: number) => {
    const existingIndex = state.value.userContext.findIndex(
      ctx => ctx.date === todayDate.value
    )

    const newContext: UserContext = {
      date: todayDate.value,
      sleepQuality,
      energyLevel
    }

    if (existingIndex >= 0) {
      state.value.userContext[existingIndex] = newContext
    } else {
      state.value.userContext.push(newContext)
    }
  }

  const startWorkout = () => {
    state.value.workoutActive = true
    state.value.currentWorkoutDate = todayDate.value
  }

  const saveMachineSetting = (exerciseId: string, setting: string) => {
    state.value.machineSettings[exerciseId] = setting
  }

  const saveWorkoutLog = (
    exerciseId: string,
    sets: { weight: number; reps: number; completed: boolean }[],
    rating: PainRating
  ) => {
    const existingIndex = state.value.logs.findIndex(
      log => log.date === todayDate.value && log.exerciseId === exerciseId
    )

    const newLog: WorkoutLog = {
      date: todayDate.value,
      exerciseId,
      sets,
      rating
    }

    if (existingIndex >= 0) {
      state.value.logs[existingIndex] = newLog
    } else {
      state.value.logs.push(newLog)
    }
  }

  const finishWorkout = () => {
    // Auto-advance program day if using a program
    const program = state.value.programState.currentProgram
    if (program) {
      const nextDayIndex = (state.value.programState.currentDayIndex + 1) % program.days.length
      state.value.programState.currentDayIndex = nextDayIndex
      state.value.programState.lastWorkoutDate = todayDate.value
    }

    state.value.workoutActive = false
    state.value.currentWorkoutDate = null
    state.value.restTimerState = {
      exerciseId: null,
      endTime: null,
      originalDuration: 90
    }
  }

  const startRestTimer = (exerciseId: string, durationSeconds: number = 90) => {
    state.value.restTimerState = {
      exerciseId,
      endTime: Date.now() + (durationSeconds * 1000),
      originalDuration: durationSeconds
    }
  }

  const extendRestTimer = (additionalSeconds: number = 30) => {
    if (state.value.restTimerState.endTime) {
      state.value.restTimerState.endTime += additionalSeconds * 1000
      state.value.restTimerState.originalDuration += additionalSeconds
    }
  }

  const clearRestTimer = () => {
    state.value.restTimerState = {
      exerciseId: null,
      endTime: null,
      originalDuration: 90
    }
  }

  const getTotalVolume = (): number => {
    return todayLogs.value.reduce((total, log) => {
      const logVolume = log.sets.reduce(
        (sum, set) => sum + (set.weight * set.reps),
        0
      )
      return total + logVolume
    }, 0)
  }

  // Export data as JSON file
  const exportData = () => {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: state.value
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `schwarzy-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import full backup data
  const importData = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const imported = JSON.parse(jsonString)
      if (!imported.version || !imported.data) {
        return { success: false, error: 'Invalid backup file format' }
      }

      state.value = imported.data
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to parse JSON file' }
    }
  }

  // Import workout program
  const importProgram = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const imported = JSON.parse(jsonString)
      if (!imported.version || !imported.program) {
        return { success: false, error: 'Invalid program file format' }
      }

      const programData = imported.program

      // Validate structure
      if (!programData.name || !programData.days || !Array.isArray(programData.days)) {
        return { success: false, error: 'Invalid program structure' }
      }

      // Merge new exercises if provided
      if (programData.exercises && Array.isArray(programData.exercises)) {
        programData.exercises.forEach((newExercise: Exercise) => {
          const exists = state.value.exercises.find(ex => ex.id === newExercise.id)
          if (!exists) {
            state.value.exercises.push(newExercise)
          }
        })
      }

      // Validate all exercise IDs exist
      const allExerciseIds = new Set(state.value.exercises.map(ex => ex.id))
      for (const day of programData.days) {
        for (const exerciseId of day.exerciseIds) {
          if (!allExerciseIds.has(exerciseId)) {
            return {
              success: false,
              error: `Exercise ID "${exerciseId}" not found`
            }
          }
        }
      }

      // Create program
      const program = {
        id: `program-${Date.now()}`,
        name: programData.name,
        description: programData.description || '',
        days: programData.days,
        createdAt: new Date().toISOString()
      }

      // Update program state
      state.value.programState = {
        currentProgram: program,
        currentDayIndex: 0,
        lastWorkoutDate: null
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to parse JSON file' }
    }
  }

  // Clear current program
  const clearProgram = () => {
    state.value.programState = {
      currentProgram: null,
      currentDayIndex: 0,
      lastWorkoutDate: null
    }
  }

  // Manually set program day
  const setProgramDay = (dayIndex: number) => {
    const program = state.value.programState.currentProgram
    if (!program) return

    if (dayIndex >= 0 && dayIndex < program.days.length) {
      state.value.programState.currentDayIndex = dayIndex
    }
  }

  // Get Google Image Search URL for exercise
  const getExerciseImageSearchUrl = (exercise: Exercise): string => {
    const query = exercise.imageSearchQuery || `${exercise.name} gym machine`
    return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`
  }

  return {
    // State
    state,

    // Getters
    todayDate,
    todayContext,
    todayLogs,
    hasActiveProgram,
    currentProgramDay,
    todayExercises,

    // Methods
    getLastSession,
    getGhost,
    getIronAudit,
    getWeightHistory,
    getTotalVolume,
    saveContext,
    startWorkout,
    saveMachineSetting,
    saveWorkoutLog,
    finishWorkout,
    startRestTimer,
    extendRestTimer,
    clearRestTimer,
    exportData,
    importData,
    importProgram,
    clearProgram,
    setProgramDay,
    getExerciseImageSearchUrl
  }
})
