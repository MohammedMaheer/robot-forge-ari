/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-blue':       '#1A3A6B',
        'mid-blue':         '#2563EB',
        'accent-green':     '#2ECC71',
        surface:            '#07090E',
        'surface-elevated': '#0D1117',
        'surface-card':     '#111827',
        'surface-border':   '#1C2333',
        'surface-hover':    '#161D2E',
        'text-primary':     '#F0F6FC',
        'text-secondary':   '#8B949E',
        'text-tertiary':    '#484F58',
        error:   '#F85149',
        warning: '#D29922',
        success: '#2ECC71',
        info:    '#388BFD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.8)',
        elevated:    '0 4px 16px rgba(0,0,0,0.7)',
        'glow-blue': '0 0 20px rgba(37,99,235,0.25)',
      },
    },
  },
  plugins: [],
};
