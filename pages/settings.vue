<script setup lang="ts">
import { ref } from 'vue'
import { useWorkoutStore } from '~/stores/workout'
import { BUILT_IN_PROGRAMS } from '~/data/built-in-programs'

const store = useWorkoutStore()
const dataFileInput = ref<HTMLInputElement | null>(null)
const programFileInput = ref<HTMLInputElement | null>(null)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const builtInPrograms = BUILT_IN_PROGRAMS

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

// Handle selecting a built-in program
const handleSelectBuiltInProgram = (programId: string) => {
  const program = builtInPrograms.find(p => p.id === programId)
  if (program) {
    store.activateBuiltInProgram(program)
    showSuccess(`${program.name} activated`)
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
  <div class="min-h-screen bg-background p-4 md:p-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(8rem+env(safe-area-inset-bottom))]">
    <!-- Header -->
    <div class="mb-6 md:mb-8">
      <!-- Back to Workout (shown when workout is active) -->
      <NuxtLink
        v-if="store.state.workoutActive"
        to="/workout"
        class="inline-flex items-center gap-2 text-accent-green hover:underline mb-3 min-h-11 active:opacity-70 transition-opacity"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="text-base font-medium">Back to Workout</span>
      </NuxtLink>

      <!-- Back to Home (shown when no workout is active) -->
      <NuxtLink
        v-else
        to="/"
        class="inline-flex items-center gap-2 text-accent-green hover:underline mb-3 min-h-11 active:opacity-70 transition-opacity"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="text-base font-medium">Back to Home</span>
      </NuxtLink>

      <h1 class="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Settings</h1>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-accent-green/10 border-2 border-accent-green/30 rounded-xl text-accent-green font-medium"
    >
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-500 font-medium"
    >
      {{ errorMessage }}
    </div>

    <!-- Data Management Section -->
    <section class="mb-8 md:mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">Data Management</h2>

      <div class="space-y-3">
        <!-- Export Data -->
        <div class="p-5 bg-foreground/5 border border-border rounded-xl">
          <h3 class="text-base font-semibold text-foreground mb-1.5">Export Data</h3>
          <p class="text-sm text-foreground/60 mb-4 leading-relaxed">
            Download a complete backup of all your workout data as JSON.
          </p>
          <button
            @click="handleExportData"
            class="w-full min-h-12 px-6 bg-accent-green text-background rounded-xl font-semibold hover:bg-accent-green/90 active:scale-[0.98] transition-all shadow-sm"
          >
            Export Data
          </button>
        </div>

        <!-- Import Data -->
        <div class="p-5 bg-foreground/5 border border-border rounded-xl">
          <h3 class="text-base font-semibold text-foreground mb-1.5">Import Data</h3>
          <p class="text-sm text-foreground/60 mb-4 leading-relaxed">
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
            class="w-full min-h-12 px-6 bg-foreground/10 text-foreground rounded-xl font-semibold hover:bg-foreground/20 active:scale-[0.98] transition-all"
          >
            Import Data
          </button>
        </div>

        <!-- localStorage Info -->
        <div class="p-5 bg-foreground/5 border border-border rounded-xl">
          <h3 class="text-base font-semibold text-foreground mb-1.5">About Data Storage</h3>
          <p class="text-sm text-foreground/60 leading-relaxed">
            Your workout data is stored locally in your browser. Data persists indefinitely unless you:
          </p>
          <ul class="text-sm text-foreground/60 mt-3 space-y-1.5 list-disc list-inside">
            <li>Clear browser data/cache</li>
            <li>Use incognito/private mode</li>
            <li>Uninstall the browser</li>
          </ul>
          <p class="text-sm text-accent-green mt-4 font-medium">
            Recommendation: Export your data regularly as backup.
          </p>
        </div>
      </div>
    </section>

    <!-- Program Management Section -->
    <section>
      <h2 class="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">Workout Programs</h2>

      <!-- Current Program Status (if active) -->
      <div v-if="store.hasActiveProgram" class="mb-6">
        <div class="p-5 bg-accent-green/10 border-2 border-accent-green/30 rounded-xl">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-5 h-5 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium text-accent-green uppercase tracking-wide">Active Program</span>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-1 truncate">
                {{ store.state.programState.currentProgram?.name }}
              </h3>
              <p class="text-sm text-foreground/70 leading-relaxed">
                {{ store.state.programState.currentProgram?.description }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg">
            <svg class="w-4 h-4 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm text-foreground/80">
              <span class="font-semibold text-foreground">{{ store.currentProgramDay?.name }}</span>
              <span class="text-foreground/60"> (Day {{ store.currentProgramDay?.dayNumber || 0 }})</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Program Selection -->
      <div class="mb-6">
        <div class="mb-3">
          <h3 class="text-base font-semibold text-foreground mb-1">
            {{ store.hasActiveProgram ? 'Switch Program' : 'Select a Program' }}
          </h3>
          <p class="text-sm text-foreground/60 leading-relaxed">
            {{ store.hasActiveProgram ? 'Choose a different workout program' : 'Choose from pre-configured workout programs' }}
          </p>
        </div>

        <div class="space-y-3">
          <button
            v-for="program in builtInPrograms"
            :key="program.id"
            @click="handleSelectBuiltInProgram(program.id)"
            :class="[
              'group w-full min-h-[72px] p-5 rounded-xl border-2 text-left transition-all duration-200',
              store.state.programState.currentProgram?.id === program.id
                ? 'bg-accent-green/10 border-accent-green shadow-lg shadow-accent-green/10 ring-2 ring-accent-green/20'
                : 'bg-background border-border hover:border-accent-green/40 hover:bg-foreground/5 active:scale-[0.98]'
            ]"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <span
                    :class="[
                      'text-base font-bold leading-tight',
                      store.state.programState.currentProgram?.id === program.id
                        ? 'text-accent-green'
                        : 'text-foreground group-hover:text-accent-green transition-colors'
                    ]"
                  >
                    {{ program.name }}
                  </span>
                  <span
                    v-if="store.state.programState.currentProgram?.id === program.id"
                    class="inline-flex items-center px-2 py-0.5 rounded-md bg-accent-green text-background text-xs font-bold uppercase tracking-wide"
                  >
                    Active
                  </span>
                </div>
                <p
                  :class="[
                    'text-sm leading-relaxed',
                    store.state.programState.currentProgram?.id === program.id
                      ? 'text-accent-green/80'
                      : 'text-foreground/60 group-hover:text-foreground/80 transition-colors'
                  ]"
                >
                  {{ program.description }}
                </p>
              </div>
              <div
                :class="[
                  'flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold',
                  store.state.programState.currentProgram?.id === program.id
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-foreground/5 text-foreground/60 group-hover:bg-accent-green/10 group-hover:text-accent-green transition-colors'
                ]"
              >
                {{ program.days.length }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Import Custom Program -->
      <div class="mb-6">
        <div class="p-5 bg-foreground/5 border border-border rounded-xl">
          <h3 class="text-base font-semibold text-foreground mb-1.5">Import Custom Program</h3>
          <p class="text-sm text-foreground/60 mb-4 leading-relaxed">
            Import your own workout program from a JSON file
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
            class="w-full min-h-12 px-6 bg-foreground/10 text-foreground rounded-xl font-semibold hover:bg-foreground/20 active:scale-[0.98] transition-all"
          >
            Import from File
          </button>
        </div>
      </div>

      <!-- No Active Program Message -->
      <div v-if="!store.hasActiveProgram" class="mb-6">
        <div class="p-5 bg-foreground/5 border border-border rounded-xl">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-foreground/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-foreground/60 leading-relaxed">
              No active program. You're in free mode showing all exercises organized by phase.
            </p>
          </div>
        </div>
      </div>

      <!-- Active Program Controls -->
      <div v-else class="space-y-3">

        <!-- Day Selector -->
        <div class="p-5 bg-foreground/5 border border-border rounded-xl">
          <h3 class="text-base font-semibold text-foreground mb-1.5">Manual Day Override</h3>
          <p class="text-sm text-foreground/60 mb-4 leading-relaxed">
            Override the auto-rotation and manually select which day to do next.
          </p>
          <select
            :value="store.state.programState.currentDayIndex"
            @change="handleDayChange"
            class="w-full min-h-12 px-4 bg-background border-2 border-border rounded-xl text-foreground text-base font-medium focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:border-accent-green transition-all appearance-none cursor-pointer"
            style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25em; padding-right: 3rem;"
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
        <div class="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
          <h3 class="text-base font-semibold text-foreground mb-1.5">Clear Program</h3>
          <p class="text-sm text-foreground/60 mb-4 leading-relaxed">
            Return to free mode. Your workout history will be preserved.
          </p>
          <button
            @click="handleClearProgram"
            class="w-full min-h-12 px-6 bg-red-500/20 text-red-600 border-2 border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 hover:border-red-500/50 active:scale-[0.98] transition-all"
          >
            Clear Program
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
