<template>
  <div class="space-y-2">
    <h4 class="text-sm font-medium text-foreground/80">{{ exerciseName }}</h4>

    <div v-if="history.length === 0" class="text-sm text-foreground/40 italic py-4">
      No data yet
    </div>

    <div v-else-if="history.length === 1" class="text-sm text-foreground/60 py-4">
      Only 1 session - need more data for chart
    </div>

    <svg v-else :viewBox="`0 0 ${width} ${height}`" class="w-full">
      <!-- Grid lines -->
      <line
        v-for="i in 3"
        :key="`grid-${i}`"
        :x1="padding"
        :y1="padding + ((height - padding * 2) / 3) * i"
        :x2="width - padding"
        :y2="padding + ((height - padding * 2) / 3) * i"
        stroke="#27272a"
        stroke-width="1"
      />

      <!-- Line path -->
      <polyline
        :points="linePoints"
        fill="none"
        stroke="#fafafa"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Data points -->
      <circle
        v-for="(point, i) in points"
        :key="`point-${i}`"
        :cx="point.x"
        :cy="point.y"
        r="4"
        fill="#fafafa"
      />

      <!-- Labels -->
      <text
        v-for="(point, i) in points"
        :key="`label-${i}`"
        :x="point.x"
        :y="point.y - 10"
        text-anchor="middle"
        fill="#fafafa"
        font-size="12"
        font-weight="600"
      >
        {{ history[i].maxWeight }}kg
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  exerciseName: string
  history: Array<{
    date: string
    maxWeight: number
    avgWeight: number
  }>
}

const props = defineProps<Props>()

const width = 300
const height = 120
const padding = 20

const minWeight = computed(() => Math.min(...props.history.map(h => h.maxWeight)))
const maxWeight = computed(() => Math.max(...props.history.map(h => h.maxWeight)))
const weightRange = computed(() => maxWeight.value - minWeight.value || 1)

const points = computed(() => {
  return props.history.map((item, i) => {
    const x = padding + ((width - padding * 2) / (props.history.length - 1)) * i
    const normalizedWeight = (item.maxWeight - minWeight.value) / weightRange.value
    const y = height - padding - (normalizedWeight * (height - padding * 2))

    return { x, y }
  })
})

const linePoints = computed(() => {
  return points.value.map(p => `${p.x},${p.y}`).join(' ')
})
</script>
