import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
const root = path.resolve(__dirname, "./src")
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": root,
      "@components": path.resolve(root, "components"),
      "@lib": path.resolve(root, "lib"),
      "@pages": path.resolve(root, "pages"),
      "@assets": path.resolve(root, "assets"),
      "@utils": path.resolve(root, "utils"),
      "@styles": path.resolve(root, "styles"),
    },
  },
})
