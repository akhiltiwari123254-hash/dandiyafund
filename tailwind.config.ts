import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dandiya: {
          wine: "#1C0B18",
          "wine-dark": "#120510",
          "wine-light": "#2A1224",
          maroon: "#3D0C22",
          crimson: "#781D39",
          saffron: "#E65C00",
          "saffron-light": "#FF7A18",
          "saffron-glow": "#FFA34D",
          gold: "#D4AF37",
          "gold-light": "#F3E5AB",
          "gold-dark": "#AA820A",
          ivory: "#FDFBF7",
          sand: "#F4EFE6",
          charcoal: "#12090F",
          card: "rgba(35, 14, 30, 0.75)",
          cardHover: "rgba(50, 19, 43, 0.85)",
          border: "rgba(212, 175, 55, 0.2)",
          borderHover: "rgba(212, 175, 55, 0.45)",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Georgia", "serif"],
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 25px -4px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 10px 40px -6px rgba(212, 175, 55, 0.35)",
        saffron: "0 4px 25px -4px rgba(230, 92, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
