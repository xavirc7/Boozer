import React from 'react'
import styles from './NeonButton.module.css'

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function NeonButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: NeonButtonProps) {
  const buttonClass = `${styles.button} ${styles[variant]} ${
    fullWidth ? styles.fullWidth : ''
  } ${disabled ? styles.disabled : ''} ${className}`.trim()

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      <span className={styles.buttonText}>{children}</span>
    </button>
  )
}
