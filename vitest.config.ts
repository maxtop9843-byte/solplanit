import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "maplibre-gl/dist/maplibre-gl.css": "/test/mocks/maplibre-gl.css",
      "maplibre-gl": "/test/mocks/maplibre-gl.ts",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
