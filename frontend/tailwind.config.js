/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ionPrimary: {
          DEFAULT: "#0054e9",
          shade: "#004acd",
          tint: "#1a65eb",
          '50': '#edf8ff',
          '100': '#d6edff',
          '200': '#b5e1ff',
          '300': '#83d0ff',
          '400': '#48b5ff',
          '500': '#1e91ff',
          '600': '#0671ff',
          '700': '#0054e9', // *
          '800': '#0847c5',
          '900': '#0d409b',
          '950': '#0e285d'
        },
        ionDark: {
          DEFAULT: "#2f2f2f",
          shade: "#292929",
          tint: "#444",
        },
        ionLight: {
          DEFAULT: "#f6f8fc",
          shade: "#d8dade",
          tint: "#f7f9fc",
          '50': '#f6f8fc', // *
          '100': '#e4e9f5',
          '200': '#cfdaee',
          '300': '#adc0e3',
          '400': '#86a1d4',
          '500': '#6a83c7',
          '600': '#566bba',
          '700': '#4c5aa9',
          '800': '#424b8b',
          '900': '#39416f',
          '950': '#262a45',
        },
        ionSuccess: {
          DEFAULT: "#2dd55b",
          shade: "#28bb50",
          tint: "#42d96b",
          '50': '#f0fdf3',
          '100': '#ddfbe4',
          '200': '#bdf5cb',
          '300': '#89eca4',
          '400': '#4eda74', 
          '500': '#2dd55b', // *
          '600': '#1a9f3e',
          '700': '#187d34',
          '800': '#18632e',
          '900': '#165127',
          '950': '#062d12'
        },
        ionDanger: {
          DEFAULT: "#c5000f",
          shade: "#ad000d",
          tint: "#cb1a27",
          '50': '#fff0f1',
          '100': '#ffdde0',
          '200': '#ffc1c6',
          '300': '#ff959d',
          '400': '#ff5966',
          '500': '#ff2637',
          '600': '#fc0619',
          '700': '#c5000f', // *
          '800': '#af0512',
          '900': '#900c16',
          '950': '#500006'
        },
      },
      padding: {
        ios: "14px",
      },
      margin: {
        ios: "14px",
      },
      borderRadius: {
        ios: "14px",
      },
      gap: {
        ios: "14px",
      }
    },
  },
  plugins: [],
};
