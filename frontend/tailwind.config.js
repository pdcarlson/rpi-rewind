// frontend/tailwind.config.js
import plugin from "tailwindcss/plugin";

// this is the list of *all* possible 'era' values from your events.json
const allEras = [
  "1820s",
  "1830s",
  "1840s",
  "1850s",
  "1860s",
  "1870s",
  "1880s",
  "1890s",
  "1900s",
  "1910s",
  "1920s",
  "1930s",
  "1940s",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

/** @type {import('tailwindcss').Config} */
export default {
  // --- this is the fix ---
  // we are adding "./src/**/*.css" (or just "./src/index.css")
  // so tailwind scans our css files for @apply directives
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx}",
    "./src/**/*.css", // <-- add this line
  ],
  // -----------------------

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      allEras.forEach((era) => {
        addVariant(`era-${era}`, `body.era-${era} &`);
      });
    }),
  ],
};
