<template>
  <Transition name="timer-overlay">
    <div
      v-if="isActive"
      class="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
    >
      <!-- Skip button top right -->
      <button
        @click="clearTimer"
        class="absolute top-[calc(1.5rem+env(safe-area-inset-top))] right-6 text-base font-semibold text-foreground/60 hover:text-foreground active:text-accent-red px-4 py-2 min-h-[44px]"
      >
        Skip Rest
      </button>

      <!-- Rest Timer Label -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-foreground/70 text-center">Rest Timer</h2>
      </div>

      <!-- Circular Progress Ring -->
      <div class="relative w-80 h-80 mb-12">
        <!-- Background circle -->
        <svg class="absolute inset-0 -rotate-90" viewBox="0 0 320 320">
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            stroke-width="16"
            class="text-foreground/10"
          />
          <!-- Progress circle -->
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            :stroke="remainingSeconds <= 10 ? '#ef4444' : remainingSeconds <= 30 ? '#eab308' : '#22c55e'"
            stroke-width="16"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeOffset"
            class="transition-all duration-300 ease-linear"
          />
        </svg>

        <!-- Time display in center -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-8xl font-bold font-mono tabular-nums tracking-tight">
            {{ formatTime(remainingSeconds) }}
          </div>
        </div>
      </div>

      <!-- Action button -->
      <button
        @click="extendTimer"
        class="w-full max-w-xs h-16 bg-foreground text-background rounded-xl font-bold text-lg active:scale-95 transition-transform shadow-lg"
      >
        Add 30 Seconds
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useHaptic } from '~/composables/useHaptic'

const store = useWorkoutStore()
const { haptic } = useHaptic()

const isActive = computed(() => store.state.restTimerState.endTime !== null)

const remainingSeconds = ref(0)
const progress = ref(100)
const alerted = ref(false)

// Circular progress ring calculations
const radius = 140
const circumference = 2 * Math.PI * radius
const strokeOffset = computed(() => {
  // Progress goes from 100 to 0, stroke-dashoffset goes from 0 to circumference
  return circumference * (1 - progress.value / 100)
})

let intervalId: NodeJS.Timeout | null = null

const updateTimer = () => {
  if (!store.state.restTimerState.endTime) {
    remainingSeconds.value = 0
    progress.value = 0
    return
  }

  const now = Date.now()
  const remaining = Math.max(0, store.state.restTimerState.endTime - now)
  remainingSeconds.value = Math.ceil(remaining / 1000)

  const elapsed = (store.state.restTimerState.originalDuration * 1000) - remaining
  progress.value = Math.max(0, Math.min(100, 100 - (elapsed / (store.state.restTimerState.originalDuration * 1000) * 100)))

  if (remaining === 0) {
    clearTimer()
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const extendTimer = () => {
  store.extendRestTimer(30)
}

const clearTimer = () => {
  store.clearRestTimer()
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

watch(isActive, (active) => {
  if (active) {
    alerted.value = false
    updateTimer()
    intervalId = setInterval(updateTimer, 100)
  } else if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}, { immediate: true })

watch(remainingSeconds, (newValue) => {
  if (newValue === 0 && !alerted.value && isActive.value) {
    // Haptic feedback
    haptic('warning')

    // Repeat haptic for emphasis
    setTimeout(() => haptic('warning'), 300)

    alerted.value = true
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.timer-overlay-enter-active,
.timer-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.timer-overlay-enter-from,
.timer-overlay-leave-to {
  opacity: 0;
}

.timer-overlay-enter-active > div,
.timer-overlay-leave-active > div {
  transition: transform 0.3s ease;
}

.timer-overlay-enter-from > div {
  transform: scale(0.9);
}

.timer-overlay-leave-to > div {
  transform: scale(0.9);
}
</style>
