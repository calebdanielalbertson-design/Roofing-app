import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@repo/calc": path.resolve(__dirname, "../../packages/calc/src/index.ts"),
      "@repo/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
    },
  },
  server: {
    port: 5173,
    strictPort: false, // Let it fallback if busy, but we prefer 5173
  }
})
