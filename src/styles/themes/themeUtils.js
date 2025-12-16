/**
 * THEME UTILITIES
 * ===============
 * JavaScript utilities for managing themes.
 *
 * FEATURES:
 * - Get current theme
 * - Set theme
 * - Toggle between themes
 * - Persist theme preference to localStorage
 */

const THEME_KEY = "workout-tracker-theme";
const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

/**
 * Get the current theme from localStorage or default to dark
 */
export function getCurrentTheme() {
  return localStorage.getItem(THEME_KEY) || THEMES.DARK;
}

/**
 * Set the theme and persist to localStorage
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
  if (!Object.values(THEMES).includes(theme)) {
    console.warn(`Invalid theme: ${theme}. Using dark theme.`);
    theme = THEMES.DARK;
  }

  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  // Dispatch custom event so components can react to theme changes
  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

/**
 * Toggle between dark and light themes
 */
export function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  setTheme(newTheme);
  return newTheme;
}

/**
 * Initialize theme on app load
 * Call this once when your app starts
 */
export function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);
}

/**
 * React hook for theme management (optional - use in React components)
 *
 * NOTE: Import React in your component file to use this hook:
 * import { useState, useEffect } from 'react';
 * import { useTheme } from './styles/themes/themeUtils.js';
 *
 * The ThemeToggle component already implements this pattern!
 */

export { THEMES };
