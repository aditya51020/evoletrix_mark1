import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const port = Number(env.DEV_PORT || process.env.DEV_PORT || 3000)
  // Local dev backend: run `php -S localhost:8000 -t public` from the repo
  // root (XAMPP is only used for MySQL locally). Since that server's
  // docroot is public/, /api/xyz.php maps 1:1 to public/api/xyz.php —
  // no path rewrite needed. Override via .env.local if you run PHP
  // elsewhere: VITE_API_PROXY_TARGET=http://localhost:PORT
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:8000"
  return {
    plugins: [react()],
    server: {
      host: true,
      port,
      strictPort: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
