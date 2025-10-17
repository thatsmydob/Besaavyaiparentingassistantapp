# Responsive Header & Image Carousel Feature

## Overview

The Recall Detail Step 1 header has been redesigned with a responsive image carousel optimized for mobile one-handed operation.

## Design Specifications

### Viewport-Based Sizing
- **Max Height**: 35% of viewport height (35vh)
- **Typical Range**: 220-260px on most mobile devices
- **Min Height**: 220px (fallback for very small screens)
- **Calculation**: `height: min(35vh, 260px)`

### Visual Design
- **Border Radius**: 16px (rounded-2xl) - soft corners
- **Shadow**: Medium shadow (shadow-md) for elevation
- **Background**: #F3F4F6 (light gray) while images load
- **Padding**: 20px horizontal margins from container

### Carousel Features

#### Image Support
- **Capacity**: Up to 3 images per recall
- **Fallback**: Single image if no carousel images provided
- **Priority Order**:
  1. Custom `images[]` array (if provided)
  2. Food label image (for food recalls)
  3. Default product image

#### Swipe Gestures
- **Swipe Left**: Next image (if available)
- **Swipe Right**: Previous image (if available)
- **Minimum Distance**: 50px swipe to trigger
- **Transition**: 500ms smooth ease-out animation
- **One-Handed**: Optimized for thumb-based swiping

#### Pagination Dots
- **Position**: Bottom center of carousel
- **Spacing**: Bottom 12px (3 * 4px)
- **Dot Spacing**: 6px gap between dots
- **Active Indicator**:
  - Width: 24px (elongated pill)
  - Color: White (#FFFFFF)
  - Shadow: 0 2px 4px rgba(0,0,0,0.2)
- **Inactive Dots**:
  - Width: 8px (circle)
  - Color: rgba(255,255,255,0.5) (50% white)
  - Shadow: Same as active
- **Animation**: 300ms smooth width transition
- **Clickable**: Tap any dot to jump to that image

### Overlay Badges (Top-Right Corner)

#### Severity Badge
- **Position**: Top-right, 12px from edges
- **Padding**: 12px horizontal, 6px vertical
- **Border Radius**: Full (rounded-full)
- **Shadow**: Large shadow (shadow-lg)
- **Backdrop**: Blur effect (backdrop-blur-sm)
- **Border**: 1px solid rgba(255,255,255,0.2)
- **Colors by Severity**:
  - **Critical**: #DC2626 (red-600)
  - **High**: #EA580C (orange-600)
  - **Medium**: #D97706 (amber-600)
  - **Low**: #65A30D (lime-600)
- **Text**: 11px, 600 weight, white
- **Format**: "{Severity} Risk" (e.g., "Critical Risk")

#### Confidence Chip
- **Position**: Below severity badge, 8px gap
- **Padding**: 12px horizontal, 6px vertical
- **Border Radius**: Full (rounded-full)
- **Shadow**: Medium shadow (shadow-md)
- **Background**: rgba(255,255,255,0.95) (95% white)
- **Backdrop**: Blur effect (backdrop-blur-sm)
- **Border**: 1px solid rgba(79,70,229,0.2) (indigo)
- **Text**: 11px, 600 weight, #4f46e5 (indigo)
- **Format**: "{confidence}% match" (e.g., "98% match")

### Product Information Below Carousel

#### Product Name & Model
- **Spacing**: Snaps immediately beneath carousel (no extra gap)
- **Padding**: 20px horizontal from screen edges
- **Product Name**:
  - Font: 16px, 600 weight
  - Color: #212121 (dark gray)
  - Format: "{Brand} {Product Name}" (brand optional)
- **Model Number**:
  - Font: 13px, 500 weight
  - Color: #6D6D6D (medium gray)
  - Format: "Model: {model_number}"
  - Position: Directly below product name

## Data Structure

### Interface Addition
```typescript
interface RecallDetailStep1Props {
  recall: {
    // ... existing fields
    images?: string[]; // Optional array for carousel (up to 3 images)
  };
}
```

### Example Data
```typescript
{
  id: '1',
  productName: 'DreamNest Baby Crib',
  brand: 'DreamNest',
  model: 'DN-2024-CR',
  image: 'https://images.unsplash.com/photo-1.jpg', // Fallback
  images: [ // Carousel images
    'https://images.unsplash.com/photo-1.jpg',
    'https://images.unsplash.com/photo-2.jpg',
    'https://images.unsplash.com/photo-3.jpg'
  ],
  severity: 'Critical',
  confidence: 98,
  // ... other fields
}
```

## Touch Interaction Flow

1. **User touches image** → Records touch start position
2. **User drags finger** → Tracks touch move position
3. **User releases finger** → Calculates swipe distance
4. **If distance > 50px**:
   - Left swipe → Next image (if available)
   - Right swipe → Previous image (if available)
5. **Carousel animates** → 500ms smooth slide transition
6. **Pagination dots update** → Active dot changes with animation

## Accessibility Features

- **Alt Text**: Each image has descriptive alt text
- **Keyboard Nav**: Pagination dots are focusable buttons
- **ARIA Labels**: Each dot has "Go to image {n}" label
- **Visual Feedback**: Active dot clearly indicates current position
- **Touch Target**: Dots are large enough for easy tapping (minimum 24px height area)

## Mobile Optimization

### One-Handed Operation
- **Swipe Area**: Full carousel height is swipeable
- **Dot Position**: Bottom center is easy to reach with thumb
- **Badge Position**: Top-right doesn't interfere with swipe gestures

### Performance
- **Image Loading**: Progressive loading with gray background
- **Smooth Animations**: Hardware-accelerated transforms
- **Touch Response**: Immediate visual feedback
- **Memory Efficient**: Only 3 images maximum per carousel

### Viewport Responsiveness
- **Small Phones** (320-375px): 35vh ≈ 220-245px
- **Medium Phones** (375-414px): 35vh ≈ 245-270px (capped at 260px)
- **Large Phones** (414-480px): 35vh ≈ 270-315px (capped at 260px)
- **Max constraint**: Never exceeds 260px regardless of viewport

## Changes from Previous Design

### Before
- Square 1:1 aspect ratio image
- No carousel support
- Confidence badge below image
- Model in collapsible "More details"

### After
- Responsive viewport-based height (35vh, max 260px)
- Swipeable carousel with up to 3 images
- Overlay badges on image (severity + confidence)
- Model displayed directly below carousel
- Pagination dots for navigation

## Integration Points

### RecallDetailStep1.tsx
- New carousel component with swipe gestures
- Overlay badge positioning
- Pagination dots implementation
- Updated product info layout

### SafetyScreen.tsx
- Added `images` array to sample recall items
- Updated simulated recall data to include carousel images

### RecallDetailModal.tsx
- No changes needed (passes full recall object)

## Testing Scenarios

1. **Single Image**: Carousel works with 1 image (no dots shown)
2. **Multiple Images**: Carousel displays 2-3 images with dots
3. **Swipe Left/Right**: Smooth transitions between images
4. **Dot Click**: Direct navigation to specific image
5. **Badge Overlay**: Severity and confidence always visible
6. **Viewport Resize**: Height adjusts appropriately
7. **Touch Boundaries**: Swipe detection works across full image area

## Future Enhancements

- Pinch-to-zoom on images
- Image captions or labels
- Download/share image functionality
- Lazy loading for additional images
- Video support in carousel
- 360° product view integration
