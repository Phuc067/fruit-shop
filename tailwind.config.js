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
        secondary:"#ee4d2d",
        // secondary:"#f8c146",
        background:"#F1F2F3",
        gray:"#333333",
        smokeBlack: "#0000008A"
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], 
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
          paddingLeft: theme("spacing.2"),
          paddingRight: theme("spacing.2"),
          "@screen sm": {
            paddingLeft: theme("spacing.4"),
            paddingRight: theme("spacing.4"),
          },
          "@screen lg": {
            paddingLeft: theme("spacing.6"),
            paddingRight: theme("spacing.6"),
          }
        },
      });
    }),
  ],
};
