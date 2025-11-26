/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#000000',
          100: '#0a0a0a', // Main background
          200: '#121212', // Card background
          300: '#1E1E1E', // Border/Stroke
        },
        blue: {
          accent: '#0055FF', // Electric Blue
          glow: '#00A3FF',
        }
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'Inter', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        full: '0px', // Force override
      },
    },
  },
  plugins: [],
}
