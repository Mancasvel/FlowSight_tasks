import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: '#38bdf8',
          teal: '#00B8A9',
          brightCyan: '#00D9FF',
          blue: '#3B82F6',
        },
        secondary: {
          navy: '#0f172a',
          navyAlt: '#0A0A0F',
        },
        accent: {
          green: '#22C55E',
          orange: '#F59E0B',
          red: '#EF4444',
        },
        background: {
          offWhite: '#f8f9fa',
          darkNavy: '#0f172a',
        },
        dashboard: {
          bg: '#FAFAFA',
          card: '#FFFFFF',
          border: '#F4F4F5',
          text: '#18181B',
          muted: '#71717A',
          subtle: '#F4F4F5',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        elevated: '0 8px 30px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(at 27% 37%, #38bdf8 0px, transparent 50%), radial-gradient(at 97% 21%, #00B8A9 0px, transparent 50%), radial-gradient(at 52% 99%, #00D9FF 0px, transparent 50%), radial-gradient(at 10% 29%, #0ea5e9 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
export default config
