/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1A3A6B',
        'accent-green': '#2ECC71',
        'mid-blue': '#2563EB',
        surface: '#0F172A',
        'surface-elevated': '#1E293B',
        'surface-border': '#334155',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
