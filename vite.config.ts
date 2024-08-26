import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      //   "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
    base: "/",
//   base: "/rp/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
  optimizeDeps: {
    include: [
      // "froala-editor",
      //   "@wiris/mathtype-froala3",
      "pdfmake/build/pdfmake",
      "pdfmake/build/vfs_fonts",
    ],
  },
});
