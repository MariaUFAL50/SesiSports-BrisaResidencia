/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#4CAF50',
        'dark-blue': '#164194',       // AJUSTADO: Cor exata do Figma para o botão azul
        'light-gray-bg': '#F5F5F5',   // Mantido, parece ser o cinza de fundo dos inputs
        'text-dark': '#333333',
        'text-link': '#1A73E8',
        'gray-300': '#A9A9A9',        // AJUSTADO: Cor exata do Figma para a borda do input
        'gray-500': '#6B7280',
        'red-500': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'input': '4.8px',             // NOVO: Raio exato para inputs
        'button': '14.26px',          // NOVO: Raio exato para botões
        'lg': '0.5rem', // Default Tailwind rounded-lg for AuthModal if needed
        'xl': '0.75rem', // Default Tailwind rounded-xl for AuthModal if needed
        '2xl': '1rem',   // Default Tailwind rounded-2xl for AuthModal if needed
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}