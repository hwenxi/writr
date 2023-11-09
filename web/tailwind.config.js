/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    extend: {
      animation: {
        'bounce-small' : 'hop 1.5s infinite',
      },
      keyframes: {
        hop: {
            '0%, 100%' : {
              transform: 'translateY(-7%)',
              'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
            },
            '50%' : {
              transform: 'translateY(0)',
              'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
            }
          }
        }
      }
    },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["bumblebee"],
  },
}

