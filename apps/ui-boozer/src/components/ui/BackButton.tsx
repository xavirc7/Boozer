import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCopy } from '../../content/useCopy'
import styles from './BackButton.module.css'

interface BackButtonProps {
  to?: string
}

/**
 * Back button component for kiosk navigation.
 * If no 'to' route is specified, it navigates back in history.
 */
export function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate()
  const copy = useCopy()

  const handleBack = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button className={styles.backButton} onClick={handleBack}>
      ← {copy.common.back}
    </button>
  )
}
