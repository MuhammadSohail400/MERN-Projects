export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:      "#0A0A0F",
        surface: "#12121A",
        accent:  "#6C63FF",
        cyan:    "#00D4FF",
        muted:   "#8888AA",
        light:   "#F0F0F0",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm:   ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}