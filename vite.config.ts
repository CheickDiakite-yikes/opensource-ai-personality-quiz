
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Allow for proper HMR in more environments
      clientPort: 443,
      host: 'localhost'
    },
    // Enable history API fallback for SPA routing
    proxy: {}
  },
  plugins: [
    react(),
    mode === 'development' &&
    require('lovable-tagger').componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    target: 'es2020',
    // Ensure proper handling of SPA routing
    outDir: 'dist',
    assetsDir: 'assets',
    // Prevent the build from failing on warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          ui: ['@/components/ui/button', '@/components/ui/card']
        }
      }
    }
  }
}));
