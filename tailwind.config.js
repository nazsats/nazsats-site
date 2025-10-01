/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "purple-50": "#F5F3FF",
        "purple-300": "#C4B5FD",
        "purple-500": "#7C3AED",
        "purple-800": "#4C1D95",
        "lavender-100": "#EDE9FE",
        "lavender-200": "#DDD6FE",
        "gray-900": "#1F2937",
      },
    },
  },
  plugins: [],
};