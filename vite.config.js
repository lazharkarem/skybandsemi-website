import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:         resolve(__dirname, 'index.html'),
        capabilities: resolve(__dirname, 'capabilities.html'),
        development:  resolve(__dirname, 'development.html'),
        products:     resolve(__dirname, 'products.html'),
        technology:   resolve(__dirname, 'technology.html'),
        about:        resolve(__dirname, 'about.html'),
        contact:      resolve(__dirname, 'contact.html'),
        privacy:      resolve(__dirname, 'privacy.html'),
      }
    }
  }
})
