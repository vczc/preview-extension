/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'out/web-build', // 指定构建输出目录
    emptyOutDir: true, // 构建前清空输出目录
    assetsInlineLimit: 0, // 不限制资源内联的大小
    rollupOptions: {
      // 在此配置 rollup 选项，例如：
      external: ['vscode'], // 指定 vscode 为外部依赖
      input: {
        build: resolve(__dirname, './build.html'),
        service: resolve(__dirname, './service.html'),
      }
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    // 配置跨域
    cors: true,
    // 自定义响应头
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    },
    proxy: {
      '/api': {
        target: 'http://10.114.148.55:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
});
