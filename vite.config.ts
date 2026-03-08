import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  cacheDir: "node_modules/.vite",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    watch: {
      // Force polling fallback if fs events are flaky (macOS edge cases)
      usePolling: false,
    },
  },
  optimizeDeps: {
    // Force Vite to re-scan when deps change instead of serving stale cache
    force: mode === "development",
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
