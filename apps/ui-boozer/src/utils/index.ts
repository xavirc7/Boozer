/**
 * Utility functions and hooks
 * Central export point for all utility modules
 */

export { useCountdown } from './useCountdown'
export type { CountdownState } from './useCountdown'

export {
  mapBacToResult,
  getRecommendations,
  createThresholds,
} from './resultMapper'
export type { MappedResult, ResultSeverity, ColorToken, BacThresholds } from './resultMapper'
