/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        navy:   '#0b1120',
        teal:   '#00d4aa',
        // Surfaces
        bg:           '#f8f9ff',
        surface:      '#f8f9ff',
        'surface-low':  '#eff4ff',
        'surface-mid':  '#e5eeff',
        'surface-high': '#dce9ff',
        'surface-dim':  '#cbdbf5',
        'on-surface':   '#0b1c30',
        'on-surface-v': '#45464c',
        // Utility
        outline:        '#76777d',
        'outline-v':    '#c6c6cd',
        // Feedback
        error:          '#ba1a1a',
        'error-c':      '#ffdad6',
        // Amber flag
        amber:          '#f59e0b',
        'amber-light':  '#fffbeb',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        md:   '0.75rem',
        lg:   '1rem',
        xl:   '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        card:     '0 4px 20px rgba(11,17,32,0.05)',
        elevated: '0 10px 30px rgba(11,17,32,0.12)',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        container: '20px',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};
