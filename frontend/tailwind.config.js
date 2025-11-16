// frontend/tailwind.config.js
// import plugin from "tailwindcss/plugin"; // <-- DELETE THIS

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx}",
    "./src/**/*.css", // <-- This is key
  ],
  theme: {
    // (theme is unchanged and correct)
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["EB Garamond", "serif"],
      },
      colors: {
        "sepia-bg": "#f4f0e8",
        "sepia-text": "#4a3b2a",
        "sepia-accent": "#8b4513",
      },
    },
  },
  // --- THE PLUGIN IS GONE ---
  plugins: [],
  // --------------------------
};
