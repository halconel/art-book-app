import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  build: {
    rollupOptions: {
      input: 'app/frontend/entrypoints/application.jsx',
      output: {
        manualChunks(id) {
          // Preserve the critical chunk structure from webpack
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('redux') || id.includes('router')) {
              return 'vendors';
            }
            return 'vendors';
          }
          if (id.includes('/components/admin/')) {
            return 'admin';
          }
          if (id.includes('/components/client/')) {
            return 'client';
          }
          if (id.includes('/components/shared/') || 
              id.includes('/components/ui/') || 
              id.includes('/services/') ||
              id.includes('/contexts/') ||
              id.includes('/utils/')) {
            return 'common';
          }
        },
      },
    },
    outDir: 'app/assets/javascripts',
    assetsDir: '.',
    emptyOutDir: false, // Important: don't clear the Rails assets directory
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    hmr: {
      overlay: false, // Prevent overlay conflicts with Rails
    },
  },
})
