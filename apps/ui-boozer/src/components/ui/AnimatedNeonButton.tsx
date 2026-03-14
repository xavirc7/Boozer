import React from 'react'
import { motion } from 'framer-motion'
import styles from './NeonButton.module.css'
import { buttonTapVariants } from '../../styles/animations'

interface AnimatedNeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

/**
 * Animated version of NeonButton with Framer Motion
 */
export function AnimatedNeonButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: AnimatedNeonButtonProps) {
  const buttonClass = `${styles.button} ${styles[variant]} ${
    fullWidth ? styles.fullWidth : ''
  } ${disabled ? styles.disabled : ''} ${className}`.trim()

  return (
    <motion.button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
      initial="initial"
      whileHover={!disabled ? 'hover' : 'initial'}
      whileTap={!disabled ? 'tap' : 'initial'}
      variants={buttonTapVariants}
    >
      <span className={styles.buttonText}>{children}</span>
    </motion.button>
  )
}
