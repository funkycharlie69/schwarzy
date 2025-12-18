export type PainRating = 'flawless' | 'strong' | 'compromised' | 'danger'

export interface UserContext {
  date: string // ISO date string YYYY-MM-DD
  sleepQuality: number // 1-10
  energyLevel: number // 1-10
}

export interface Exercise {
  id: string
  name: string
  defaultCue: string
  phase: 'rehab' | 'free-weights' | 'hypertrophy'
  repRangeMin: number
  repRangeMax: number
  imageSearchQuery?: string // Optional custom search query for Google Images
}

export interface Set {
  weight: number // kg
  reps: number
  completed: boolean
}

export interface WorkoutLog {
  date: string // ISO date string YYYY-MM-DD
  exerciseId: string
  sets: Set[]
  rating: PainRating
}

export interface WorkoutProgram {
  id: string
  name: string
  description: string
  days: ProgramDay[]
  createdAt: string
}

export interface ProgramDay {
  dayNumber: number
  name: string
  exerciseIds: string[]
}

export interface ProgramState {
  currentProgram: WorkoutProgram | null
  currentDayIndex: number
  lastWorkoutDate: string | null
}

export interface WorkoutState {
  userContext: UserContext[]
  exercises: Exercise[]
  logs: WorkoutLog[]
  machineSettings: Record<string, string> // exerciseId -> settings text
  workoutActive: boolean
  currentWorkoutDate: string | null // ISO date for active workout
  restTimerState: {
    exerciseId: string | null
    endTime: number | null // timestamp
    originalDuration: number // seconds
  }
  programState: ProgramState
}

export interface GhostSession {
  date: string
  sets: Set[]
  rating: PainRating
  totalVolume: number
}

export interface IronAuditSuggestion {
  type: 'increase' | 'decrease' | 'maintain'
  suggestedWeight: number | null
  message: string
  severity: 'success' | 'warning' | 'danger'
}
