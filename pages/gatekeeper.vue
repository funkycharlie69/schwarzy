<template>
  <div class="min-h-screen p-6 flex flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
    <header class="mb-8 mt-[env(safe-area-inset-top)]">
      <h1 class="text-3xl font-bold mb-2">Warm-up Checklist</h1>
      <p class="text-foreground/60">Complete these before starting your workout</p>
    </header>

    <div class="flex-1 space-y-4">
      <BaseCheckbox
        v-model="checks.cardio"
        label="5 Min Walk / Cardio"
      />
      <BaseCheckbox
        v-model="checks.mobility"
        label="Arm Circles / Mobility"
      />
      <BaseCheckbox
        v-model="checks.stretch"
        label="Dead Hang / Stretch"
      />
    </div>

    <div class="mt-8">
      <BaseButton
        @click="startWorkout"
        :disabled="!allChecked"
        class="w-full"
      >
        {{ allChecked ? 'Start Workout 💪' : 'Complete Warm-up First' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'

const store = useWorkoutStore()
const router = useRouter()

const checks = reactive({
  cardio: false,
  mobility: false,
  stretch: false
})

const allChecked = computed(() => {
  return checks.cardio && checks.mobility && checks.stretch
})

const startWorkout = () => {
  if (!allChecked.value) return

  store.startWorkout()
  router.push('/workout')
}
</script>
