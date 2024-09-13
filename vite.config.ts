import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es',  'umd', 'cjs'],
      fileName: 'index',
      name: 'LIB'
    }
  },
  plugins: [vue()],
})
