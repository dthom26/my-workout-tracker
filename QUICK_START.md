# Quick Start Guide - New CSS Architecture 🚀

## What We Built

A **professional, scalable CSS architecture** with:

- ✅ CSS Custom Properties (CSS Variables) for all design tokens
- ✅ Dark and Light theme support
- ✅ Centralized component styles
- ✅ No more conflicts or duplicates
- ✅ Single source of truth
- ✅ Easy to maintain and extend

## Immediate Benefits

1. **Your app now supports theme switching!** 🌓
2. **All your existing pages should still look the same** (dark theme)
3. **You can now use consistent classes** instead of repeating styles
4. **Changes are easier** - update colors once, change everywhere

## Try It Now!

### 1. Add Theme Toggle to Dashboard

Open [src/features/dashboard/Dashboard.jsx](src/features/dashboard/Dashboard.jsx) and add:

```jsx
import ThemeToggle from "../../shared/components/ThemeToggle";

// In your return statement, add the theme toggle to your header:
<div className="dashboard-header">
  <h1 className="dashboard-title">Dashboard</h1>
  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
    <ThemeToggle /> {/* Add this line! */}
    <button className="btn-sign-out" onClick={handleSignOut}>
      Sign Out
    </button>
  </div>
</div>;
```

### 2. View Your App

Go to: http://localhost:5173/my-workout-tracker

**Click the 🌞/🌙 button** in the header to switch themes!

## Understanding the New Structure

### Design Tokens (The Heart of the System)

File: [src/styles/themes/tokens.css](src/styles/themes/tokens.css)

This file contains ALL your design values:

```css
/* Instead of hardcoding #1E1E1E everywhere, we now use: */
var(--color-bg-primary)

/* Instead of hardcoding 2rem everywhere, we use: */
var(--space-xl)
```

### Key Variables You'll Use Most

```css
/* Backgrounds */
--color-bg-primary       /* Main page background */
--color-bg-secondary     /* Card backgrounds */
--color-bg-elevated      /* Elevated elements */

/* Text */
--color-text-primary     /* Main text color */
--color-text-secondary   /* Secondary/muted text */
--color-text-accent      /* Highlighted text (blue) */

/* Colors */
--color-primary          /* Your blue (#00BFFF) */
--color-success          /* Your green */
--color-error            /* Error red */

/* Spacing (Use these instead of px/rem!) */
--space-xs: 0.5rem
--space-sm: 0.75rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
--space-2xl: 3rem

/* Borders */
--border-width-default: 2px
--radius-sm through --radius-2xl
```

## Real Examples

### Example 1: Creating a New Page

**Old Way:**

```jsx
<div style={{
  background: '#1E1E1E',
  padding: '2rem',
  borderRadius: '18px'
}}>
```

**New Way:**

```jsx
<div className="page-container">{/* That's it! All styling is handled */}</div>
```

### Example 2: Custom Component That Needs Specific Styles

```css
/* In your feature CSS file */
.my-specific-component {
  /* Use variables, not hard-coded values! */
  background: var(--color-bg-secondary);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  border: var(--border-width-default) solid var(--color-border-default);
}
```

**Why this is better:**

- Works in both themes automatically
- Consistent with rest of app
- Easy to change globally
- No more specificity battles

### Example 3: Buttons

**Before:**

```jsx
<button
  style={{
    background: "#4CAF50",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "5px",
  }}
>
  Save
</button>
```

**After:**

```jsx
<button className="btn btn-success">Save</button>
```

Available button classes:

- `btn btn-primary` (your blue)
- `btn btn-success` (green)
- `btn btn-error` (red)
- `btn btn-secondary` (gray)
- Add size: `btn-sm` or `btn-lg`

## Common Patterns

### Form with Proper Styling

```jsx
<div className="form-group">
  <label>Exercise Name</label>
  <input type="text" placeholder="Bench Press" />
  {/* Input styling is automatic! */}
</div>

<div className="form-row">
  <input type="number" placeholder="Sets" />
  <input type="number" placeholder="Reps" />
  <button className="btn btn-add">Add</button>
</div>
```

### Card/Section

```jsx
<div className="card">
  <h3>Workout Details</h3>
  <p>Your workout information goes here</p>
</div>
```

### Flex Layouts

```jsx
<div className="flex-between">
  <h2>My Title</h2>
  <button className="btn btn-primary">Action</button>
</div>
```

## Migration Priority

You can migrate your existing CSS files gradually. Priority order:

1. **High Priority** (Most benefit):

   - Dashboard.css
   - CreateProgram.css
   - CurrentSession.css

2. **Medium Priority**:

   - ExecuteProgram.css
   - ListOfUsersPrograms.css

3. **Low Priority** (Already using shared styles):
   - Auth styles (can stay separate since it's a different look)

## How to Migrate a File

For each CSS file (e.g., Dashboard.css):

1. **Find and replace colors:**

   - `#1E1E1E` → `var(--color-bg-primary)`
   - `#00BFFF` → `var(--color-primary)`
   - `#E0E0E0` → `var(--color-text-primary)`
   - `#20B2AA` → `var(--color-success)`

2. **Find and replace spacing:**

   - `2rem` → `var(--space-xl)`
   - `1.5rem` → `var(--space-lg)`
   - `1rem` → `var(--space-md)`

3. **Use component classes in JSX:**

   - Replace custom `.my-button` with `.btn btn-primary`
   - Replace custom containers with `.page-container` or `.card`

4. **Remove duplicate styles:**

   - If a style already exists in components/, remove it from your file

5. **Test both themes:**
   - Toggle between dark and light
   - Verify everything looks good

## Cheat Sheet

### Most Used Classes

```css
/* Layout */
.page-container          /* Full page wrapper */
/* Full page wrapper */
.container               /* Content container */
.card                    /* Content card */
.section                 /* Page section */

/* Flex */
.flex-between            /* Justify space-between */
.flex-center             /* Center everything */
.flex-col                /* Flex column */

/* Buttons */
.btn .btn-primary        /* Primary button */
.btn .btn-success        /* Success button */
.btn .btn-error          /* Error button */
.btn .btn-lg             /* Large button */

/* Forms */
.form-group              /* Label + input wrapper */
.form-row                /* Horizontal input row */
.form-actions            /* Form button container */

/* Spacing utilities */
.mb-lg                   /* Margin bottom large */
.gap-md; /* Gap medium (for flex/grid) */
```

## Theme Switching Programmatically

```javascript
import { setTheme, toggleTheme } from "./styles/themes/themeUtils.js";

// Set to light theme
setTheme("light");

// Set to dark theme
setTheme("dark");

// Toggle between themes
toggleTheme();
```

## What's Different?

### File Structure

```
Before: Each feature has its own CSS with repeated styles
After: Centralized styles + minimal feature-specific CSS
```

### Colors

```
Before: #1E1E1E hardcoded everywhere
After: var(--color-bg-primary) - changes with theme!
```

### Maintenance

```
Before: Change button color in 10 different files
After: Change once in tokens.css, updates everywhere
```

## Next Steps

1. **Add ThemeToggle** to your Dashboard (see example above)
2. **Try switching themes** to see it in action
3. **Browse through** [tokens.css](src/styles/themes/tokens.css) to see all available variables
4. **Start using component classes** in your new components
5. **Gradually migrate** existing CSS files when you work on them

## Questions?

- **Where are all the design values?** → `src/styles/themes/tokens.css`
- **How do I add a new color?** → Add it to tokens.css and dark/light theme files
- **How do I customize a component?** → Use CSS variables, don't fight the cascade
- **Theme not switching?** → Make sure `data-theme` attribute is on `<html>`
- **Styles not applying?** → Check class names and import order in main.css

## Resources

- 📚 **Full Migration Guide**: [CSS_MIGRATION_GUIDE.md](CSS_MIGRATION_GUIDE.md)
- 🎨 **Design Tokens**: [src/styles/themes/tokens.css](src/styles/themes/tokens.css)
- 🧩 **Component Styles**: [src/styles/components/](src/styles/components/)
- 🔧 **Theme Utils**: [src/styles/themes/themeUtils.js](src/styles/themes/themeUtils.js)

---

**Your app now has professional-grade CSS architecture!** 🎉

Start experimenting with the theme toggle and explore the component classes. The hard work is done - now enjoy the benefits!
