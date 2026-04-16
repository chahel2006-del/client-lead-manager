/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fcfcfd",
        foreground: "#101828",
        primary: {
          50: "#f5f8ff",
          100: "#ebf1ff",
          200: "#d6e4ff",
          300: "#adc8ff",
          400: "#84a9ff",
          500: "#6690ff",
          600: "#446df6",
          700: "#3555de",
          800: "#2d46b3",
          900: "#293e8f",
        },
        success: {
          50: "#ecfdf3",
          500: "#12b76a",
          700: "#027a48",
        },
        warning: {
          50: "#fffaeb",
          500: "#f79009",
          700: "#b54708",
        },
        error: {
          50: "#fef3f2",
          500: "#f04438",
          700: "#b42318",
        },
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0px 1px 2px rgba(16, 24, 40, 0.05)',
        'card': '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
      },
       fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
