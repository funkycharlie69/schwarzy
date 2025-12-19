export const useHaptic = () => {
  const haptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') => {
    if (!('vibrate' in navigator)) return

    const patterns = {
      light: 10,
      medium: 20,
      heavy: 40,
      success: [10, 50, 10],
      warning: [20, 100, 20]
    }

    navigator.vibrate(patterns[type])
  }

  return { haptic }
}
