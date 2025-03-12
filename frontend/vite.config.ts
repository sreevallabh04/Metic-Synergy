import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // Exclude certain dependencies from optimization
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    
    // Base URL configuration - can be overridden by VITE_BASE_URL env var
    base: env.VITE_BASE_URL || '/',
    
    // Build configuration
    build: {
      // Output directory - default is 'dist'
      outDir: 'dist',
      
      // Enable/disable source maps in production
      sourcemap: mode === 'development',
      
      // Minify options
      minify: 'terser',
      
      // Terser options
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
      
      // CSS related options
      cssCodeSplit: true,
      
      // Rollup options
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['framer-motion', '@mui/material', '@emotion/react', '@emotion/styled'],
          },
        },
      },
    },
    
    // Server options
    server: {
      // Host options - use '0.0.0.0' to make it accessible from other devices
      host: mode === 'development' ? 'localhost' : '0.0.0.0',
      
      // Port - can be overridden by VITE_PORT env var
      port: parseInt(env.VITE_PORT || '5173', 10),
      
      // Enable/disable open browser on start
      open: mode === 'development',
      
      // Proxy configuration for API requests (useful for development)
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    
    // Resolve aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
