/**/**





















































































}  slow: '0.6s ease-in-out',  normal: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',  fast: '0.15s ease-out',export const transitions = {}  },    ultrabold: 900,    bold: 700,    semibold: 600,    normal: 400,    light: 300,  fontWeights: {  },    giant: '8rem',    xxxl: '4rem',    xxl: '3rem',    xl: '2rem',    lg: '1.5rem',    md: '1.25rem',    sm: '1rem',    xs: '0.875rem',  fontSizes: {  fontFamily: "'Arial', sans-serif",export const typography = {}  xl: '16px',  lg: '12px',  md: '8px',  sm: '6px',export const borderRadius = {}  inset: 'inset 0 0 20px rgba(0, 0, 0, 0.3)',  glowIntense: '0 0 30px rgba(0, 255, 200, 0.8), 0 0 60px rgba(0, 255, 200, 0.5)',  glow: '0 0 20px rgba(0, 255, 200, 0.6), 0 0 40px rgba(0, 255, 200, 0.3)',  xl: '0 0 80px rgba(0, 255, 200, 0.5)',  lg: '0 0 50px rgba(0, 255, 200, 0.4)',  md: '0 0 30px rgba(0, 255, 200, 0.3)',  sm: '0 0 15px rgba(0, 255, 200, 0.2)',export const shadows = {}  xxxl: '60px',  xxl: '40px',  xl: '32px',  lg: '24px',  md: '16px',  sm: '12px',  xs: '8px',export const spacing = {}  stop: '#ff0055',  alert: '#ffaa00',  safe: '#00ff88',  danger: '#ff0055',  warning: '#ffaa00',  success: '#00ff88',  // Semantic  lightGray: '#b0b0b0',  white: '#ffffff',  darkNavy: '#0f0f1e',  darkBlue: '#1a0a2e',  darkGray: '#0a0a0a',  black: '#000000',  // Background & Text  neonRed: '#ff0055',  neonOrange: '#ffaa00',  neonGreen: '#00ff88',  neonPurpleDark: '#8f8fff',  neonPurple: '#b0b0ff',  neonCyanDark: '#00e6b0',  neonCyan: '#00ffc8',  // Neon Accentsexport const colors = { */ * Colors, spacing, shadows, and other reusable design values * Design Tokens for Boozer Kiosk * Design Tokens for Boozer Kiosk
 * Colors, spacing, shadows, border radii - arcade/nightclub aesthetic
 */

// Colors - Neon Arcade Palette
export const COLORS = {
  // Backgrounds
  bg: {
    dark: '#0a0a0a',
    darkGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0f0f1e 100%)',
    hover: 'rgba(0, 255, 200, 0.05)',
  },

  // Neon Primaries
  neon: {
    cyan: '#00ffc8',
    cyanDark: '#00e6b0',
    purple: '#b0b0ff',
    purpleDark: '#8f8fff',
    green: '#00ff88',
    orange: '#ffaa00',
    red: '#ff0055',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#b0b0ff',
    muted: 'rgba(255, 255, 255, 0.5)',
  },

  // Borders & Accents
  border: {
    neonCyan: 'rgba(0, 255, 200, 0.3)',
    neonCyanBright: 'rgba(0, 255, 200, 0.8)',
  },
}

// Shadows - Neon Glow Effects
export const SHADOWS = {
  neonCyan: {
    sm: '0 0 15px rgba(0, 255, 200, 0.3)',
    md: '0 0 30px rgba(0, 255, 200, 0.5)',
    lg: '0 0 60px rgba(0, 255, 200, 0.3)',
    xl: '0 0 80px rgba(0, 255, 200, 0.4)',
  },
  neonPurple: {
    sm: '0 0 15px rgba(176, 176, 255, 0.3)',
    md: '0 0 30px rgba(176, 176, 255, 0.5)',
    lg: '0 0 60px rgba(176, 176, 255, 0.3)',
  },
  neonRed: {
    sm: '0 0 15px rgba(255, 0, 85, 0.3)',
    md: '0 0 30px rgba(255, 0, 85, 0.5)',
    lg: '0 0 60px rgba(255, 0, 85, 0.3)',
  },
  inner: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
}

// Border Radius
export const RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '50%',
}

// Spacing
export const SPACING = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
}

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    sans: "'Arial', sans-serif",
  },
  fontSize: {
    xs: '0.875rem',
    sm: '1rem',
    md: '1.2rem',
    lg: '1.4rem',
    xl: '1.8rem',
    xxl: '2.4rem',
    huge: '4rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
    black: 900,
  },
}

// Transitions
export const TRANSITIONS = {
  fast: '0.15s ease-in-out',
  normal: '0.3s ease-in-out',
  slow: '0.5s ease-in-out',
}
