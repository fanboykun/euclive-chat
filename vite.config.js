import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [solidPlugin(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['/src/assets/favicon.ico', '/src/assets/robots.txt'],  
    manifest: {
      name: 'Lone Wolf Web Messenger',
      short_name: 'Lone Wolf',
      description: 'Lone Wolf is a peer-to-peer messenger.',
      theme_color: '#000000',
      icons: [
        {
          src: "favicon.ico",
          sizes: "64x64 32x32 24x24 16x16",
          type: "image/x-icon"
        }
      ],
    },
    workbox: {
      sourcemap: true  
    }  
  })],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
