import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite en JSX
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});