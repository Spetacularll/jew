import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  build: {
    sourcemap: false, // 禁用源映射
    assetsDir: 'assets',

    // ⚡ 提高 chunk 限制（让警告消失）
    chunkSizeWarningLimit: 1000,

    // ⚡ 自动拆分 chunk，让你的 app 更轻量
    rollupOptions: {
      output: {
        manualChunks(id) {

          // 第三方库分组
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor-vue'
            if (id.includes('element-plus')) return 'vendor-element'
            return 'vendor'
          }

          // views 目录 chunk 拆分
          if (id.includes('/src/views/')) {
            const name = id.split('/src/views/')[1].split('/')[0]
            return `view-${name}`
          }

          return undefined
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
