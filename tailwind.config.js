/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // we’ll use custom classes too
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
          text: "#111827",
          primary: "#3b82f6", // blue
        },
        dark: {
          background: "#111827",
          text: "#f9fafb",
          primary: "#60a5fa", // lighter blue
        },
        surprise: {
          background: "#ecfdf5",
          text: "#065f46",
          primary: "#10b981",
        },
      },
    },
  },
};
