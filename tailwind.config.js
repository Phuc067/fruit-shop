/* eslint-disable no-undef */
const plugin = require("tailwindcss/plugin");


module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        // primary: "#f36f40",
        // secondary:"#FFFFFF",
        // tertiary: '#640d9a'

        primary:"#28a745",
        secondary:"#f8c146",
        background:"#F1F2F3",
        gray:"#585C5F"
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Thêm font Poppins
      },
      boxShadow: {
        ct: '0 0 50px rgba(255, 255, 255, 0.4)',
        ct3d: '2px 5px 3px rgba(255, 255, 255, 0.9)'
      }
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".container": {
          maxWidth: theme("columns.7xl"),
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: theme("spacing.6"),
          paddingRight: theme("spacing.6"),
        },
      });
    }),
  ],
};
