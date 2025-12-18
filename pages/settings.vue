<script setup lang="ts">
import { ref } from 'vue'
import { useWorkoutStore } from '~/stores/workout'

const store = useWorkoutStore()
const dataFileInput = ref<HTMLInputElement | null>(null)
const programFileInput = ref<HTMLInputElement | null>(null)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Handle export data
const handleExportData = () => {
  store.exportData()
  showSuccess('Data exported successfully')
}

// Handle import data (full backup)
const handleDataFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const result = store.importData(text)

    if (result.success) {
      showSuccess('Data imported successfully')
    } else {
      showError(result.error || 'Failed to import data')
    }
  } catch (error) {
    showError('Failed to read file')
  }

  input.value = ''
}

// Handle import program
const handleProgramFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const result = store.importProgram(text)

    if (result.success) {
      showSuccess('Program imported successfully')
    } else {
      showError(result.error || 'Failed to import program')
    }
  } catch (error) {
    showError('Failed to read file')
  }

  input.value = ''
}

// Handle clear program
const handleClearProgram = () => {
  if (confirm('Are you sure you want to clear the current program? You will return to free mode.')) {
    store.clearProgram()
    showSuccess('Program cleared')
  }
}

// Handle day change
const handleDayChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const dayIndex = parseInt(select.value)
  store.setProgramDay(dayIndex)
}

// Show success message
const showSuccess = (message: string) => {
  successMessage.value = message
  errorMessage.value = null
  setTimeout(() => {
    successMessage.value = null
  }, 3000)
}

// Show error message
const showError = (message: string) => {
  errorMessage.value = message
  successMessage.value = null
  setTimeout(() => {
    errorMessage.value = null
  }, 5000)
}
</script>

<template>
  <div class="min-h-screen bg-background p-6 pb-32">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-accent-green hover:underline mb-4"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </NuxtLink>
      <h1 class="text-3xl font-bold text-foreground">Settings</h1>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-accent-green/10 border border-accent-green/30 rounded-lg text-accent-green"
    >
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500"
    >
      {{ errorMessage }}
    </div>

    <!-- Data Management Section -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-foreground mb-4">Data Management</h2>

      <div class="space-y-4">
        <!-- Export Data -->
        <div class="p-4 bg-foreground/5 border border-border rounded-lg">
          <h3 class="font-medium text-foreground mb-2">Export Data</h3>
          <p class="text-sm text-foreground/60 mb-3">
            Download a complete backup of all your workout data as JSON.
          </p>
          <button
            @click="handleExportData"
            class="w-full px-4 py-2 bg-accent-green text-background rounded-lg font-medium hover:bg-accent-green/90 transition-colors"
          >
            Export Data
          </button>
        </div>

        <!-- Import Data -->
        <div class="p-4 bg-foreground/5 border border-border rounded-lg">
          <h3 class="font-medium text-foreground mb-2">Import Data</h3>
          <p class="text-sm text-foreground/60 mb-3">
            Restore your workout data from a previously exported backup file.
          </p>
          <input
            ref="dataFileInput"
            type="file"
            accept=".json"
            @change="handleDataFileChange"
            class="hidden"
          />
          <button
            @click="dataFileInput?.click()"
            class="w-full px-4 py-2 bg-foreground/10 text-foreground rounded-lg font-medium hover:bg-foreground/20 transition-colors"
          >
            Import Data
          </button>
        </div>

        <!-- localStorage Info -->
        <div class="p-4 bg-foreground/5 border border-border rounded-lg">
          <h3 class="font-medium text-foreground mb-2">About Data Storage</h3>
          <p class="text-sm text-foreground/60">
            Your workout data is stored locally in your browser. Data persists indefinitely unless you:
          </p>
          <ul class="text-sm text-foreground/60 mt-2 space-y-1 list-disc list-inside">
            <li>Clear browser data/cache</li>
            <li>Use incognito/private mode</li>
            <li>Uninstall the browser</li>
          </ul>
          <p class="text-sm text-accent-green mt-3">
            Recommendation: Export your data regularly as backup.
          </p>
        </div>
      </div>
    </section>

    <!-- Program Management Section -->
    <section>
      <h2 class="text-xl font-semibold text-foreground mb-4">Workout Programs</h2>

      <!-- No Active Program -->
      <div v-if="!store.hasActiveProgram" class="space-y-4">
        <div class="p-4 bg-foreground/5 border border-border rounded-lg">
          <h3 class="font-medium text-foreground mb-2">Import Program</h3>
          <p class="text-sm text-foreground/60 mb-3">
            Import a workout program to see only scheduled exercises for each day.
          </p>
          <input
            ref="programFileInput"
            type="file"
            accept=".json"
            @change="handleProgramFileChange"
            class="hidden"
          />
          <button
            @click="programFileInput?.click()"
            class="w-full px-4 py-2 bg-accent-green text-background rounded-lg font-medium hover:bg-accent-green/90 transition-colors"
          >
            Import Program
          </button>
        </div>

        <div class="p-4 bg-foreground/5 border border-border rounded-lg">
          <p class="text-sm text-foreground/60">
            No active program. You're in free mode showing all exercises organized by phase.
          </p>
        </div>
      </div>

      <!-- Active Program -->
      <div v-else class="space-y-4">
        <!-- Program Info -->
        <div class="p-4 bg-accent-green/10 border border-accent-green/30 rounded-lg">
          <h3 class="text-lg font-semibold text-accent-green mb-1">
            {{ store.state.programState.currentProgram?.name }}
          </h3>
          <p class="text-sm text-foreground/80 mb-3">
            {{ store.state.programState.currentProgram?.description }}
          </p>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-foreground/60">Current Day:</span>
            <span class="font-medium text-accent-green">
              {{ store.currentProgramDay?.name }} (Day {{ (store.currentProgramDay?.dayNumber || 0) }})
            </span>
          </div>
        </div>

        <!-- Day Selector -->
        <div class="p-4 bg-foreground/5 border border-border rounded-lg">
          <h3 class="font-medium text-foreground mb-2">Manual Day Override</h3>
          <p class="text-sm text-foreground/60 mb-3">
            Override the auto-rotation and manually select which day to do next.
          </p>
          <select
            :value="store.state.programState.currentDayIndex"
            @change="handleDayChange"
            class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            <option
              v-for="(day, index) in store.state.programState.currentProgram?.days"
              :key="index"
              :value="index"
            >
              Day {{ day.dayNumber }}: {{ day.name }}
            </option>
          </select>
        </div>

        <!-- Clear Program -->
        <div class="p-4 bg-foreground/5 border border-border rounded-lg">
          <h3 class="font-medium text-foreground mb-2">Clear Program</h3>
          <p class="text-sm text-foreground/60 mb-3">
            Return to free mode. Your workout history will be preserved.
          </p>
          <button
            @click="handleClearProgram"
            class="w-full px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
          >
            Clear Program
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
