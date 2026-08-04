import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const clientPort = Number(process.env.CLIENT_PORT) || 3000

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: clientPort,
  },
  resolve: {
    alias: {
      '@warchest/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  define: {
    __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
    __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
  },
  build: {
    outDir: path.join(__dirname, 'dist/client'),
  },
  ssr: {
    noExternal: [
      '@reduxjs/toolkit',
      'react-redux',
      'react-helmet',
      'redux',
      'redux-thunk',
      'immer',
      'reselect',
      'react-router-dom',
      'styled-components',
    ],
  },
  plugins: [react()],
})
