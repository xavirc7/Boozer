# Screen Layout System - Arcade Interface Refinement

## Overview

The `ScreenShell` component has been refined to create a cohesive arcade machine interface. All screens now share the same visual language, spacing system, and responsive behavior across all display sizes—from mobile to massive 5K+ kiosk displays.

## Architecture

### Components

**ScreenShell** (`src/components/layout/ScreenShell.tsx`)
- Pure React component wrapper
- Accepts: `title`, `subtitle`, `children`, `footer`
- Provides consistent structure for all screens
- No layout CSS in component (all in ScreenShell.module.css)

**ScreenWrapper** (`src/components/wrappers/ScreenWrapper.tsx`)
- Animation wrapper using Framer Motion
- Handles screen enter/exit animations
- Wraps ScreenShell for smooth transitions
- Independent of layout styling

## Key Improvements

### 1. **Token System Integration**
All hardcoded colors and sizes replaced with design tokens:
```css
/* OLD */
color: #00ffc8;
padding: 40px 40px 20px;

/* NEW */
color: var(--color-neon-cyan-bright);
padding: var(--spacing-2xl) var(--spacing-2xl) var(--spacing-lg);
```

**Benefits:**
- Single source of truth for all visual properties
- Easy theme updates
- Consistent spacing across all screens
- Professional maintenance

### 2. **Vertical Rhythm System**
Uses consistent token-based spacing for predictable vertical flow:

```
Header (cyan shadow gradient)
└─ Title: font-size-3xl, glow-cyan-medium
└─ Subtitle: font-size-md, text-secondary, no glow

Content (centered, max-width-1200px)
└─ Flex: column, center
└─ Large breathing gap: spacing-2xl (48px desktop)
└─ Child elements automatically spaced

Footer (cyan shadow gradient)
└─ Touch-friendly button area
```

### 3. **Responsive Design**

#### Mobile (≤768px)
- Titles: `font-size-2xl` (48px)
- Content: `padding: spacing-xl`, `gap: spacing-xl`
- Footer: Compact touch targets
- Maintains full usability

#### Desktop (769px—1920px)
- Titles: `font-size-3xl` (64px)
- Content: `padding: spacing-2xl`, `gap: spacing-2xl`
- Standard spacing and proportions

#### Large Kiosk (1921px—2560px)
- Titles: `font-size-4xl` (96px)
- Content: `padding: 3rem`, `gap: 3rem`
- Max-width: 1600px (prevents text lines from becoming too wide)

#### Ultra-Large (≥2560px)
- Titles: 96px (fixed size)
- Content: `padding: 4rem`, `gap: 4rem`
- Max-width: 2000px
- Extra large touch targets and buttons

### 4. **Visual Hierarchy**

**Header Section**
- Large cyan neon titles centered
- Cyan gradient background (subtle shadow)
- Cyan bottom border
- Sits at z-index: 2

**Content Section**
- Vertically centered using flexbox
- Max-width constrains text line length
- Dominant visual focus
- Sits at z-index: 1

**Footer Section**
- Call-to-action area for buttons
- Cyan gradient background (subtle shadow)
- Cyan top border
- Matches header styling
- Sits at z-index: 2

### 5. **Spacing Consistency**

| Element | Desktop | Kiosk | Ultra-Large |
|---------|---------|-------|-------------|
| Header padding-top | 48px | 48px | 64px |
| Header padding-bottom | 24px | 32px | 32px |
| Content padding | 48px | 48px | 64px |
| Content gap (between children) | 48px | 48px | 64px |
| Footer padding | 32px/48px | 32px/48px | 32px/64px |

All using CSS token variables for maintainability.

## Design Direction

### Arcade Machine Aesthetic
✓ Centered, symmetrical composition
✓ Cyan neon highlights and glows
✓ Clean separation between header, content, footer
✓ Touch-friendly target sizes
✓ Generous breathing room (no dense layouts)
✓ Strong visual hierarchy

### Grid Background
- Inherits from App-level background
- Subtle grid pattern (barely visible)
- Dark futuristic base color
- Consistent across all screens

### Title Styling
- Always cyan neon (`--color-neon-cyan-bright`)
- Always uppercase with letter-spacing
- Always has medium glow (`--glow-cyan-medium`)
- Responsive sizing: mobile < desktop < kiosk < ultra

### Content Positioning
- Always centered vertically
- Always centered horizontally
- Max-width prevents awkward line lengths on huge displays
- Plenty of padding for large touchscreens

## Usage Examples

### Simple Title + Content
```tsx
<ScreenShell title="Choose Language">
  <div>Language options here</div>
</ScreenShell>
```

Renders:
```
[Header with large cyan "CHOOSE LANGUAGE" title]
[Centered content in the middle]
```

### With Subtitle
```tsx
<ScreenShell title="Payment" subtitle="$5.00">
  <PaymentForm />
</ScreenShell>
```

Renders:
```
[Header with title and gray subtitle]
[Centered payment form]
```

### With Footer/CTA
```tsx
<ScreenShell
  title="Blow Test"
  footer={<button>Next</button>}
>
  <ProgressCircle />
</ScreenShell>
```

Renders:
```
[Header]
[Centered progress circle]
[Footer with button]
```

## CSS Classes Available

All styling is module-based (ScreenShell.module.css), but you can apply additional classes to children:

```tsx
<ScreenShell title="Test">
  <div className="text-cyan">Custom styled text</div>
  <button className="text-2xl text-bold">Large button</button>
</ScreenShell>
```

Uses global utility classes from `globals.css`:
- `.text-cyan`, `.text-magenta`, `.text-red` - Neon colors with glow
- `.text-2xl`, `.text-3xl`, `.text-4xl` - Large sizes
- `.font-bold`, `.font-semibold` - Font weights
- `.uppercase` - Text transform

## Responsive Behavior

The layout automatically adapts to screen size without any breakpoint classes. Here's what happens:

**Mobile Touch Screen (iPad, 768px)**
- Title shrinks to readable size
- Padding reduces to save space
- Buttons remain large and touch-friendly
- Subtitle is smaller but readable

**Desktop Monitor (1920px)**
- Title is impressive size (64px)
- Generous padding and spacing
- Content feels spacious and professional

**Kiosk Display (4K, ~2560px)**
- Title is MASSIVE (96px)
- Extra padding for immersion
- Content constrained to readable width

**Ultra-Large Display (5K+)**
- Titles stay at max readable size (96px)
- Max-width on content prevents awkwardness
- Extra breathing room on all sides

## Technical Details

### CSS Variables Used
- `--color-neon-cyan-bright`, `--color-neon-cyan-shadow` - Header/footer styling
- `--color-border-light` - Top/bottom borders
- `--color-text-secondary` - Subtitle color
- `--font-size-*` - All responsive sizes
- `--font-weight-*` - Title and text weights
- `--spacing-*` - All padding and gaps
- `--glow-cyan-medium` - Title shadow effect

### No Hardcoded Values
- ✅ All colors use tokens
- ✅ All sizes use tokens
- ✅ All spacing uses tokens
- ✅ All glows use token variables

## Breakpoints

| Size | Min-Width | Use Case |
|------|-----------|----------|
| Mobile | 0px | Tablets, small screens |
| Tablet | 769px | Standard tablets |
| Desktop | 1921px | 4K monitors |
| Ultra-Large | 2560px | 5K+ ultra-wide kiosk |

## Migration Guide

If you have custom screen styling, you can now simplify:

```css
/* OLD - hardcoded sizes/colors */
.myContainer {
  padding: 40px;
  color: #ffffff;
  font-size: 18px;
  gap: 30px;
}

/* NEW - using tokens */
.myContainer {
  padding: var(--spacing-2xl);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  gap: var(--spacing-2xl);
}
```

## Testing the Layout

### On Different Screens
1. **Mobile**: Use browser DevTools mobile emulation (iPad Pro 768px)
2. **Desktop**: Full HD monitor (1920px)
3. **Kiosk**: Resize browser to 2560px width
4. **Ultra**: Resize to 3840px+ (5K)

All should adapt smoothly without layout breaks.

---

**Status**: ✅ Complete
**Build**: Passing
**Breaking Changes**: None
**Architecture Impact**: None
