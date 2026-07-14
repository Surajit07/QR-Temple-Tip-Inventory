/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "!./node_modules/**",
    "!./dist/**",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
