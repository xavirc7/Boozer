import React from 'react'
import styles from './NeonCard.module.css'

interface NeonCardProps {
  title: string
  subtitle?: string
  selected?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

export function NeonCard({
  title,
  subtitle,
  selected = false,
  onClick,
  children,
}: NeonCardProps) {
  const cardClass = `${styles.card} ${selected ? styles.selected : ''} ${
    onClick ? styles.clickable : ''
  }`

  return (
    <div className={cardClass} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className={styles.cardContent}>
        {children && <div className={styles.cardIcon}>{children}</div>}

        <div className={styles.cardText}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {selected && <div className={styles.selectedIndicator}>✓</div>}
      </div>
    </div>
  )
}
