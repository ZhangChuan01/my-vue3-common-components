// vite.config.ts
import { defineConfig } from "file:///D:/zkhy/my-vue3-common-components/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/zkhy/my-vue3-common-components/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/zkhy/my-vue3-common-components/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import path from "path";
import eslintPlugin from "file:///D:/zkhy/my-vue3-common-components/node_modules/vite-plugin-eslint/dist/index.mjs";
import { createHtmlPlugin } from "file:///D:/zkhy/my-vue3-common-components/node_modules/vite-plugin-html/dist/index.mjs";
import AutoImport from "file:///D:/zkhy/my-vue3-common-components/node_modules/unplugin-auto-import/dist/vite.js";
import { createSvgIconsPlugin } from "file:///D:/zkhy/my-vue3-common-components/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import vueSetupExtend from "file:///D:/zkhy/my-vue3-common-components/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import dts from "file:///D:/zkhy/my-vue3-common-components/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
import autoprefixer from "file:///D:/zkhy/my-vue3-common-components/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "D:\\zkhy\\my-vue3-common-components";
var name = "vue3\u901A\u7528\u7EC4\u4EF6";
var vite_config_default = defineConfig({
  server: {
    host: "0.0.0.0"
    // proxy: {
    //   '^/api': {
    //     target: 'http://192.168.8.181:3001',
    //     changeOrigin: true
    //   }
    // }
  },
  css: {
    postcss: {
      plugins: [autoprefixer({})]
    }
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `@import "@/styles/theme.scss";`
    //   }
    // }
  },
  plugins: [
    vue(),
    vueJsx(),
    dts(),
    vueSetupExtend(),
    eslintPlugin({
      include: ["src/**/*.js", "src/**/*.vue", "src/*.js", "src/*.vue"]
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: name
        }
      }
    }),
    createSvgIconsPlugin({
      // 要缓存的图标文件夹
      iconDirs: [path.resolve(__vite_injected_original_dirname, "src/svg")],
      // 执行 icon name 的格式
      symbolId: "icon-[name]"
    }),
    AutoImport({
      imports: [
        // 需要自动导入的插件，自定义导入的API
        "vue",
        "vue-router",
        "pinia"
      ],
      dts: true
    })
  ],
  build: {
    lib: {
      // src/indext.ts 是我们导出组件的地方
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "MyVue3CommonComponents",
      formats: ["es", "umd"],
      // 运行构建时输出文件的名称
      fileName: "index"
    },
    rollupOptions: {
      // 确保外部依赖项不应捆绑到你的库中
      external: ["vue", "element-plus", "@element-plus/icons-vue", /element-plus/],
      input: "src/index.ts",
      output: {
        // 提供全局变量以便在 UMD 构建中可以被外部依赖项使用
        globals: {
          vue: "Vue",
          "element-plus": "ElementPlus"
        }
      }
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
      // 路径别名
    },
    extensions: [".js", ".json", ".ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx6a2h5XFxcXG15LXZ1ZTMtY29tbW9uLWNvbXBvbmVudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHpraHlcXFxcbXktdnVlMy1jb21tb24tY29tcG9uZW50c1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovemtoeS9teS12dWUzLWNvbW1vbi1jb21wb25lbnRzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IGVzbGludFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1odG1sJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHZ1ZVNldHVwRXh0ZW5kIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQnICAvL1x1NEZCRlx1NEU4RVx1NEY3Rlx1NzUyOFx1N0VDNFx1NEVGNlx1NTQwRFxyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJ1xyXG5cclxuY29uc3QgbmFtZSA9ICd2dWUzXHU5MDFBXHU3NTI4XHU3RUM0XHU0RUY2J1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6ICcwLjAuMC4wJ1xyXG4gICAgLy8gcHJveHk6IHtcclxuICAgIC8vICAgJ14vYXBpJzoge1xyXG4gICAgLy8gICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjguMTgxOjMwMDEnLFxyXG4gICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9XHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogWyBhdXRvcHJlZml4ZXIoe30pIF1cclxuICAgIH1cclxuICAgIC8vIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgIC8vICAgc2Nzczoge1xyXG4gICAgLy8gICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCBcIkAvc3R5bGVzL3RoZW1lLnNjc3NcIjtgXHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH1cclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICBkdHMoKSxcclxuICAgIHZ1ZVNldHVwRXh0ZW5kKCksXHJcbiAgICBlc2xpbnRQbHVnaW4oe1xyXG4gICAgICBpbmNsdWRlOiBbICdzcmMvKiovKi5qcycsICdzcmMvKiovKi52dWUnLCAnc3JjLyouanMnLCAnc3JjLyoudnVlJyBdXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICBpbmplY3Q6IHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICB0aXRsZTogbmFtZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIC8vIFx1ODk4MVx1N0YxM1x1NUI1OFx1NzY4NFx1NTZGRVx1NjgwN1x1NjU4N1x1NEVGNlx1NTkzOVxyXG4gICAgICBpY29uRGlyczogWyBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3N2ZycpIF0sXHJcbiAgICAgIC8vIFx1NjI2N1x1ODg0QyBpY29uIG5hbWUgXHU3Njg0XHU2ODNDXHU1RjBGXHJcbiAgICAgIHN5bWJvbElkOiAnaWNvbi1bbmFtZV0nXHJcbiAgICB9KSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgLy8gXHU5NzAwXHU4OTgxXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU3Njg0XHU2M0QyXHU0RUY2XHVGRjBDXHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkZDXHU1MTY1XHU3Njg0QVBJXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICdwaW5pYSdcclxuICAgICAgXSxcclxuICAgICAgZHRzOiB0cnVlXHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICAvLyBzcmMvaW5kZXh0LnRzIFx1NjYyRlx1NjIxMVx1NEVFQ1x1NUJGQ1x1NTFGQVx1N0VDNFx1NEVGNlx1NzY4NFx1NTczMFx1NjVCOVxyXG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcclxuICAgICAgbmFtZTogJ015VnVlM0NvbW1vbkNvbXBvbmVudHMnLFxyXG4gICAgICBmb3JtYXRzOiBbICdlcycsICd1bWQnIF0sXHJcbiAgICAgIC8vIFx1OEZEMFx1ODg0Q1x1Njc4NFx1NUVGQVx1NjVGNlx1OEY5M1x1NTFGQVx1NjU4N1x1NEVGNlx1NzY4NFx1NTQwRFx1NzlGMFxyXG4gICAgICBmaWxlTmFtZTogJ2luZGV4J1xyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU1OTE2XHU5MEU4XHU0RjlEXHU4RDU2XHU5ODc5XHU0RTBEXHU1RTk0XHU2MzQ2XHU3RUQxXHU1MjMwXHU0RjYwXHU3Njg0XHU1RTkzXHU0RTJEXHJcbiAgICAgIGV4dGVybmFsOiBbICd2dWUnLCAnZWxlbWVudC1wbHVzJywgJ0BlbGVtZW50LXBsdXMvaWNvbnMtdnVlJywgL2VsZW1lbnQtcGx1cy8gXSxcclxuICAgICAgaW5wdXQ6ICdzcmMvaW5kZXgudHMnLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBcdTYzRDBcdTRGOUJcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0ZcdTRFRTVcdTRGQkZcdTU3MjggVU1EIFx1Njc4NFx1NUVGQVx1NEUyRFx1NTNFRlx1NEVFNVx1ODhBQlx1NTkxNlx1OTBFOFx1NEY5RFx1OEQ1Nlx1OTg3OVx1NEY3Rlx1NzUyOFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHZ1ZTogJ1Z1ZScsXHJcbiAgICAgICAgICAnZWxlbWVudC1wbHVzJzogJ0VsZW1lbnRQbHVzJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxyXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpIC8vIFx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRFxyXG4gICAgfSxcclxuICAgIGV4dGVuc2lvbnM6IFsgJy5qcycsICcuanNvbicsICcudHMnIF1cclxuICB9XHJcbn0pXHJcbiJd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
