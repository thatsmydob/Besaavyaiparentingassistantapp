# Be-Saavy Global Layout System

## Overview
This document defines the global layout and visual rhythm specifications for the Be-Saavy application, establishing a clean, calm, and trust-first aesthetic optimized for mobile use.

## Core Principles

### Vertical Hierarchy
- **Primary sections**: 24px spacing (`space-y-6`)
- **Card internal content**: 16px spacing (`space-y-4`)
- **Text groups**: 12px spacing (`space-y-3`)
- **Tight groups**: 8px spacing (`space-y-2`)

### Card Design
- **Padding**: 16px (`p-4`) - consistent across all cards
- **Border radius**: 16px (`rounded-lg`)
- **Background**: Soft white (`bg-white`)
- **Shadow**: `shadow-soft` (y=2px, blur=8px, opacity=12%)

### Spacing Scale
```
space-y-1  → 4px   - Minimal spacing (labels to inputs)
space-y-2  → 8px   - Tight spacing (list items)
space-y-3  → 12px  - Default spacing (card sections)
space-y-4  → 16px  - Medium spacing (card content)
space-y-6  → 24px  - Large spacing (main sections)
```

### Shadow System
```css
--shadow-soft: 0 2px 8px 0 rgba(0, 0, 0, 0.12);  /* Primary card shadow */
--shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05);  /* Subtle elements */
--shadow-md:   0 4px 12px 0 rgba(0, 0, 0, 0.08); /* Hover states */
--shadow-lg:   0 8px 16px 0 rgba(0, 0, 0, 0.12); /* Elevated elements */
--shadow-xl:   0 12px 24px 0 rgba(0, 0, 0, 0.15);/* Modals/dialogs */
```

### Border Radius Scale
```
rounded-sm  → 8px   - Small elements
rounded-md  → 12px  - Medium elements
rounded-lg  → 16px  - Cards (PRIMARY)
rounded-xl  → 24px  - Large containers
rounded-2xl → 32px  - Hero elements
```

## Implementation Examples

### Standard Card
```tsx
<Card className="p-4 bg-white rounded-lg shadow-soft">
  <div className="space-y-4">
    {/* Card content */}
  </div>
</Card>
```

### Page Container
```tsx
<div className="p-6 space-y-6 pb-20 bg-background">
  {/* Sections with 24px spacing */}
</div>
```

### Alert Box (Internal)
```tsx
<div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-soft">
  {/* Alert content */}
</div>
```

## Color System

### Backgrounds
- **Primary background**: `#fafbfc` (`bg-background`)
- **Card background**: `#ffffff` (`bg-white`)
- **Muted background**: `#f7fafc` (`bg-muted`)

### Visual Rhythm
- Consistent white cards on soft background
- Subtle borders using `border-primary/20`
- No gradient backgrounds on standard cards (clean, professional)
- Accent colors used sparingly for alerts and highlights

## Touch Targets
- **Minimum size**: 44x44px (`touch-target` class)
- **Button padding**: Adequate for comfortable tapping
- **Spacing**: Prevents accidental taps

## Accessibility
- **High contrast**: All text meets WCAG AA standards
- **Focus states**: 2px ring with `outline-ring/50`
- **Reduced motion**: Respects user preferences

## Animations
- **Duration**: 300ms (`duration-normal`) for most transitions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for natural motion
- **Hover**: Scale to 1.05 for interactive elements
- **Active**: Scale to 0.95 for press feedback

## Component-Specific Guidelines

### HomeScreen
- Outer container: `p-6 space-y-6 pb-20`
- All cards: `p-4 rounded-lg shadow-soft`
- Section headers: 24px bottom spacing
- Welcome section: Standard vertical spacing

### Quick Actions Grid
- Grid: `grid-cols-2 gap-3`
- Cards: `p-4 rounded-lg`
- Icons: `w-12 h-12 rounded-lg`

### Stats Display
- Icons: `w-14 h-14 rounded-lg`
- Grid: `grid-cols-3 gap-4`

## Don'ts
❌ Don't mix padding sizes (always use `p-4` for cards)
❌ Don't use gradients on standard cards
❌ Don't use `rounded-2xl` on cards (use `rounded-lg`)
❌ Don't use custom shadow values (use design tokens)
❌ Don't skip the 24px section spacing

## Do's
✅ Always use `p-4` for card padding
✅ Always use `rounded-lg` for cards
✅ Always use `shadow-soft` for card shadows
✅ Always use `space-y-6` between major sections
✅ Keep backgrounds clean (white cards, soft backgrounds)
✅ Maintain visual rhythm through consistent spacing
