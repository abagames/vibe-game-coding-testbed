import { defineConfig } from "vite";

export default defineConfig({
  // Change the directory name according to the game being developed.
  root: "src/games/labyracer",
  base: "./",
  build: {
    // Change the directory name according to the game being developed.
    outDir: "../../../docs/labyracer",
    emptyOutDir: true,
  },
});
