/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        // Classic heritage color palette - Warm, scholarly tones
        primary: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f3dbc1',
          300: '#e9c197',
          400: '#dea362',
          500: '#d4853d',
          600: '#b86e2f',
          700: '#9a5728',
          800: '#7c4624',
          900: '#653a20',
        },
        // Classic burgundy/maroon for accents
        accent: {
          50: '#faf5f5',
          100: '#f3e8e8',
          200: '#e9d5d5',
          300: '#d9b3b3',
          400: '#c58585',
          500: '#a85c5c',
          600: '#8b4444',
          700: '#733737',
          800: '#5e2f2f',
          900: '#4d2828',
        },
        // Classic beige/cream for backgrounds
        classic: {
          50: '#fdfcfb',
          100: '#faf7f2',
          200: '#f5efe4',
          300: '#ebe2d1',
          400: '#dccfb8',
          500: '#c9b79a',
          600: '#b09a7a',
          700: '#8f7d5f',
          800: '#766750',
          900: '#625544',
        },
        // Warm gray for text and borders
        warmgray: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Gold accent for highlights
        gold: {
          50: '#fffef5',
          100: '#fffaeb',
          200: '#fff2c7',
          300: '#ffe8a3',
          400: '#ffd75f',
          500: '#f4c430',
          600: '#d4a017',
          700: '#b88a0e',
          800: '#936f0d',
          900: '#78590c',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0px)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#44403c',
            a: {
              color: '#8b4444',
              textDecoration: 'underline',
              textDecorationColor: '#d9b3b3',
              '&:hover': {
                color: '#733737',
                textDecorationColor: '#a85c5c',
              },
            },
            h1: {
              color: '#5e2f2f',
              fontWeight: '700',
            },
            h2: {
              color: '#733737',
              fontWeight: '600',
            },
            h3: {
              color: '#8b4444',
              fontWeight: '600',
            },
            strong: {
              color: '#5e2f2f',
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor: '#d4853d',
              color: '#57534e',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
