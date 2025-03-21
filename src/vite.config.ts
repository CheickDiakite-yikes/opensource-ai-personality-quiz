
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
    // Add proper SPA fallback during development
    proxy: {},
    fs: {
      strict: true,
    },
    // Enable SPA history mode API fallback
    middlewareMode: 'html',
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
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
    // Ensure these components are pre-bundled
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'framer-motion',
      '@tanstack/react-query'
    ],
  },
  build: {
    target: 'es2020',
    // Improve chunk loading reliability
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          ui: ['@/components/ui'],
          // Ensure report components are in their own chunk
          report: ['@/components/report']
        }
      }
    }
  }
}));
