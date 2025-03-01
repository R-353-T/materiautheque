/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ionPrimary: {
          DEFAULT: "#0054e9",
          shade: "#004acd",
          tint: "#1a65eb"
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
        },
        ionDanger: {
          DEFAULT: "#c5000f",
          shade: "#ad000d",
          tint: "#cb1a27"
        }
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
