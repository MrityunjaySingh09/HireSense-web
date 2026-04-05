/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: '#F2F2F0',
        card: '#FFFFFF',
        border: '#E0E0E0',
        sidebar: '#0A0A0A',
        green: '#22C55E',
        red: '#EF4444',
        amber: '#F59E0B',
        ink: '#050505',
        muted: '#999999',
      },
    },
  },
  plugins: [],
}
