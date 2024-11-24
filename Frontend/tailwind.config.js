/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightPurple: '#E0BBE4', // Light Purple
        softBlue: '#A3C1DA', // Soft Blue
        mintGreen: '#B2E0D9', // Mint Green
        neutralGray: '#F3F4F6', // Light Gray
        warmTan: '#D9CBAE', // Light Tan
        vibrantRed: '#FF4757', // Bright Red
        vibrantYellow: '#FFA502', // Bright Yellow
        darkSlate: '#1F2937', // Dark Slate
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  layer: {
    utilities: {
      order: 'after',
      filename: 'utilities.css',
    },
  },
}

