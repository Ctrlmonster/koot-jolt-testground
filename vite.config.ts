import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
// needed this for jolt-physics – not sure if it works outside of local dev
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crossOriginIsolation()],
  assetsInclude: ['**/*.glb'],
  optimizeDeps: {
    exclude: ['jolt-physics']
  }
})
