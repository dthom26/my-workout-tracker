/**
 * THEME TOGGLE COMPONENT
 * ======================
 * A button component to switch between light and dark themes.
 *
 * USAGE:
 * import ThemeToggle from './shared/components/ThemeToggle';
 * <ThemeToggle />
 *
 * Place it in your header or navigation bar!
 */

import { useState, useEffect } from "react";
import {
  getCurrentTheme,
  toggleTheme,
} from "../../styles/themes/themeUtils.js";

function ThemeToggle() {
  const [theme, setTheme] = useState(getCurrentTheme());

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.detail.theme);
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  return (
    <button
      className="btn btn-ghost btn-icon"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}

export default ThemeToggle;
