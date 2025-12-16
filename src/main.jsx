import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

// NEW: Centralized CSS architecture!
// This single import brings in all styles in the correct order
import "./styles/main.css";

// Initialize theme on app load
import { initTheme } from "./styles/themes/themeUtils.js";
initTheme();

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
