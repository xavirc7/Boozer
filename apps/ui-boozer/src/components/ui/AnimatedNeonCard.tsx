import React from 'react'
import type { KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import styles from './NeonCard.module.css'
import { cardHoverVariants } from '../../styles/animations'

interface AnimatedNeonCardProps {
  title: string
  subtitle?: string
  selected?: boolean
  onClick?: () => void
  children?: React.ReactNode
  accent?: 'cyan' | 'magenta'
}

/**
 * Animated version of NeonCard with Framer Motion
 */
export function AnimatedNeonCard({
  title,
  subtitle,
  selected = false,
  onClick,
  children,
  accent = 'cyan',
}: AnimatedNeonCardProps) {
  const cardClass = `${styles.card} ${selected ? styles.selected : ''} ${
    onClick ? styles.clickable : ''
  } ${accent === 'magenta' ? styles.magenta : ''}`.trim()

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <motion.div
      className={cardClass}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      initial="initial"
      whileHover={onClick ? 'hover' : 'initial'}
      whileTap={onClick ? 'tap' : 'initial'}
      variants={cardHoverVariants}
    >
      <div className={styles.cardContent}>
        {children && <div className={styles.cardIcon}>{children}</div>}

        <div className={styles.cardText}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {selected && <div className={styles.selectedIndicator}>✓</div>}
      </div>
    </motion.div>
  )
}
