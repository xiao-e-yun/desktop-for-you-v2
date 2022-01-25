import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"
import { minifyHtml } from 'vite-plugin-html'
import { exec } from 'child_process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const dev = mode === 'development'
  console.log(`dev: ${dev}`)

  const plugins = [
    vue(),
  ]
  if(dev){
    exec("http-server ./dist -p 8800",(e)=>console.error("need http-server\nuse npm i -g http-server"))
  }else{
    plugins.push(viteSingleFile())
    plugins.push(minifyHtml())
  }

  const build_single_file = dev?{
    base: 'http://localhost:8800/',
    build:{
      sourcemap: true,
    }
  }:{
    build:{
      assetsInlineLimit: Infinity,
      chunkSizeWarningLimit: Infinity,
      cssCodeSplit: false,
      brotliSize: false,
      rollupOptions: {
        inlineDynamicImports: true,
        output: {
          manualChunks: () => "",
        },
      },
    }
  }

  return {
    css: {
      preprocessorOptions: {
        scss: { additionalData: `@import "@/page.scss";` },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
        '@a': '/src/assets',
        '@c': '/src/components',
        '@p': '/src/panels',
        '@f': '/src/fx',
      }
    },
    plugins,
    build: {
      minify: !dev,
      target: "esnext",
    },
    ...build_single_file,
  }
})