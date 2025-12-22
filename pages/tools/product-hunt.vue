<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Product Hunt Gallery Generator</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Controls -->
        <div class="space-y-6 lg:h-screen lg:overflow-y-auto lg:pr-4">
          <!-- Left iPhone -->
          <div class="border border-zinc-800 rounded-lg p-4 space-y-4">
            <h3 class="text-lg font-semibold text-green-500">Left iPhone</h3>
            <div>
              <label class="block text-sm font-medium mb-2">Upload Screenshot</label>
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleImageUpload(e, 'left')"
                class="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-600 file:text-white
                  hover:file:bg-green-700
                  cursor-pointer"
              >
            </div>

            <div v-if="mockups.left.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Screenshot Zoom: {{ mockups.left.zoom.toFixed(1) }}x
              </label>
              <input
                v-model.number="mockups.left.zoom"
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                class="w-full accent-green-600"
              >
            </div>

            <div v-if="mockups.left.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                iPhone Size: {{ mockups.left.mockupSize }}px
              </label>
              <input
                v-model.number="mockups.left.mockupSize"
                type="range"
                min="100"
                max="500"
                step="10"
                class="w-full accent-green-600"
              >
            </div>

            <div v-if="mockups.left.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Position X: {{ mockups.left.positionX }}px
              </label>
              <input
                v-model.number="mockups.left.positionX"
                type="range"
                min="-400"
                max="400"
                step="5"
                class="w-full accent-green-600"
              >
            </div>

            <div v-if="mockups.left.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Position Y: {{ mockups.left.positionY }}px
              </label>
              <input
                v-model.number="mockups.left.positionY"
                type="range"
                min="-300"
                max="300"
                step="5"
                class="w-full accent-green-600"
              >
            </div>

            <div v-if="mockups.left.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Screenshot Position: {{ mockups.left.screenshotPositionY }}%
              </label>
              <input
                v-model.number="mockups.left.screenshotPositionY"
                type="range"
                min="-50"
                max="50"
                step="1"
                class="w-full accent-green-600"
              >
            </div>
          </div>

          <!-- Center iPhone -->
          <div class="border border-zinc-800 rounded-lg p-4 space-y-4">
            <h3 class="text-lg font-semibold text-blue-500">Center iPhone</h3>
            <div>
              <label class="block text-sm font-medium mb-2">Upload Screenshot</label>
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleImageUpload(e, 'center')"
                class="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  cursor-pointer"
              >
            </div>

            <div v-if="mockups.center.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Screenshot Zoom: {{ mockups.center.zoom.toFixed(1) }}x
              </label>
              <input
                v-model.number="mockups.center.zoom"
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                class="w-full accent-blue-600"
              >
            </div>

            <div v-if="mockups.center.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                iPhone Size: {{ mockups.center.mockupSize }}px
              </label>
              <input
                v-model.number="mockups.center.mockupSize"
                type="range"
                min="100"
                max="500"
                step="10"
                class="w-full accent-blue-600"
              >
            </div>

            <div v-if="mockups.center.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Position X: {{ mockups.center.positionX }}px
              </label>
              <input
                v-model.number="mockups.center.positionX"
                type="range"
                min="-400"
                max="400"
                step="5"
                class="w-full accent-blue-600"
              >
            </div>

            <div v-if="mockups.center.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Position Y: {{ mockups.center.positionY }}px
              </label>
              <input
                v-model.number="mockups.center.positionY"
                type="range"
                min="-300"
                max="300"
                step="5"
                class="w-full accent-blue-600"
              >
            </div>

            <div v-if="mockups.center.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Screenshot Position: {{ mockups.center.screenshotPositionY }}%
              </label>
              <input
                v-model.number="mockups.center.screenshotPositionY"
                type="range"
                min="-50"
                max="50"
                step="1"
                class="w-full accent-blue-600"
              >
            </div>
          </div>

          <!-- Right iPhone -->
          <div class="border border-zinc-800 rounded-lg p-4 space-y-4">
            <h3 class="text-lg font-semibold text-purple-500">Right iPhone</h3>
            <div>
              <label class="block text-sm font-medium mb-2">Upload Screenshot</label>
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleImageUpload(e, 'right')"
                class="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-600 file:text-white
                  hover:file:bg-purple-700
                  cursor-pointer"
              >
            </div>

            <div v-if="mockups.right.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Screenshot Zoom: {{ mockups.right.zoom.toFixed(1) }}x
              </label>
              <input
                v-model.number="mockups.right.zoom"
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                class="w-full accent-purple-600"
              >
            </div>

            <div v-if="mockups.right.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                iPhone Size: {{ mockups.right.mockupSize }}px
              </label>
              <input
                v-model.number="mockups.right.mockupSize"
                type="range"
                min="100"
                max="500"
                step="10"
                class="w-full accent-purple-600"
              >
            </div>

            <div v-if="mockups.right.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Position X: {{ mockups.right.positionX }}px
              </label>
              <input
                v-model.number="mockups.right.positionX"
                type="range"
                min="-400"
                max="400"
                step="5"
                class="w-full accent-purple-600"
              >
            </div>

            <div v-if="mockups.right.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Position Y: {{ mockups.right.positionY }}px
              </label>
              <input
                v-model.number="mockups.right.positionY"
                type="range"
                min="-300"
                max="300"
                step="5"
                class="w-full accent-purple-600"
              >
            </div>

            <div v-if="mockups.right.uploadedImage">
              <label class="block text-sm font-medium mb-2">
                Screenshot Position: {{ mockups.right.screenshotPositionY }}%
              </label>
              <input
                v-model.number="mockups.right.screenshotPositionY"
                type="range"
                min="-50"
                max="50"
                step="1"
                class="w-full accent-purple-600"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Headline (Optional)</label>
            <input
              v-model="headline"
              type="text"
              placeholder="e.g., Track Your Progress"
              class="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-green-600"
            >
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Subheadline (Optional)</label>
            <input
              v-model="subheadline"
              type="text"
              placeholder="e.g., Smart workout tracking for athletes"
              class="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-green-600"
            >
          </div>

          <!-- Global Settings -->
          <div class="border border-zinc-800 rounded-lg p-4 space-y-4">
            <h3 class="text-lg font-semibold text-yellow-500">Global Settings</h3>

            <div>
              <label class="block text-sm font-medium mb-2">Background Style</label>
              <select
                v-model="backgroundStyle"
                class="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-yellow-600"
              >
                <option value="gradient-green">Gradient - Green</option>
                <option value="gradient-purple">Gradient - Purple</option>
                <option value="gradient-blue">Gradient - Blue</option>
                <option value="solid-dark">Solid - Dark</option>
                <option value="solid-light">Solid - Light</option>
              </select>
            </div>

            <div v-if="headline || subheadline">
              <label class="block text-sm font-medium mb-2">
                Text Position: {{ textPositionY > 0 ? '+' : '' }}{{ textPositionY }}px
              </label>
              <input
                v-model.number="textPositionY"
                type="range"
                min="-800"
                max="800"
                step="5"
                class="w-full accent-yellow-600"
              >
              <div class="flex justify-between text-xs text-zinc-500 mt-1">
                <span>Up</span>
                <span>Center</span>
                <span>Down</span>
              </div>
            </div>

            <button
              @click.prevent="downloadImage"
              :disabled="!hasAnyImage"
              class="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg font-semibold transition-colors touch-manipulation"
            >
              Download Image (1270x760)
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="lg:sticky lg:top-8 space-y-4">
          <label class="block text-sm font-medium">Preview</label>
          <div class="border-2 border-zinc-800 rounded-lg overflow-hidden">
            <div
              ref="canvasContainer"
              :class="getBackgroundClass()"
              class="relative w-full aspect-[1270/760] flex items-center justify-center overflow-hidden"
            >
              <!-- Content -->
              <div class="relative z-10 flex flex-col items-center justify-center gap-8 px-8">
                <!-- Text Content -->
                <div
                  v-if="headline || subheadline"
                  class="text-center z-50 space-y-2 max-w-2xl"
                  :style="{ transform: `translateY(${textPositionY}px)` }"
                >
                  <h2 v-if="headline" class="text-6xl font-bold" :class="getTextColor()">
                    {{ headline }}
                  </h2>
                  <p v-if="subheadline" class="text-2xl" :class="getSubtextColor()">
                    {{ subheadline }}
                  </p>
                </div>

                <!-- All Three iPhone Mockups -->
                <div class="relative flex items-center justify-center gap-4">
                  <!-- Left iPhone -->
                  <div
                    v-if="mockups.left.uploadedImage"
                    class="relative"
                    :style="{
                      transform: `translate(${mockups.left.positionX}px, ${mockups.left.positionY}px)`,
                      zIndex: 10
                    }"
                  >
                    <div
                      class="relative bg-black shadow-2xl"
                      :style="{
                        width: `${mockups.left.mockupSize}px`,
                        padding: `${getScaledPadding('left')}px`,
                        borderRadius: `${getScaledOuterRadius('left')}px`
                      }"
                    >
                      <div
                        class="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-20"
                        :style="{
                          width: `${getScaledNotchWidth('left')}px`,
                          height: `${getScaledNotchHeight('left')}px`,
                          borderBottomLeftRadius: `${getScaledNotchHeight('left')}px`,
                          borderBottomRightRadius: `${getScaledNotchHeight('left')}px`
                        }"
                      ></div>
                      <div
                        class="relative bg-zinc-950 overflow-hidden"
                        :style="{
                          aspectRatio: '9/19.5',
                          borderRadius: `${getScaledInnerRadius('left')}px`
                        }"
                      >
                        <img
                          :src="mockups.left.uploadedImage"
                          alt="Left Screenshot"
                          class="w-full h-full object-contain"
                          :style="{
                            transform: `scale(${mockups.left.zoom}) translateY(${mockups.left.screenshotPositionY}%)`,
                            objectPosition: 'center'
                          }"
                        >
                      </div>
                      <div
                        class="absolute -right-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledButtonTop('left')}px`,
                          width: '1px',
                          height: `${getScaledButtonHeight('left')}px`,
                          borderTopLeftRadius: '2px',
                          borderBottomLeftRadius: '2px'
                        }"
                      ></div>
                      <div
                        class="absolute -left-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledVolumeTop1('left')}px`,
                          width: '1px',
                          height: `${getScaledVolumeHeight('left')}px`,
                          borderTopRightRadius: '2px',
                          borderBottomRightRadius: '2px'
                        }"
                      ></div>
                      <div
                        class="absolute -left-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledVolumeTop2('left')}px`,
                          width: '1px',
                          height: `${getScaledVolumeHeight('left')}px`,
                          borderTopRightRadius: '2px',
                          borderBottomRightRadius: '2px'
                        }"
                      ></div>
                    </div>
                  </div>

                  <!-- Center iPhone -->
                  <div
                    v-if="mockups.center.uploadedImage"
                    class="relative"
                    :style="{
                      transform: `translate(${mockups.center.positionX}px, ${mockups.center.positionY}px)`,
                      zIndex: 20
                    }"
                  >
                    <div
                      class="relative bg-black shadow-2xl"
                      :style="{
                        width: `${mockups.center.mockupSize}px`,
                        padding: `${getScaledPadding('center')}px`,
                        borderRadius: `${getScaledOuterRadius('center')}px`
                      }"
                    >
                      <div
                        class="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-20"
                        :style="{
                          width: `${getScaledNotchWidth('center')}px`,
                          height: `${getScaledNotchHeight('center')}px`,
                          borderBottomLeftRadius: `${getScaledNotchHeight('center')}px`,
                          borderBottomRightRadius: `${getScaledNotchHeight('center')}px`
                        }"
                      ></div>
                      <div
                        class="relative bg-zinc-950 overflow-hidden"
                        :style="{
                          aspectRatio: '9/19.5',
                          borderRadius: `${getScaledInnerRadius('center')}px`
                        }"
                      >
                        <img
                          :src="mockups.center.uploadedImage"
                          alt="Center Screenshot"
                          class="w-full h-full object-contain"
                          :style="{
                            transform: `scale(${mockups.center.zoom}) translateY(${mockups.center.screenshotPositionY}%)`,
                            objectPosition: 'center'
                          }"
                        >
                      </div>
                      <div
                        class="absolute -right-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledButtonTop('center')}px`,
                          width: '1px',
                          height: `${getScaledButtonHeight('center')}px`,
                          borderTopLeftRadius: '2px',
                          borderBottomLeftRadius: '2px'
                        }"
                      ></div>
                      <div
                        class="absolute -left-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledVolumeTop1('center')}px`,
                          width: '1px',
                          height: `${getScaledVolumeHeight('center')}px`,
                          borderTopRightRadius: '2px',
                          borderBottomRightRadius: '2px'
                        }"
                      ></div>
                      <div
                        class="absolute -left-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledVolumeTop2('center')}px`,
                          width: '1px',
                          height: `${getScaledVolumeHeight('center')}px`,
                          borderTopRightRadius: '2px',
                          borderBottomRightRadius: '2px'
                        }"
                      ></div>
                    </div>
                  </div>

                  <!-- Right iPhone -->
                  <div
                    v-if="mockups.right.uploadedImage"
                    class="relative"
                    :style="{
                      transform: `translate(${mockups.right.positionX}px, ${mockups.right.positionY}px)`,
                      zIndex: 10
                    }"
                  >
                    <div
                      class="relative bg-black shadow-2xl"
                      :style="{
                        width: `${mockups.right.mockupSize}px`,
                        padding: `${getScaledPadding('right')}px`,
                        borderRadius: `${getScaledOuterRadius('right')}px`
                      }"
                    >
                      <div
                        class="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-20"
                        :style="{
                          width: `${getScaledNotchWidth('right')}px`,
                          height: `${getScaledNotchHeight('right')}px`,
                          borderBottomLeftRadius: `${getScaledNotchHeight('right')}px`,
                          borderBottomRightRadius: `${getScaledNotchHeight('right')}px`
                        }"
                      ></div>
                      <div
                        class="relative bg-zinc-950 overflow-hidden"
                        :style="{
                          aspectRatio: '9/19.5',
                          borderRadius: `${getScaledInnerRadius('right')}px`
                        }"
                      >
                        <img
                          :src="mockups.right.uploadedImage"
                          alt="Right Screenshot"
                          class="w-full h-full object-contain"
                          :style="{
                            transform: `scale(${mockups.right.zoom}) translateY(${mockups.right.screenshotPositionY}%)`,
                            objectPosition: 'center'
                          }"
                        >
                      </div>
                      <div
                        class="absolute -right-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledButtonTop('right')}px`,
                          width: '1px',
                          height: `${getScaledButtonHeight('right')}px`,
                          borderTopLeftRadius: '2px',
                          borderBottomLeftRadius: '2px'
                        }"
                      ></div>
                      <div
                        class="absolute -left-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledVolumeTop1('right')}px`,
                          width: '1px',
                          height: `${getScaledVolumeHeight('right')}px`,
                          borderTopRightRadius: '2px',
                          borderBottomRightRadius: '2px'
                        }"
                      ></div>
                      <div
                        class="absolute -left-[2px] bg-zinc-800"
                        :style="{
                          top: `${getScaledVolumeTop2('right')}px`,
                          width: '1px',
                          height: `${getScaledVolumeHeight('right')}px`,
                          borderTopRightRadius: '2px',
                          borderBottomRightRadius: '2px'
                        }"
                      ></div>
                    </div>
                  </div>

                  <!-- Placeholder -->
                  <div v-if="!hasAnyImage" class="text-center text-zinc-500">
                    <svg class="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Upload screenshots to preview</p>
                  </div>
                </div>
              </div>

              <!-- Background decoration -->
              <div v-if="backgroundStyle.startsWith('gradient')" class="absolute inset-0 opacity-20">
                <div class="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div class="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
          <p class="text-xs text-zinc-500">Canvas: 1270x760px (Product Hunt recommended size)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import html2canvas from 'html2canvas'

// Mockup data structure
interface Mockup {
  uploadedImage: string | null
  zoom: number
  mockupSize: number
  positionX: number
  positionY: number
  screenshotPositionY: number
}

const mockups = reactive({
  left: {
    uploadedImage: null,
    zoom: 1,
    mockupSize: 280,
    positionX: -200,
    positionY: 0,
    screenshotPositionY: 0
  } as Mockup,
  center: {
    uploadedImage: null,
    zoom: 1,
    mockupSize: 320,
    positionX: 0,
    positionY: 0,
    screenshotPositionY: 0
  } as Mockup,
  right: {
    uploadedImage: null,
    zoom: 1,
    mockupSize: 280,
    positionX: 200,
    positionY: 0,
    screenshotPositionY: 0
  } as Mockup
})

const headline = ref('')
const subheadline = ref('')
const backgroundStyle = ref('gradient-green')
const textPositionY = ref(0)
const canvasContainer = ref<HTMLElement | null>(null)

// Helper computed
const hasAnyImage = computed(() =>
  mockups.left.uploadedImage || mockups.center.uploadedImage || mockups.right.uploadedImage
)

// Scaling functions for each mockup
const getScaleFactor = (position: 'left' | 'center' | 'right') => {
  return mockups[position].mockupSize / 320
}

const getScaledPadding = (position: 'left' | 'center' | 'right') => {
  return 12 * getScaleFactor(position)
}

const getScaledOuterRadius = (position: 'left' | 'center' | 'right') => {
  return 48 * getScaleFactor(position)
}

const getScaledInnerRadius = (position: 'left' | 'center' | 'right') => {
  return 40 * getScaleFactor(position)
}

const getScaledNotchWidth = (position: 'left' | 'center' | 'right') => {
  return 128 * getScaleFactor(position)
}

const getScaledNotchHeight = (position: 'left' | 'center' | 'right') => {
  return 28 * getScaleFactor(position)
}

const getScaledButtonTop = (position: 'left' | 'center' | 'right') => {
  return 96 * getScaleFactor(position)
}

const getScaledButtonHeight = (position: 'left' | 'center' | 'right') => {
  return 64 * getScaleFactor(position)
}

const getScaledVolumeTop1 = (position: 'left' | 'center' | 'right') => {
  return 80 * getScaleFactor(position)
}

const getScaledVolumeTop2 = (position: 'left' | 'center' | 'right') => {
  return 128 * getScaleFactor(position)
}

const getScaledVolumeHeight = (position: 'left' | 'center' | 'right') => {
  return 32 * getScaleFactor(position)
}

const handleImageUpload = (event: Event, position: 'left' | 'center' | 'right') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      mockups[position].uploadedImage = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const getBackgroundClass = () => {
  const styles = {
    'gradient-green': 'bg-gradient-to-br from-green-600 via-green-700 to-green-900',
    'gradient-purple': 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900',
    'gradient-blue': 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900',
    'solid-dark': 'bg-zinc-950',
    'solid-light': 'bg-zinc-100'
  }
  return styles[backgroundStyle.value as keyof typeof styles]
}

const getTextColor = () => {
  return backgroundStyle.value === 'solid-light' ? 'text-zinc-950' : 'text-white'
}

const getSubtextColor = () => {
  return backgroundStyle.value === 'solid-light' ? 'text-zinc-700' : 'text-zinc-300'
}

const downloadImage = async () => {
  if (!canvasContainer.value) return

  try {
    const canvas = await html2canvas(canvasContainer.value, {
      width: 1270,
      height: 760,
      scale: 2,
      backgroundColor: null,
      logging: false
    })

    const link = document.createElement('a')
    link.download = `product-hunt-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Error generating image:', error)
    alert('Failed to generate image. Please try again.')
  }
}
</script>
