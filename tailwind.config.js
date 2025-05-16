/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "pomo-red": "#e44041",
        "pomo-dark": "#222222",
        "pomo-light": "#f2f2f2",
      },
      fontFamily: {
        pixel: ["VT323", "monospace"],
        "pixel-2p": ['"Press Start 2P"', "cursive"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 3s infinite",
        "blinking-cursor": "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      boxShadow: {
        pixel: "4px 4px 0 rgba(0, 0, 0, 0.2)",
        "pixel-sm": "2px 2px 0 rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
