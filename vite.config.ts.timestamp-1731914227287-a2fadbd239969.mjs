// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Z:/vueProj/jewproj/node_modules/vite/dist/node/index.js";
import vue from "file:///Z:/vueProj/jewproj/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Z:/vueProj/jewproj/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Z:/vueProj/jewproj/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  build: {
    sourcemap: false,
    // 禁用源映射
    assetsDir: "assets"
    // 静态资源文件夹
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
  // base: '/', // 部署在服务器根路径
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJaOlxcXFx2dWVQcm9qXFxcXGpld3Byb2pcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIlo6XFxcXHZ1ZVByb2pcXFxcamV3cHJvalxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vWjovdnVlUHJvai9qZXdwcm9qL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgdnVlSnN4KCksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiBmYWxzZSwgLy8gXHU3OTgxXHU3NTI4XHU2RTkwXHU2NjIwXHU1QzA0XG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyAvLyBcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTY1ODdcdTRFRjZcdTU5MzlcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfSxcbiAgLy8gYmFzZTogJy8nLCAvLyBcdTkwRThcdTdGNzJcdTU3MjhcdTY3MERcdTUyQTFcdTU2NjhcdTY4MzlcdThERUZcdTVGODRcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TyxTQUFTLGVBQWUsV0FBVztBQUVqUixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBSjhILElBQU0sMkNBQTJDO0FBT2xNLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUE7QUFBQSxJQUNYLFdBQVc7QUFBQTtBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUE7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
