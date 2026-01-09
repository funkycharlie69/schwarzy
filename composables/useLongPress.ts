import { ref, onMounted, onUnmounted } from 'vue'

export interface LongPressOptions {
  delay?: number // Duration in ms to trigger long press (default: 500ms)
  onStart?: () => void // Called when press starts
  onLongPress?: () => void // Called when long press is triggered
  onCancel?: () => void // Called when press is cancelled
}

export function useLongPress(options: LongPressOptions = {}) {
  const {
    delay = 500,
    onStart,
    onLongPress,
    onCancel
  } = options

  const isPressed = ref(false)
  const longPressTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const start = () => {
    isPressed.value = true
    onStart?.()

    longPressTimer.value = setTimeout(() => {
      if (isPressed.value) {
        onLongPress?.()
      }
    }, delay)
  }

  const cancel = () => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }

    if (isPressed.value) {
      onCancel?.()
    }

    isPressed.value = false
  }

  const clear = () => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
    isPressed.value = false
  }

  // Touch event handlers
  const handleTouchStart = (e: TouchEvent) => {
    start()
  }

  const handleTouchEnd = (e: TouchEvent) => {
    cancel()
  }

  const handleTouchCancel = (e: TouchEvent) => {
    cancel()
  }

  const handleTouchMove = (e: TouchEvent) => {
    // Cancel if finger moves significantly
    cancel()
  }

  // Mouse event handlers (for desktop testing)
  const handleMouseDown = (e: MouseEvent) => {
    start()
  }

  const handleMouseUp = (e: MouseEvent) => {
    cancel()
  }

  const handleMouseLeave = (e: MouseEvent) => {
    cancel()
  }

  // Cleanup
  onUnmounted(() => {
    clear()
  })

  return {
    isPressed,
    handlers: {
      // Touch events
      onTouchstart: handleTouchStart,
      onTouchend: handleTouchEnd,
      onTouchcancel: handleTouchCancel,
      onTouchmove: handleTouchMove,
      // Mouse events
      onMousedown: handleMouseDown,
      onMouseup: handleMouseUp,
      onMouseleave: handleMouseLeave
    }
  }
}
