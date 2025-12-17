<template>
  <div class="min-h-screen p-6 flex flex-col">
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">How are you feeling?</h1>
      <p class="text-foreground/60">Let's log your context before starting</p>
    </header>

    <div class="flex-1 space-y-8">
      <BaseSlider
        v-model="sleepQuality"
        label="Sleep Quality"
        :min="1"
        :max="10"
        min-label="Terrible"
        max-label="Perfect"
      />

      <BaseSlider
        v-model="energyLevel"
        label="Energy Level"
        :min="1"
        :max="10"
        min-label="Exhausted"
        max-label="Energized"
      />
    </div>

    <div class="mt-8">
      <BaseButton
        @click="saveAndContinue"
        class="w-full"
      >
        Continue to Warm-up
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'

const store = useWorkoutStore()
const router = useRouter()

const sleepQuality = ref(5)
const energyLevel = ref(5)

onMounted(() => {
  // Load today's context if it exists
  if (store.todayContext) {
    sleepQuality.value = store.todayContext.sleepQuality
    energyLevel.value = store.todayContext.energyLevel
  }
})

const saveAndContinue = () => {
  store.saveContext(sleepQuality.value, energyLevel.value)
  router.push('/gatekeeper')
}
</script>
