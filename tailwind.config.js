module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        home: ["Rubik Dirt", "cursive"],
      },
      backgroundImage: {
        hero: "url('./assets/home-bg.jpg')",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
