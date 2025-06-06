import { createGlobPatternsForDependencies } from "@nx/react/tailwind";
import path from "node:path";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}",
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // Configure your preferred themes
  },
};
