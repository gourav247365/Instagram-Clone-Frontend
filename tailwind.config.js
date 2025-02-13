/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["Lobster Two", "sans"]
      },
      keyframes: {
        Scale: {
          '0%': { transform: 'scale(.25)',border: 'solid white 2px' },
          '10%': { transform: 'scale(1)' },
          '32%': { borderBottom: ' solid green 2px' },
          '55%': { borderLeft: 'solid green 2px' },
          '77%': { borderTop: 'solid green 2px' },
          '100%': { borderRight: 'solid green 2px' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        scale2: {
          '0%': { transform: 'scale(.5)' },
          '10%': { transform: 'scale(1)' },
          '20%': { transform: 'rotate(8deg) ' },
          '30%': { transform: 'rotate(-8deg) ' },
          '40%': { transform: 'rotate(0)' },
          '100%': {  },
        },
        fade: {
          '0%': {  top: '-50px' },
          '10%': { top: '0' },
          '90%': { opacity: '100%' },
          '100%': { opacity: '1%' }      
        }
        
      },
      animation: {
        pop: 'Scale 2s ease-in-out 1',
        spining: 'rotate 1s ease-in-out infinite',
        pop2: 'scale2 2s ease-in-out 1',
        fadeAway: 'fade 3s linear 1 '
      }
    },
  },
  plugins: [],
}

