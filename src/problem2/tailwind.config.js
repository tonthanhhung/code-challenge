/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#6c47ff',
          subtle: 'rgba(108, 71, 255, 0.1)',
          glow: 'rgba(108, 71, 255, 0.25)',
        },
        text: {
          DEFAULT: '#1a1a2e',
          muted: '#8b8fa8',
        },
        bg: '#f0f2ff',
        card: '#ffffff',
        input: '#f7f8ff',
        border: '#e4e6f0',
        hover: '#f0f2ff',
        icon: '#f0f2ff',
        error: '#e53e3e',
        success: '#38a169',
        'success-bg': 'rgba(56, 161, 105, 0.12)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        lg: '0 20px 60px rgba(108, 71, 255, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '24px',
        'xl': '16px',
        'lg': '14px',
      },
    },
  },
  plugins: [],
}
