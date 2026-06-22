import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}', './popup/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          warm:   '#F3F0EE',
          lifted: '#FCFBFA',
          deep:   '#EAE6E1',
        },
        ink: {
          black:  '#141413',
          muted:  '#555555',
          faint:  '#8A8785',
        },
        signal: {
          green:  '#1A7A4A',
          amber:  '#B45309',
          red:    '#C0392B',
          blue:   '#1D4ED8',
        },
        accent: {
          DEFAULT: '#CF4500',
          light:   '#F37338',
        },
        border: {
          DEFAULT: '#E0DBD6',
          strong:  '#C8C2BB',
          ink:     '#141413',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['28px', { lineHeight: '32px', letterSpacing: '-0.56px' }],
        'h1':      ['20px', { lineHeight: '24px', letterSpacing: '-0.40px' }],
        'h2':      ['16px', { lineHeight: '20px', letterSpacing: '-0.32px' }],
        'eyebrow': ['11px', { lineHeight: '14px', letterSpacing: '0.44px' }],
        'body':    ['14px', { lineHeight: '20px' }],
        'body-sm': ['13px', { lineHeight: '18px' }],
        'caption': ['12px', { lineHeight: '16px' }],
        'label':   ['12px', { lineHeight: '14px', letterSpacing: '0.12px' }],
        'button':  ['14px', { lineHeight: '14px', letterSpacing: '-0.28px' }],
      },
      borderRadius: {
        'sm':   '4px',
        'card': '16px',
        'btn':  '20px',
        'panel':'24px',
        'pill': '999px',
      },
      boxShadow: {
        'chip':  '0 2px 8px rgba(20,20,19,0.06)',
        'panel': '0 4px 24px rgba(20,20,19,0.10)',
        'modal': '0 8px 32px rgba(20,20,19,0.16)',
      },
      transitionDuration: {
        'instant':  '100ms',
        'fast':     '150ms',
        'standard': '200ms',
        'slow':     '300ms',
        'crawl':    '800ms',
      },
    },
  },
  plugins: [],
} satisfies Config
