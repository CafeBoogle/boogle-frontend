/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brown-1": "var(--color-brown-1)",
        "brown-2": "var(--color-brown-2)",
        "brown-3": "var(--color-brown-3)",
        "brown-4": "var(--color-brown-4)",
        "brown-5": "var(--color-brown-5)",
        "brown-6": "var(--color-brown-6)",
      },
    },
  },
  plugins: [],
};
