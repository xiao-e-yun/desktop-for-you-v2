import { defineConfig, Plugin } from 'vite'
import { plugin as picm } from "vite-plugin-vue-pug-with-css-modules";
import { viteSingleFile } from "vite-plugin-singlefile"
import { createHtmlPlugin } from 'vite-plugin-html'
import vue from '@vitejs/plugin-vue'
import fs from "fs"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const dev = mode === 'development'
  console.log(`dev: ${dev}`)

  const plugins = [picm(),vue()]

  plugins.push(createHtmlPlugin({minify: !dev}) as unknown as Plugin)
  
  if(dev){
    fs.writeFileSync('./dist/index.html', `<html><head><script>location.href="http://localhost:8800/"</script></head></html>`)
  }else{
    plugins.push(viteSingleFile())
  }

  const build_single_file = dev?{
    base: 'http://localhost:8800/',
    build:{
      minify: false,
      sourcemap: true,
    }
  }:{
    build:{
      minify: true,
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
    ...build_single_file,
    
  }
})