import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  // Compile JSX in tests, so a component can be rendered with react-dom/server.
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
