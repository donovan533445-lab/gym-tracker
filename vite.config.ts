import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/gym-tracker/',
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  build: { outDir: 'docs', emptyOutDir: true, rolldownOptions: { input: { main: 'index.html', mobile: 'mobile/index.html' } } },
});
