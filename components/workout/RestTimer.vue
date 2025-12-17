<template>
  <div
    v-if="isActive"
    class="fixed bottom-0 left-0 right-0 bg-input border-t border-border p-4"
  >
    <div class="max-w-md mx-auto">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-foreground/60">Rest Timer</span>
        <button
          @click="clearTimer"
          class="text-sm text-foreground/60 hover:text-foreground"
        >
          Skip
        </button>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex-1">
          <div class="text-3xl font-bold font-mono">
            {{ formatTime(remainingSeconds) }}
          </div>
          <div class="w-full h-2 bg-background rounded-full mt-2 overflow-hidden">
            <div
              class="h-full bg-accent-green transition-all duration-1000"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>

        <button
          @click="extendTimer"
          class="touch-target bg-foreground text-background rounded-lg px-4 py-3 font-semibold"
        >
          +30s
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'

const store = useWorkoutStore()

const isActive = computed(() => store.state.restTimerState.endTime !== null)

const remainingSeconds = ref(0)
const progress = ref(100)

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
    updateTimer()
    intervalId = setInterval(updateTimer, 100)
  } else if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}, { immediate: true })

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
