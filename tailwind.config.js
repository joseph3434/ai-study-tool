/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#BEB5FB',
          400: '#9D8FF9',
          500: '#7C6AF7',
          600: '#5B8AF0',
        },
        surface: {
          0: '#0D0D10',
          1: '#13131A',
          2: '#1C1C27',
          3: '#252535',
          4: '#2E2E42',
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(124, 106, 247, 0.3)',
        card: '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--color-text-primary)',
            maxWidth: 'none',
            h1: { color: 'var(--color-text-primary)' },
            h2: { color: 'var(--color-text-primary)' },
            h3: { color: 'var(--color-text-primary)' },
            code: {
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-surface-3)',
              borderRadius: '4px',
              padding: '2px 6px',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: 'var(--color-surface-3)',
              color: 'var(--color-text-primary)',
            },
            a: { color: 'var(--color-brand-400)' },
            strong: { color: 'var(--color-text-primary)' },
            blockquote: {
              color: 'var(--color-text-secondary)',
              borderLeftColor: 'var(--color-brand-500)',
            },
            hr: { borderColor: 'var(--color-border)' },
            th: { color: 'var(--color-text-primary)' },
            td: { color: 'var(--color-text-primary)' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
