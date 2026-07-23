import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Polling: en bind mounts de Windows/Docker el file-watching nativo (inotify)
    // no detecta los cambios, así el hot-reload funciona sin reiniciar el contenedor.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
