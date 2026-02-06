import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa'


const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'shiraandspicekidsbooks',
    short_name: 'shiraandspicekidsbooks',
    theme_color: '#ffffff',
    "icons": [
    {
      "src": "icons/-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    {
      "src": "icons/-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "icons/-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    type: 'module',
    navigateFallback: 'index.html',
  },
}

const replaceOptions = { __DATE__: new Date().toISOString() }
const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'
const selfDestroying = process.env.SW_DESTROY === 'true'

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src'
  pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
  pwaOptions.strategies = 'injectManifest'
  ;(pwaOptions.manifest as Partial<ManifestOptions>).name = 'PWA Inject Manifest'
  ;(pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject'
  pwaOptions.injectManifest = {
    minify: false,
    enableWorkboxModulesLogs: true,
  }
}

if (claims)
  pwaOptions.registerType = 'autoUpdate'

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = 'true'
}

if (selfDestroying)
  pwaOptions.selfDestroying = selfDestroying


export default defineConfig({
  plugins: [react(),VitePWA(pwaOptions)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: false,
    allowedHosts: ['.e2b.app', '.e2b.dev', 'localhost', '127.0.0.1']
  }
})
