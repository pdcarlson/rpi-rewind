// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx}", "./src/**/*.css"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["EB Garamond", "serif"],
        mono: ["VT323", "monospace"],
        "mid-century": ["Oswald", "sans-serif"],
        // --- new ---
        retro: ["Paytone One", "sans-serif"],
        // -----------
      },
      colors: {
        // ... (bw-..., sepia-..., terminal-..., mid-... colors are unchanged)
        "bw-bg": "#f9f9f9",
        "bw-text": "#222222",
        "bw-accent": "#444444",
        "sepia-bg": "#f4f0e8",
        "sepia-text": "#4a3b2a",
        "sepia-accent": "#8b4513",
        "terminal-green": "#00FF00",
        "mid-bg": "#F3F0E6",
        "mid-text": "#3E3B32",
        "mid-accent-1": "#8B8C7A",
        "mid-accent-2": "#DDAA33",
        // --- new 1960s-1970s theme ---
        "retro-bg": "#FFF9E5", // creamy white
        "retro-text": "#4E342E", // dark brown
        "retro-accent1": "#F57C00", // orange
        "retro-accent2": "#A1887F", // taupe
        // -----------------------------
      },
    },
  },
  plugins: [],
};
