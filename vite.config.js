import { defineConfig, splitVendorChunkPlugin  } from 'vite'
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject';
import nodePolyfills from "rollup-plugin-polyfill-node";

const libraries = [
  'react',
  'react-router-dom',
  'react-dom',
];

import { dependencies } from './package.json';
function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (libraries.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  assetsInclude: ['**/*.webp', '**/*.png', '**/*.jpg'],
  plugins: [react()],
  server: {
    port: 4590,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  clearScreen: false,
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
    process: "process/browser",
    stream: "stream-browserify",
    zlib: "browserfiy-zlib",
    os: "os-browserify/browser",
    http: "stream-http",
    assert: "assert"
  },
  envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG'],
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['buffer', 'Buffer'] }),
        nodePolyfills(),
        splitVendorChunkPlugin()
      ],
      output: {
        manualChunks: {
          vendor: libraries,
          ...renderChunks(dependencies),
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    outDir: 'build',
  },
  optimizeDeps: {
    exclude: [],
    esbuildOptions: {
      define: {
        'global': "globalThis"
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ]
    }
  },
})
