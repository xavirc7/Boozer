# Boozer Kiosk Design System Guide

## Overview
This guide explains how to use the design tokens, animations, and components to maintain a consistent nightclub arcade aesthetic across the kiosk UI.

## Design Tokens

All design tokens are available in `src/styles/tokens.ts`:

### Colors
```typescript
import { colors } from '../styles/tokens'

// Neon Accents
colors.neonCyan        // #00ffc8 (primary)
colors.neonPurple      // #b0b0ff (secondary)
colors.neonRed         // #ff0055 (danger/alert)
colors.neonGreen       // #00ff88 (success/safe)
colors.neonOrange      // #ffaa00 (warning)

// Background
colors.black           // #000000
colors.darkGray        // #0a0a0a
colors.darkBlue        // #1a0a2e
colors.darkNavy        // #0f0f1e
```

### Shadows (Glow Effects)
```typescript
import { shadows } from '../styles/tokens'

shadows.sm      // subtle glow
shadows.md      // medium glow
shadows.lg      // strong glow
shadows.xl      // intense glow
shadows.glow    // double cyan glow
shadows.inset   // inner shadow
```

### Spacing
```typescript
import { spacing } from '../styles/tokens'

spacing.xs      // 8px
spacing.sm      // 12px
spacing.md      // 16px
spacing.lg      // 24px
spacing.xl      // 32px
```

## Animation Variants

All animation presets are in `src/styles/animations.ts`:

### Screen Enter Animation
Wrap your screen content with `ScreenWrapper`:
```typescript
import { ScreenWrapper } from '../components/wrappers/ScreenWrapper'

<ScreenWrapper delay={0.1}>
  <ScreenShell>
    {/* Your content */}
  </ScreenShell>
</ScreenWrapper>
```

### Button Animations
Use `AnimatedNeonButton` for automatic tap feedback:
```typescript
import { AnimatedNeonButton } from '../components/ui/AnimatedNeonButton'

<AnimatedNeonButton variant="primary" onClick={handleClick}>
  Click Me
</AnimatedNeonButton>
```

### Card Animations
Use `AnimatedNeonCard` for interactive cards with hover lift:
```typescript
import { AnimatedNeonCard } from '../components/ui/AnimatedNeonCard'

<AnimatedNeonCard
  title="Option"
  selected={isSelected}
  onClick={handleSelect}
>
  🎯
</AnimatedNeonCard>
```

### Custom Animations with Framer Motion
```typescript
import { motion } from 'framer-motion'
import { scaleInVariants, pulseVariants } from '../styles/animations'

// Scale in on mount
<motion.div variants={scaleInVariants} initial="hidden" animate="visible">
  Content
</motion.div>

// Pulsing glow effect
<motion.button variants={pulseVariants} initial="initial" animate="animate">
  Click
</motion.button>
```

## Pattern: Animated Screen with Cards and Buttons

Here's the recommended pattern for implementing selection screens:

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { AnimatedNeonCard } from '../../components/ui/AnimatedNeonCard'
import { AnimatedNeonButton } from '../../components/ui/AnimatedNeonButton'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import styles from './YourScreen.module.css'

export function YourScreen() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)

  // Protect the route
  useRouteGuard({
    requiredState: { language: true },
  })

  const handleContinue = () => {
    if (selected) {
      // Save to Zustand
      navigate('/next-route')
    }
  }

  return (
    <ScreenWrapper>
      <ScreenShell title="Your Title">
        <div className={styles.cardGrid}>
          <AnimatedNeonCard
            title="Option 1"
            selected={selected === 'option1'}
            onClick={() => setSelected('option1')}
          >
            🎯
          </AnimatedNeonCard>
          {/* More cards */}
        </div>

        {selected && (
          <AnimatedNeonButton
            variant="primary"
            fullWidth
            onClick={handleContinue}
          >
            Continue
          </AnimatedNeonButton>
        )}
      </ScreenShell>
    </ScreenWrapper>
  )
}
```

## CSS Structure Guidelines

### Color Application
```css
.header {
  color: #00ffc8; /* neonCyan for primary text */
  text-shadow: 0 0 20px rgba(0, 255, 200, 0.5); /* glow effect */
}

.subtitle {
  color: #b0b0ff; /* neonPurple for secondary text */
}

.alert {
  background: rgba(255, 0, 85, 0.1);
  border: 2px solid #ff0055;
  color: #ff0055;
}
```

### Shadow Application
```css
.card {
  box-shadow: 0 0 30px rgba(0, 255, 200, 0.5), /* glow */
              inset 0 0 20px rgba(0, 0, 0, 0.3); /* inset for depth */
}

.button:hover {
  box-shadow: 0 0 50px rgba(0, 255, 200, 0.6);
}
```

### Transition Timing
```css
.interactive {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Responsive Design

All components scale automatically for:
- **Mobile** (< 768px): Smaller text, compact spacing
- **Desktop** (768px - 2560px): Standard sizing
- **Kiosk** (2560px+): Very large text and spacing

## Accessibility

- Animations respect `prefers-reduced-motion`
- All interactive elements have clear focus states
- Color contrast meets WCAG AAA standards
- Touch-friendly hit areas (min 48px)

## Performance Tips

1. **Use AnimatedNeonButton/Card** instead of wrapping every element in motion
2. **Limit simultaneous animations** - use stagger effects
3. **Prefer GPU-accelerated properties**: `transform`, `opacity`
4. **Avoid animating `width`, `height`, `left`, `right`**
5. **Use `layout={false}`** on Framer Motion components to avoid layout thrashing

## Migration Guide: Converting Screens to Animations

To add animations to an existing screen:

1. **Import ScreenWrapper**:
   ```typescript
   import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
   ```

2. **Wrap the entire screen**:
   ```typescript
   return (
     <ScreenWrapper>
       <ScreenShell>...</ScreenShell>
     </ScreenWrapper>
   )
   ```

3. **Replace components**:
   - `NeonCard` → `AnimatedNeonCard`
   - `NeonButton` → `AnimatedNeonButton`

4. **Done!** The screen now has smooth enter animation and interactive feedback.

## Examples

### Simple Button with Feedback
```typescript
<AnimatedNeonButton variant="primary" onClick={handleClick}>
  Confirm
</AnimatedNeonButton>
```

### Selection Grid
```typescript
<div className={styles.grid}>
  <AnimatedNeonCard
    title="Option 1"
    selected={selected === 'opt1'}
    onClick={() => setSelected('opt1')}
  >
    🎮
  </AnimatedNeonCard>
</div>
```

### Full Screen Flow
```typescript
<ScreenWrapper delay={0.2}>
  <ScreenShell title="Result">
    <motion.p variants={numberRevealVariants}>
      {result.toFixed(2)}
    </motion.p>
    <AnimatedNeonButton onClick={handleContinue}>
      Continue
    </AnimatedNeonButton>
  </ScreenShell>
</ScreenWrapper>
```

---

**Last Updated**: March 11, 2026
