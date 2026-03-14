import React from 'react'
import styles from './ScreenShell.module.css'

interface ScreenShellProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function ScreenShell({
  title,
  subtitle,
  children,
  footer,
}: ScreenShellProps) {
  return (
    <div className={styles.shell}>
      {/* Header */}
      {(title || subtitle) && (
        <header className={styles.header}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}

      {/* Main Content */}
      <main className={styles.content}>{children}</main>

      {/* Footer */}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  )
}
