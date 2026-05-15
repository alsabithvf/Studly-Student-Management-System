// ✅ FILE: vite.config.js (replace your existing one)
// Tailwind v4 uses a Vite PLUGIN — not postcss.config.js
// This is the correct setup for @tailwindcss/vite

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← Tailwind v4 way

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← add this
  ],
})