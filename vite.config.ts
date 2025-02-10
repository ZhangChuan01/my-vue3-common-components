import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'  //便于使用组件名
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import autoprefixer from 'autoprefixer'

const name = 'vue3通用组件'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0'
    // proxy: {
    //   '^/api': {
    //     target: 'http://192.168.8.181:3001',
    //     changeOrigin: true
    //   }
    // }
  },
  css: {
    postcss: {
      plugins: [ autoprefixer({}) ]
    }
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `@import "@/styles/theme.scss";`
    //   }
    // }
  },
  plugins: [
    vue(),
    dts(),
    vueSetupExtend(),
    eslintPlugin({
      include: [ 'src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue' ]
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
      iconDirs: [ path.resolve(__dirname, 'src/svg') ],
      // 执行 icon name 的格式
      symbolId: 'icon-[name]'
    }),
    AutoImport({
      imports: [
        // 需要自动导入的插件，自定义导入的API
        'vue',
        'vue-router',
        'pinia'
      ],
      dts: true
    })
  ],
  build: {
    lib: {
      // src/indext.ts 是我们导出组件的地方
      entry: resolve(__dirname, 'src/components/global/index.ts'),
      name: 'MyVue3CommonComponents',
      // 运行构建时输出文件的名称
      fileName: 'index'
    },
    rollupOptions: {
      // 确保外部依赖项不应捆绑到你的库中
      external: [ 'vue', 'element-plus', '@element-plus/icons-vue', /element-plus/ ],
      input: 'src/components/global/index.ts',
      output: {
        // 提供全局变量以便在 UMD 构建中可以被外部依赖项使用
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 路径别名
    },
    extensions: [ '.js', '.json', '.ts' ]
  }
})
