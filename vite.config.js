import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // 前端启动端口
    proxy: {
      // 只要请求地址以 /api 开头，就会被代理到后端的 8888 端口
      '/api': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
      }
    }
  }
})