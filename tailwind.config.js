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
        pop: {
          '0%': { transform: 'scale(.7)' },
          '10%': { transform: 'scale(1)' },
          '20%': { transform: 'rotate(8deg) ' },
          '30%': { transform: 'rotate(-8deg) ' },
          '40%': { transform: 'rotate(0)' },
          '100%': {  },
        },
        fade: {
          '0%': {  top: '-100px' },
          '10%': { top: '0' },
          '90%': { opacity: '100%' },
          '100%': { opacity: '1%' }      
        },
        
      },
      animation: {
        like: 'pop 2s ease-in-out 1',
        fadeAway: 'fade 3s linear 1 ',
      }
    },
  },
  plugins: [],
}

