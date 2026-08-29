import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("scheduler")) return "react-vendor";
          if (id.includes("lucide-react") || id.includes("lucide")) return "icons-vendor";
          return "vendor";
        },
      },
    },
  },
});
