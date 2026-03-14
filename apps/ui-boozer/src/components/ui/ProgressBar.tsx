import React from 'react'
import styles from './ProgressBar.module.css'

export interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  value: number
  /** Display label above the bar */
  label?: string
  /** Enable animated fill transition */
  animate?: boolean
  /** Color variant: cyan, magenta, lime */
  variant?: 'cyan' | 'magenta' | 'lime'
  /** Show percentage text */
  showLabel?: boolean
  /** Bar height in pixels */
  height?: number
  /** Additional CSS class */
  className?: string
}

/**
 * Neon-styled progress bar component for kiosk UI
 * Features animated fill, glow effects, and vibrant colors
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  animate = true,
  variant = 'cyan',
  showLabel = true,
  height = 48,
  className = '',
}) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className={`${styles.container} ${className}`}>
      {label && <div className={styles.label}>{label}</div>}

      <div className={styles.barWrapper}>
        <div
          className={`${styles.barBackground} ${styles[`variant-${variant}`]}`}
          style={{ height: `${height}px` }}
        >
          {/* Animated fill */}
          <div
            className={`${styles.barFill} ${animate ? styles.animated : ''} ${styles[`variant-${variant}`]}`}
            style={{
              width: `${clampedValue}%`,
              height: `${height}px`,
            }}
          >
            {/* Inner glow effect */}
            <div className={styles.glowInner} />
          </div>

          {/* Outer glow effect */}
          <div className={`${styles.glowOuter} ${styles[`variant-${variant}`]}`} />
        </div>

        {/* Percentage text */}
        {showLabel && (
          <div className={`${styles.percentageText} ${styles[`variant-${variant}`]}`}>
            {Math.round(clampedValue)}%
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressBar
