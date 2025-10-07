# 🎨 Caffeine Animations & Gestures Guide

Complete guide to the advanced animations and swipe gestures in the Caffeine website.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Animation Types](#animation-types)
- [Swipe Gestures](#swipe-gestures)
- [CSS Classes](#css-classes)
- [JavaScript API](#javascript-api)
- [Performance](#performance)
- [Accessibility](#accessibility)

---

## 🚀 Quick Start

### Include Required Files

Add these to your HTML `<head>`:

```html
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/animations.css">
```

Add this before closing `</body>`:

```html
<script src="js/animations.js"></script>
```

### Basic Usage

```html
<!-- Scroll-triggered fade in -->
<div class="scroll-reveal">
    <h2>This will fade in when scrolled into view</h2>
</div>

<!-- Swipeable product card -->
<article class="product-card swipeable">
    <!-- Swipe right to favorite, left to dismiss -->
</article>

<!-- Hover lift effect -->
<div class="hover-lift">
    <p>I lift up on hover!</p>
</div>
```

---

## 🎬 Animation Types

### 1. Scroll-Triggered Animations

Elements animate into view as user scrolls.

**Classes:**
- `.scroll-reveal` - Fade in and slide up
- `.scroll-reveal-left` - Slide in from left
- `.scroll-reveal-right` - Slide in from right
- `.animate-on-scroll` - General animation trigger

**Example:**
```html
<div class="scroll-reveal">
    <h2>I appear on scroll!</h2>
</div>
```

### 2. Staggered Animations

Child elements animate in sequence with delays.

**Usage:**
Add `data-stagger` attribute to parent container.

```html
<div class="products-grid" data-stagger>
    <div class="product-card">Item 1</div>
    <div class="product-card">Item 2</div>
    <div class="product-card">Item 3</div>
    <!-- Each item animates with 0.1s delay -->
</div>
```

### 3. Hover Effects

**Available Classes:**
- `.hover-lift` - Lifts element on hover
- `.hover-bounce` - Bounces element
- `.hover-shake` - Shakes element
- `.hover-wiggle` - Wiggles element
- `.hover-glow` - Adds glow effect
- `.hover-float` - Floating animation

```html
<button class="btn hover-lift">Hover me!</button>
```

### 4. Icon Animations

**Available Classes:**
- `.icon-pulse` - Pulsing effect
- `.icon-bounce` - Bouncing animation
- `.icon-rotate` - Continuous rotation
- `.icon-float` - Floating motion

```html
<i class="fas fa-heart icon-pulse"></i>
```

### 5. Attention Seekers

Draw attention to important elements.

**Classes:**
- `.attention-bounce` - Bounces 3 times
- `.attention-shake` - Shakes once
- `.attention-pulse` - Pulses 3 times
- `.attention-heartbeat` - Continuous heartbeat

```html
<div class="attention-bounce">
    <p>Important notification!</p>
</div>
```

### 6. Loading States

**Spinner:**
```html
<div class="spinner"></div>
<div class="spinner spinner-small"></div>
```

**Skeleton Loading:**
```html
<div class="skeleton" style="height: 100px;"></div>
```

**Progress Bar:**
```html
<div class="progress-bar"></div>
```

### 7. Card Flip

**HTML Structure:**
```html
<div class="flip-card">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <h3>Front Content</h3>
        </div>
        <div class="flip-card-back">
            <h3>Back Content</h3>
        </div>
    </div>
</div>
```

Flips on hover (desktop) or click (mobile).

---

## 👆 Swipe Gestures

### Swipeable Elements

Add `.swipeable` class to enable swipe gestures:

```html
<article class="product-card swipeable">
    <!-- Content -->
</article>
```

### Gesture Actions

**Swipe Right (→):**
- Adds item to favorites
- Shows ❤️ indicator
- Item animates out and back
- Shows success notification

**Swipe Left (←):**
- Dismisses item
- Shows 👈 indicator
- Item animates out and back

### Visual Feedback

- **Real-time transform:** Element follows finger movement
- **Rotation:** Slight rotation based on swipe direction
- **Opacity:** Fades as swipe progresses
- **Indicators:** Emoji appears on successful swipe

### Customization

Edit `js/animations.js` to customize swipe behavior:

```javascript
const minSwipeDistance = 50; // Minimum pixels for swipe
const deltaTime = 300; // Maximum time for quick swipe
```

---

## 📚 CSS Classes Reference

### Entrance Animations

| Class | Effect |
|-------|--------|
| `.animate-fade-in` | Fade in |
| `.animate-slide-up` | Slide up |
| `.animate-slide-left` | Slide from left |
| `.animate-slide-right` | Slide from right |
| `.animate-zoom-in` | Zoom in |
| `.animate-flip-in` | Flip in |

### Hover Effects

| Class | Effect |
|-------|--------|
| `.hover-lift` | Lifts on hover |
| `.hover-bounce` | Bounces |
| `.hover-shake` | Shakes |
| `.hover-wiggle` | Wiggles |
| `.hover-float` | Floats |
| `.hover-glow` | Glows |

### Icon Animations

| Class | Effect |
|-------|--------|
| `.icon-pulse` | Pulsing |
| `.icon-bounce` | Bouncing |
| `.icon-rotate` | Rotating |
| `.icon-float` | Floating |

### Loading States

| Class | Effect |
|-------|--------|
| `.spinner` | Loading spinner |
| `.spinner-small` | Small spinner |
| `.skeleton` | Skeleton loading |
| `.progress-bar` | Progress bar |

---

## 🔧 JavaScript API

### Available Functions

```javascript
// Animate cart icon
window.CaffeineAnimations.animateCartIcon();

// Smooth scroll to position
window.CaffeineAnimations.smoothScrollTo(targetY, duration);

// Create ripple effect
window.CaffeineAnimations.createRipple(event, element);

// Show swipe indicator
window.CaffeineAnimations.showSwipeIndicator('left' | 'right');
```

### Events

**Listen for cart additions:**
```javascript
document.addEventListener('itemAddedToCart', function(e) {
    console.log('Item added:', e.detail);
    // Custom logic here
});
```

### Custom Animations

**Add scroll reveal to new element:**
```javascript
const element = document.querySelector('.my-element');
element.classList.add('scroll-reveal');
```

**Trigger animation programmatically:**
```javascript
element.style.animation = 'fadeInScale 0.5s ease';
```

---

## ⚡ Performance Optimization

### GPU Acceleration

Elements with animations use GPU acceleration:

```css
.gpu-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}
```

### Will-Change

For frequently animated elements:

```css
.will-change-transform {
    will-change: transform;
}

.will-change-opacity {
    will-change: opacity;
}
```

### Best Practices

1. **Use transform and opacity** - Most performant properties
2. **Avoid animating layout properties** - width, height, margin, padding
3. **Keep animations short** - 200-500ms ideal
4. **Use requestAnimationFrame** - For smooth JS animations
5. **Debounce scroll events** - Prevent performance issues

### Performance Tips

```javascript
// Good - Uses transform
element.style.transform = 'translateX(100px)';

// Bad - Triggers layout
element.style.left = '100px';
```

---

## ♿ Accessibility

### Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### JavaScript Check

```javascript
const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
    // Skip or simplify animations
}
```

### Keyboard Navigation

- All interactive elements remain keyboard accessible
- Focus states preserved
- Swipe gestures have keyboard alternatives

---

## 📱 Mobile Considerations

### Touch Optimization

```css
.swipeable {
    touch-action: pan-y; /* Allow vertical scroll */
    user-select: none; /* Prevent text selection */
}
```

### Viewport Units

Animations adjust based on screen size:

```css
@media (max-width: 768px) {
    .product-card {
        animation-duration: 0.4s; /* Faster on mobile */
    }
}
```

---

## 🎨 Customization

### Change Animation Duration

In `css/animations.css`:

```css
@keyframes fadeIn {
    /* Adjust timing here */
}
```

### Modify Swipe Threshold

In `js/animations.js`:

```javascript
const minSwipeDistance = 50; // Change this value
```

### Add New Animation

1. **Define keyframes in CSS:**
```css
@keyframes myCustomAnimation {
    from { opacity: 0; transform: scale(0); }
    to { opacity: 1; transform: scale(1); }
}
```

2. **Create CSS class:**
```css
.my-animation {
    animation: myCustomAnimation 0.5s ease;
}
```

3. **Use in HTML:**
```html
<div class="my-animation">Animated content</div>
```

---

## 🐛 Troubleshooting

### Animations Not Working

1. **Check file includes:**
   ```html
   <link rel="stylesheet" href="css/animations.css">
   <script src="js/animations.js"></script>
   ```

2. **Verify class names:**
   ```html
   <div class="scroll-reveal"> <!-- Correct -->
   <div class="scrollReveal">  <!-- Wrong -->
   ```

3. **Check browser console** for JavaScript errors

### Swipes Not Detected

1. **Ensure `.swipeable` class is present**
2. **Check touch-action CSS property**
3. **Test on actual mobile device** (not just simulator)

### Performance Issues

1. **Reduce animation count** on page
2. **Simplify animation complexity**
3. **Use `will-change` sparingly**
4. **Check for memory leaks** in browser DevTools

---

## 📊 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Animations | ✅ | ✅ | ✅ | ✅ |
| Touch Events | ✅ | ✅ | ✅ | ✅ |
| Intersection Observer | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Custom Properties | ✅ | ✅ | ✅ | ✅ |

**Minimum Versions:**
- Chrome 61+
- Firefox 55+
- Safari 12+
- Edge 79+

---

## 💡 Examples

### Complete Product Card with Animations

```html
<article class="product-card swipeable scroll-reveal hover-lift">
    <div class="product-image">
        <img src="coffee.jpg" alt="Coffee">
        <button class="quick-add hover-bounce">
            <i class="fas fa-plus"></i>
        </button>
    </div>
    <div class="product-info">
        <h3>Premium Coffee</h3>
        <p>Description</p>
        <span class="price">$4.50</span>
        <button class="btn btn-primary">Add to Cart</button>
    </div>
</article>
```

### Animated Section with Stagger

```html
<section>
    <div class="container">
        <h2 class="scroll-reveal">Section Title</h2>
        <div class="grid" data-stagger>
            <div class="card scroll-reveal">Card 1</div>
            <div class="card scroll-reveal">Card 2</div>
            <div class="card scroll-reveal">Card 3</div>
        </div>
    </div>
</section>
```

---

## 📝 Notes

- **Mobile First:** Gestures designed for mobile but work on desktop too
- **Progressive Enhancement:** Site works without JavaScript
- **Lightweight:** Total animation files < 50KB
- **No Dependencies:** Pure CSS and vanilla JavaScript
- **Modular:** Easy to remove animations you don't need

---

## 🔗 Resources

- [Demo Page](animations-demo.html) - See all animations in action
- [Main Website](index.html) - Production implementation
- [CSS Animations MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Touch Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

**Created with ☕ for Caffeine Coffee Shop**

*For questions or issues, check the browser console or review the demo page.*
