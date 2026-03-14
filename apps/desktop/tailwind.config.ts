import type { Config } from 'tailwindcss';

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
        'mid-blue': '#2563EB',
        'accent-green': '#2ECC71',
        'accent-red': '#E74C3C',
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
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
