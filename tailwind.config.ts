import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { navy: "#102840", ocean: "#176891", mist: "#eef5f8" },
    },
  },
  plugins: [],
};

export default config;
