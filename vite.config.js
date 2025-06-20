import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Configuration corrigée pour le déploiement
export default defineConfig({
  plugins: [react()],
  base: './', // 
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
