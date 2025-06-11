import { defineConfig } from "vite";

export default defineConfig({
  // Change the directory name according to the game being developed.
  root: "src/games/hopway",
  base: "./",
  build: {
    // Change the directory name according to the game being developed.
    outDir: "../../../docs/hopway",
    emptyOutDir: true,
  },
});
