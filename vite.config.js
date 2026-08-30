import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const port = Number(env.DEV_PORT || process.env.DEV_PORT || 3000)
  return {
    plugins: [react()],
    server: {
      host: true,
      port,
      strictPort: true,
      allowedHosts: true,
    },
  }
})
