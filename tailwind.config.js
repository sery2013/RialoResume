/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rialo: {
          bg: '#010101',
          accent: '#a9ddd3',
          neutral: '#e8e3d5',
        }
      },
      backgroundImage: {
        'gradient-rialo': 'linear-gradient(135deg, #a9ddd3, #7cc9b8)',
        'gradient-subtle': 'linear-gradient(145deg, #0a0a0a, #111111)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(169, 221, 211, 0.15)',
        'glow-hover': '0 0 60px rgba(169, 221, 211, 0.25)',
      },
      borderRadius: {
        'sm-custom': '2px', // [[38]]: почти квадратные
      }
    },
  },
  plugins: [],
}
