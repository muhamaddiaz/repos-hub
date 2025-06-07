import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import path from "node:path";

export default defineConfig({
  html: {
    template: "./src/index.html",
  },
  plugins: [pluginReact()],
  resolve: {
    alias: {
      "@repos-hub/shared-ui": path.resolve(__dirname, "../shared-ui/src/index.ts"),
    },
  },

  source: {
    entry: {
      index: "./src/main.tsx",
    },
    tsconfigPath: "./tsconfig.app.json",
  },
  server: {
    port: 4200,
  },
  output: {
    copy: [
      { from: "./src/favicon.ico" },
      { from: "./src/assets" }],

    target: "web",
    distPath: {
      root: "dist",
    },
    assetPrefix: process.env.RSBUILD_PUBLIC_PATH || "/",
  },
});
