module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cat-yellow': '#FFC72C',
        'cat-dark': '#111111',
        'cat-gray-1': '#2A2A2A',
        'cat-gray-2': '#3D3D3D',
        'cat-gray-3': '#E5E7EB',
      },
    },
  },
  plugins: [],
};