export const useVolumeCalculation = () => {
  const calculateSetVolume = (weight: number, reps: number): number => {
    return weight * reps
  }

  const calculateTotalVolume = (sets: Array<{ weight: number; reps: number }>): number => {
    return sets.reduce((total, set) => total + calculateSetVolume(set.weight, set.reps), 0)
  }

  const formatVolume = (volume: number): string => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}t`
    }
    return `${volume}kg`
  }

  return {
    calculateSetVolume,
    calculateTotalVolume,
    formatVolume
  }
}
