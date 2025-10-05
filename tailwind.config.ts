import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff'
        }
      }
    }
  },
  plugins: []
};

export default config;
