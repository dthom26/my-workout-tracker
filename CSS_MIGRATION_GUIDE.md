# CSS Architecture Migration Guide 🎨

## Overview

We've restructured the entire CSS architecture using **ITCSS (Inverted Triangle CSS)** methodology with **CSS Custom Properties** for theming. This provides a scalable, maintainable, and conflict-free styling system.

## What Changed?

### Before ❌

- Hard-coded colors everywhere (`#1E1E1E`, `#00BFFF`)
- Duplicate styles across multiple files
- No theme switching capability
- Inconsistent spacing and sizing
- Specificity conflicts
- Scattered resets and base styles

### After ✅

- CSS variables for all design tokens
- Single source of truth for styles
- Built-in dark/light theme switching
- Consistent spacing scale
- No conflicts - proper cascade
- Organized, scalable structure

## New Folder Structure

```
src/styles/
├── main.css                    # Single entry point - import this!
├── base/
│   ├── reset.css              # CSS reset
│   ├── typography.css         # Font styles
│   └── elements.css           # Base HTML elements
├── themes/
│   ├── tokens.css             # Design tokens (THE MOST IMPORTANT FILE!)
│   ├── dark.css               # Dark theme
│   ├── light.css              # Light theme
│   └── themeUtils.js          # Theme switching utilities
├── layout/
│   └── containers.css         # Page layouts and containers
├── components/
│   ├── buttons.css            # All button styles
│   ├── forms.css              # All form styles
│   ├── cards.css              # Card components
│   ├── headers.css            # Header styles
│   ├── step-indicator.css     # Step indicators
│   └── lists.css              # List components
└── utilities/
    └── spacing.css            # Spacing helpers
```

## How to Use

### 1. Import the Main Stylesheet

The main.jsx has been updated to import everything:

```javascript
import "./styles/main.css";
```

That's it! All styles are loaded in the correct order.

### 2. Use CSS Variables Instead of Hard-Coded Values

#### Before:

```css
.my-component {
  background: #1e1e1e;
  color: #e0e0e0;
  padding: 2rem;
  border: 2px solid #3a3a3a;
}
```

#### After:

```css
.my-component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: var(--space-xl);
  border: var(--border-width-default) solid var(--color-border-default);
}
```

### 3. Use Component Classes

Instead of creating custom styles, use the provided component classes:

```jsx
// Buttons
<button className="btn btn-primary">Save</button>
<button className="btn btn-secondary">Cancel</button>
<button className="btn btn-success btn-lg">Create</button>

// Forms
<div className="form-group">
  <label>Name</label>
  <input className="form-input" type="text" />
</div>

// Containers
<div className="page-container">
  <div className="section">
    <div className="card">
      Content here
    </div>
  </div>
</div>
```

## CSS Variables Reference

### Colors

```css
/* Semantic Colors (Use these!) */
--color-bg-primary         /* Main background */
--color-bg-secondary       /* Secondary background */
--color-bg-elevated        /* Cards, modals */
--color-text-primary       /* Main text */
--color-text-secondary     /* Secondary text */
--color-text-accent        /* Accent text (links, highlights) */
--color-primary            /* Primary brand color */
--color-success            /* Success states */
--color-error              /* Error states */
--color-border-default     /* Default borders */
--color-border-focus       /* Focus states */
```

### Spacing

```css
--space-2xs: 0.25rem; /* 4px */
--space-xs: 0.5rem; /* 8px */
--space-sm: 0.75rem; /* 12px */
--space-md: 1rem; /* 16px */
--space-lg: 1.5rem; /* 24px */
--space-xl: 2rem; /* 32px */
--space-2xl: 3rem; /* 48px */
```

### Typography

```css
--font-size-xs through --font-size-4xl
--font-weight-normal through --font-weight-extrabold
--line-height-tight, normal, relaxed
```

### Borders & Radius

```css
--radius-sm through --radius-2xl, --radius-full
--border-width-thin, default, thick
```

## Theme Switching

### Add Theme Toggle to Your Component

```jsx
import ThemeToggle from "./shared/components/ThemeToggle";

function MyHeader() {
  return (
    <header className="page-header">
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

### Programmatic Theme Control

```javascript
import {
  setTheme,
  toggleTheme,
  getCurrentTheme,
} from "./styles/themes/themeUtils.js";

// Get current theme
const theme = getCurrentTheme(); // 'dark' or 'light'

// Set specific theme
setTheme("light");

// Toggle between themes
toggleTheme();
```

## Migration Checklist

### For Each Feature CSS File:

1. **Replace hard-coded colors with CSS variables**

   - Find: `#1E1E1E` → Replace: `var(--color-bg-primary)`
   - Find: `#00BFFF` → Replace: `var(--color-primary)`
   - Find: `#E0E0E0` → Replace: `var(--color-text-primary)`

2. **Replace hard-coded spacing with tokens**

   - Find: `2rem` → Replace: `var(--space-xl)`
   - Find: `1.5rem` → Replace: `var(--space-lg)`
   - Find: `0.5rem` → Replace: `var(--space-xs)`

3. **Use component classes where possible**

   - Remove duplicate button styles, use `.btn` classes
   - Remove duplicate form styles, use `.form-group` classes
   - Remove duplicate card styles, use `.card` classes

4. **Remove !important declarations**

   - The cascade is properly organized now
   - If you need to override, increase specificity properly

5. **Test in both themes**
   - Click the theme toggle
   - Verify colors look good in both themes
   - Check contrast for accessibility

## Example Migration

### Before: CreateProgram.css

```css
.create-program-container {
  background: #1e1e1e;
  color: #e0e0e0;
  padding: 2rem;
  border-radius: 18px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input {
  background: #1e1e1e;
  color: #e0e0e0;
  border: 2px solid #3a3a3a;
  padding: 0.75rem;
}
```

### After: CreateProgram.css (Minimal)

```css
/* Most styles are now handled by base classes! */

.create-program-specific-feature {
  /* Only keep truly unique styles here */
  /* Everything else comes from base classes */
}
```

### In the JSX:

```jsx
<div className="page-container">
  {" "}
  {/* replaces .create-program-container */}
  <div className="form-group">
    <label>Program Name</label>
    <input type="text" /> {/* Styles come from forms.css */}
  </div>
</div>
```

## Component Classes Available

### Layout

- `.container`, `.container-narrow`
- `.page-container`
- `.section`
- `.card`
- `.flex`, `.flex-col`, `.flex-center`, `.flex-between`
- `.grid`, `.grid-2`, `.grid-3`

### Buttons

- `.btn` + `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-error`
- `.btn-sm`, `.btn-lg`
- `.btn-outline`, `.btn-ghost`, `.btn-icon`

### Forms

- `.form-group`
- `.form-input`
- `.form-row`
- `.form-grid-2`, `.form-grid-3`
- `.form-actions`

### Headers

- `.page-header`, `.page-title`
- `.section-header`
- `.session-header`, `.session-title`

### Lists & Cards

- `.exercise-list`, `.exercise-item`
- `.program-preview`, `.saved-workouts-section`
- `.nav-cards`

## Best Practices

### ✅ DO:

- Use CSS variables for ALL colors, spacing, and sizes
- Use semantic variable names (`--color-bg-primary` not `--color-dark`)
- Use existing component classes before creating custom styles
- Keep feature-specific CSS files minimal
- Test in both themes
- Use the spacing scale consistently

### ❌ DON'T:

- Hard-code colors or spacing values
- Use `!important` unless absolutely necessary
- Duplicate styles that exist in base components
- Create new component styles in feature files
- Skip the cascade - fight specificity battles

## Testing Your Migration

1. **Visual Check**: Does everything look the same?
2. **Theme Toggle**: Does light theme work correctly?
3. **Responsive**: Check mobile layouts
4. **Accessibility**: Good contrast in both themes?
5. **Console**: Any CSS warnings or errors?

## Need Help?

### Common Issues:

**Colors not showing?**

- Check if you're using the CSS variable correctly: `var(--color-primary)`
- Make sure main.css is imported in main.jsx

**Theme not switching?**

- Verify `data-theme` attribute is on the `<html>` element
- Check that initTheme() is called in main.jsx

**Styles not applying?**

- Check import order in main.css
- Verify class names match exactly
- Check browser dev tools for which rule is winning

## Next Steps

Now that the foundation is built, you can:

1. **Migrate existing feature CSS files** to use the new system
2. **Add the ThemeToggle** component to your dashboard
3. **Clean up** old CSS files that are no longer needed
4. **Extend** the system with new components as needed

## Benefits You'll See

- 🎨 **Instant theming** - Change themes with one click
- 🔧 **Easy maintenance** - Change colors once, update everywhere
- 🚀 **Faster development** - Reuse existing components
- 📏 **Consistency** - Same spacing and colors everywhere
- 🐛 **Fewer bugs** - No more specificity conflicts
- 📱 **Better responsive** - Consistent breakpoints
- ♿ **Accessibility** - Proper contrast in both themes

---

**Welcome to your new CSS architecture!** 🎉

This system will make your life much easier as the app grows. Questions? Check the tokens.css file - it's heavily commented with explanations!
