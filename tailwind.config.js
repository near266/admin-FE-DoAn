/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        active: 'var(--color-text-active)',
        placeholder: 'var(--color-text-placeholder)',
      },
      colors: {
        'text-default': '#92929d',
        'color-error': '#ed5859',
        'color-access': '#37ae82',
        'color-default': '#bebec7',
      },
      backgroundColor: {
        primary: 'var( --background-color)',
      },
      borderColor: {
        primary: 'var(--border-color)',
      },
      fontFamily: {
        LexendDeca: ['Lexend Deca', 'sans-serif'],
      },
      lineHeight: {
        title: 'var(--line-height-title)',
        placeholder: 'var(--line-height-placeholder)',
      },
      fontSize: {
        title: 'var(--font-size-title)',
      },
      fontWeight: {
        title: 'var(--font-weight-title)',
      },
      height: {
        navbar: 'var(--height-navbar)',
      },
      width: {
        sidebar: 'var(--width-sidebar)',
      },
    },
  },
  plugins: [],
};
