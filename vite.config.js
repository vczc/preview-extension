"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const vite_1 = require("vite");
const plugin_vue_1 = require("@vitejs/plugin-vue");
const path_1 = require("path");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_vue_1.default)()],
    build: {
        outDir: 'out/web-build',
        emptyOutDir: true,
        assetsInlineLimit: 0,
        rollupOptions: {
            // 在此配置 rollup 选项，例如：
            external: ['vscode'],
            input: {
                build: (0, path_1.resolve)(__dirname, './build.html'),
                service: (0, path_1.resolve)(__dirname, './service.html'),
            }
        },
    },
    resolve: {
        alias: {
            '@': (0, path_1.resolve)(__dirname, './src')
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
//# sourceMappingURL=vite.config.js.map