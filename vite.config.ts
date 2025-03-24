import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: mode === 'development' ? '/' : './', // Required for electron
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
      external: [/@rollup\/rollup-linux-*/], // Exclude platform-specific Rollup modules
    },
  },
  server: {
    host: 'localhost', // Changed from "::" to "localhost"
    port: 8080,
    strictPort: true,
    hmr: {
      protocol: 'ws', // Changed from 'wss' to 'ws' for standard WebSockets
      host: 'localhost',
      timeout: 30000,
      // Don't specify clientPort to let it use the same port as the server
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: ['@rollup/rollup-linux-x64-gnu'], // Exclude from optimization
    esbuildOptions: {
      target: 'es2020',
    },
  },
}));
