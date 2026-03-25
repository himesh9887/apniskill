import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          975: '#020617',
        },
      },
      backgroundColor: {
        6: 'rgba(255,255,255,0.06)',
        8: 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [forms, typography],
};
