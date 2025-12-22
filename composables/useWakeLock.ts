export const useWakeLock = () => {
  const wakeLock = ref<WakeLockSentinel | null>(null)
  const isSupported = ref(false)
  const isActive = ref(false)

  const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      console.warn('Wake Lock API is not supported in this browser')
      isSupported.value = false
      return
    }

    isSupported.value = true

    try {
      wakeLock.value = await navigator.wakeLock.request('screen')
      isActive.value = true

      wakeLock.value.addEventListener('release', () => {
        isActive.value = false
      })

      console.log('Wake Lock activated - screen will stay on')
    } catch (err: any) {
      console.error(`Failed to activate Wake Lock: ${err.message}`)
      isActive.value = false
    }
  }

  const releaseWakeLock = async () => {
    if (wakeLock.value) {
      try {
        await wakeLock.value.release()
        wakeLock.value = null
        isActive.value = false
        console.log('Wake Lock released')
      } catch (err: any) {
        console.error(`Failed to release Wake Lock: ${err.message}`)
      }
    }
  }

  // Re-request wake lock when page becomes visible again
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && isSupported.value && !isActive.value) {
      await requestWakeLock()
    }
  }

  onMounted(async () => {
    await requestWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    releaseWakeLock()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock
  }
}
