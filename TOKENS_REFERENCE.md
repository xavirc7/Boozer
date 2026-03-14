# Design Tokens Reference Card

## Quick Token Lookup

### Colors

#### Cyan Neon (Primary)
- `--color-neon-cyan-bright`: #6ffbff
- `--color-neon-cyan-mid`: #59f3ff
- `--color-neon-cyan-dark`: #43e8ff
- `--color-neon-cyan-shadow`: rgba(111, 251, 255, 0.3)

#### Magenta Neon (Secondary)
- `--color-neon-magenta-bright`: #ff2faf
- `--color-neon-magenta-mid`: #ff3fb8
- `--color-neon-magenta-dark`: #f938b8
- `--color-neon-magenta-shadow`: rgba(255, 47, 175, 0.3)

#### Red Neon (Alert)
- `--color-neon-red-bright`: #ff5a5a
- `--color-neon-red-mid`: #ff4c4c
- `--color-neon-red-dark`: #ff3333
- `--color-neon-red-shadow`: rgba(255, 90, 90, 0.3)

#### Text
- `--color-text-primary`: #eafbff
- `--color-text-secondary`: #b7d9e6
- `--color-text-tertiary`: #7fa3b5
- `--color-text-muted`: #5a7a8f

#### Backgrounds
- `--color-bg-primary`: #0a0a14
- `--color-bg-secondary`: #151524
- `--color-bg-tertiary`: #1f1f32
- `--color-bg-overlay`: rgba(10, 10, 20, 0.95)

#### Borders
- `--color-border-light`: #2a4a5a
- `--color-border-dark`: #1a2a3a

### Spacing

| Token | Value |
|-------|-------|
| `--spacing-xs` | 4px |
| `--spacing-sm` | 8px |
| `--spacing-md` | 16px |
| `--spacing-lg` | 24px |
| `--spacing-xl` | 32px |
| `--spacing-2xl` | 48px |

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-xs` | 2px |
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |

### Shadows & Glows

#### Cyan Glows
- `--glow-cyan-soft`: 0 0 16px rgba(111, 251, 255, 0.4)
- `--glow-cyan-medium`: 0 0 24px rgba(111, 251, 255, 0.6)
- `--glow-cyan-strong`: 0 0 40px rgba(111, 251, 255, 0.8)

#### Magenta Glows
- `--glow-magenta-soft`: 0 0 16px rgba(255, 47, 175, 0.4)
- `--glow-magenta-medium`: 0 0 24px rgba(255, 47, 175, 0.6)
- `--glow-magenta-strong`: 0 0 40px rgba(255, 47, 175, 0.8)

#### Red Glows
- `--glow-red-soft`: 0 0 16px rgba(255, 90, 90, 0.4)
- `--glow-red-medium`: 0 0 24px rgba(255, 90, 90, 0.6)
- `--glow-red-strong`: 0 0 40px rgba(255, 90, 90, 0.8)

#### Box Shadows
- `--shadow-sm`: 0 2px 8px rgba(0, 0, 0, 0.3)
- `--shadow-md`: 0 4px 16px rgba(0, 0, 0, 0.5)
- `--shadow-lg`: 0 8px 32px rgba(0, 0, 0, 0.7)

#### Inset Shadows
- `--shadow-inset-cyan`: inset 0 0 20px rgba(111, 251, 255, 0.15)
- `--shadow-inset-dark`: inset 0 0 40px rgba(0, 0, 0, 0.5)

### Typography

#### Font Families
- `--font-family-primary`: 'Courier New', monospace (for special titles)
- `--font-family-fallback`: system-ui, -apple-system, 'Segoe UI', sans-serif

#### Font Sizes

| Token | Value |
|-------|-------|
| `--font-size-2xs` | 11px |
| `--font-size-xs` | 13px |
| `--font-size-sm` | 14px |
| `--font-size-base` | 16px |
| `--font-size-md` | 18px |
| `--font-size-lg` | 24px |
| `--font-size-xl` | 32px |
| `--font-size-2xl` | 48px |
| `--font-size-3xl` | 64px |
| `--font-size-4xl` | 96px |

#### Font Weights

| Token | Value |
|-------|-------|
| `--font-weight-light` | 300 |
| `--font-weight-regular` | 400 |
| `--font-weight-semibold` | 600 |
| `--font-weight-bold` | 700 |
| `--font-weight-black` | 900 |

### Transitions

| Token | Value |
|-------|-------|
| `--transition-fast` | 150ms ease |
| `--transition-normal` | 300ms ease |
| `--transition-slow` | 500ms ease |
| `--transition-smooth` | 400ms cubic-bezier(0.4, 0, 0.2, 1) |

### Z-Index

| Token | Value | Use Case |
|-------|-------|----------|
| `--z-base` | 0 | Default |
| `--z-content` | 10 | Main content |
| `--z-overlay` | 100 | Overlays |
| `--z-modal` | 1000 | Modals |
| `--z-toast` | 1001 | Toast notifications |
| `--z-tooltip` | 1002 | Tooltips |

## Copy-Paste Examples

### Title with Neon Glow
```css
.nice-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neon-cyan-bright);
  text-shadow: var(--glow-cyan-medium);
  letter-spacing: 2px;
  text-transform: uppercase;
}
```

### Interactive Button
```css
.interactive-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  transition: all var(--transition-normal);
}

.interactive-btn:hover {
  border-color: var(--color-neon-cyan-bright);
  box-shadow: 0 0 20px var(--color-neon-cyan-shadow);
}
```

### Alert Box
```css
.alert-box {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-neon-red-bright);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: var(--color-neon-red-bright);
  text-shadow: var(--glow-red-soft);
  box-shadow: 0 0 20px var(--color-neon-red-shadow);
}
```

### Subtle Accent
```css
.subtle-accent {
  background: rgba(111, 251, 255, 0.05);
  border-left: 3px solid var(--color-neon-cyan-mid);
  padding-left: var(--spacing-md);
  color: var(--color-text-secondary);
}
```

---

💡 **Pro Tip**: Always use tokens instead of hardcoded values. This makes the entire theme updatable from one file!
