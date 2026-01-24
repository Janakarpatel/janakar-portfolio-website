import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#ffffff',
        'light-text': '#000000',
        'light-secondary': '#000000',
        'dark-bg': '#000000',
        'dark-text': '#ffffff',
        'dark-secondary': 'rgba(255, 255, 255, 0.85)',
        'equation-light': '#4da6ff',
        'equation-dark': '#00ff00',
        'hover-blue': '#0000ff',
      },
      fontFamily: {
        'geist': 'var(--font-geist)',
        'bitter': 'var(--font-bitter)',
        'lora': 'var(--font-family-lora)',
        'crimson': 'var(--font-family-crimson)',
        'goudy': 'var(--font-family-goudy)',
        'arial': 'var(--font-family-arial)',
        'courier': 'var(--font-family-courier)',
      },
      letterSpacing: {
        'custom-tight': '-1px',
        'custom-tighter': '-1.2px',
        'custom-normal': '-0.3px',
        'custom-loose': '-0.2px',
        'custom-super-tight': '-0.8px',
        'custom-medium': '-0.5px',
      },
      spacing: {
        '35': '35px',
      },
    },
  },
  plugins: [],
};

export default config;
