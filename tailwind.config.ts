import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',  // Includes MDX files if you're using them
    './components/**/*.{js,ts,jsx,tsx,mdx}',  // Includes MDX files in components
    './app/**/*.{js,ts,jsx,tsx,mdx}',  // Includes MDX files if using app directory (Next.js 13+)
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};

export default config;
