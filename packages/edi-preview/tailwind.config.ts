/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    extend: {
      colors: {
        c: {
          "segment": "red",
          "element": "#388E3C"
        }
      }
    },
  },
  plugins: [],
}
