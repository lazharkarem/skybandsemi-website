import { resolve } from 'path'
import { defineConfig } from 'vite'

// Automatically set base path for GitHub Pages based on the repository name
const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/'

export default defineConfig({
  base: repoName,
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
