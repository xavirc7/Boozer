/**
 * Blood Alcohol Content (BAC) result mapper
 * Converts numeric BAC values into UI-friendly status objects
 * Independent of React - pure utility functions
 */

/**
 * Severity level for result display
 */
export type ResultSeverity = 'safe' | 'warning' | 'critical'

/**
 * Color tokens for theme-aware styling
 */
export type ColorToken = 'lime' | 'cyan' | 'magenta'

/**
 * Mapped result object with all UI information
 */
export interface MappedResult {
  /** Status label: SAFE, WARNING, STOP */
  label: 'SAFE' | 'WARNING' | 'STOP'
  /** Short display message */
  message: string
  /** Severity for styling/tone */
  severity: ResultSeverity
  /** Color token for neon styling */
  color: ColorToken
  /** Raw BAC value */
  bac: number
  /** Formatted BAC for display */
  bacFormatted: string
}

/**
 * BAC threshold configuration
 * Easy to adjust thresholds for different regulations
 */
export interface BacThresholds {
  /** Below this value = SAFE */
  safeLimit: number
  /** Between safeLimit and warningLimit = WARNING */
  warningLimit: number
  /** Above warningLimit = CRITICAL */
  criticalLimit: number // Usually set to 0.08 (legal driving limit in most places)
}

/**
 * Default BAC thresholds (US legal standards)
 * - 0.02: Safe driving threshold
 * - 0.05: Caution threshold
 * - 0.08: Legal driving limit (DUI threshold)
 */
const DEFAULT_THRESHOLDS: BacThresholds = {
  safeLimit: 0.02,
  warningLimit: 0.05,
  criticalLimit: 0.08,
}

/**
 * Maps a numeric BAC value to a UI result object
 *
 * @param bac Blood Alcohol Content value (0.0 - 1.0)
 * @param thresholds Optional custom thresholds
 * @returns Mapped result object with all UI information
 *
 * @example
 * const result = mapBacToResult(0.045)
 * // Returns:
 * // {
 * //   label: 'WARNING',
 * //   message: 'Approaching legal limit - Use caution',
 * //   severity: 'warning',
 * //   color: 'cyan',
 * //   bac: 0.045,
 * //   bacFormatted: '0.045%'
 * // }
 */
export const mapBacToResult = (
  bac: number,
  thresholds: BacThresholds = DEFAULT_THRESHOLDS
): MappedResult => {
  // Clamp BAC to reasonable range
  const clampedBac = Math.max(0, Math.min(bac, 1))

  // Determine status based on thresholds
  let label: 'SAFE' | 'WARNING' | 'STOP'
  let message: string
  let severity: ResultSeverity
  let color: ColorToken

  if (clampedBac < thresholds.safeLimit) {
    label = 'SAFE'
    message = 'Below legal limit - Safe to drive'
    severity = 'safe'
    color = 'lime'
  } else if (clampedBac < thresholds.warningLimit) {
    label = 'WARNING'
    message = 'Approaching legal limit - Use caution'
    severity = 'warning'
    color = 'cyan'
  } else if (clampedBac < thresholds.criticalLimit) {
    label = 'STOP'
    message = 'At or near legal limit - Do NOT drive'
    severity = 'critical'
    color = 'magenta'
  } else {
    label = 'STOP'
    message = 'SIGNIFICANTLY over legal limit - Serious impairment'
    severity = 'critical'
    color = 'magenta'
  }

  return {
    label,
    message,
    severity,
    color,
    bac: clampedBac,
    bacFormatted: `${clampedBac.toFixed(3)}%`,
  }
}

/**
 * Get detailed safety recommendations based on BAC level
 * Useful for result screen display
 */
export const getRecommendations = (
  bac: number,
  thresholds: BacThresholds = DEFAULT_THRESHOLDS
): string[] => {
  if (bac < thresholds.safeLimit) {
    return [
      'You are safe to drive',
      'Always drive safely and responsibly',
      'Never drive if you feel impaired',
    ]
  } else if (bac < thresholds.warningLimit) {
    return [
      'Consider using alternative transportation',
      'Avoid driving if possible',
      'Call a taxi or rideshare service',
    ]
  } else if (bac < thresholds.criticalLimit) {
    return [
      'DO NOT DRIVE - You are impaired',
      'Call a taxi or rideshare immediately',
      'Contact a friend or family member',
      'Use public transportation',
    ]
  } else {
    return [
      'CRITICAL: DO NOT DRIVE UNDER ANY CIRCUMSTANCES',
      'Seek immediate safe transportation',
      'Call emergency services if experiencing health issues',
      'Consider contacting a medical professional',
    ]
  }
}

/**
 * Create custom thresholds for different regulations
 * Useful for international or region-specific limits
 */
export const createThresholds = (
  safeLimit?: number,
  warningLimit?: number,
  criticalLimit?: number
): BacThresholds => {
  return {
    safeLimit: safeLimit ?? DEFAULT_THRESHOLDS.safeLimit,
    warningLimit: warningLimit ?? DEFAULT_THRESHOLDS.warningLimit,
    criticalLimit: criticalLimit ?? DEFAULT_THRESHOLDS.criticalLimit,
  }
}

export default mapBacToResult
