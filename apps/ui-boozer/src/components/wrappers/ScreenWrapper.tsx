import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slideUpVariants, containerVariants } from '../../styles/animations'

interface ScreenWrapperProps {
  children: React.ReactNode
  delay?: number
}

/**
 * Screen wrapper that provides consistent enter animations
 * Wraps screen content to animate on mount
 */
export function ScreenWrapper({ children, delay = 0 }: ScreenWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="screen"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={slideUpVariants}
        transition={{
          delay,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
