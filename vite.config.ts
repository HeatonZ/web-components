import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import { fileURLToPath } from "url"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isIIFE = mode === 'iife'
  
  return {
    define: {
      "process.env": {},
    },
    build: {
      emptyOutDir: !isIIFE, // 只在第一次构建时清空输出目录
      lib: isIIFE ? {
        // IIFE 模式：只构建主入口
        entry: resolve(__dirname, "src/main.ts"),
        formats: ["iife"],
        name: "WebComponentsZsf",
        fileName: () => "iife/index.js",
      } : {
        // 默认模式：构建所有入口，输出 ES 和 CJS 格式
        entry: {
          index: resolve(__dirname, "src/main.ts"),
          "preview-image": resolve(__dirname, "src/components/PreviewImage.ce.vue"),
          "number-unit": resolve(__dirname, "src/components/NumberUnit.ce.vue"),
        },
        formats: ["es", "cjs"],
        name: "WebComponentsZsf",
      },
      target: ["es2015"],
      rollupOptions: {
        // 不外部化任何依赖，全部打包以支持原生使用
        external: [],
        output: {
          exports: "named",
          assetFileNames: (assetInfo) => {
            return assetInfo.name || "assets/[name][extname]"
          },
          chunkFileNames: "chunks/[name]-[hash].js",
          entryFileNames: (chunkInfo) => {
            if (isIIFE) {
              return "iife/index.js"
            }
            if (chunkInfo.name === "index") {
              return "[format]/[name].js"
            }
            return "[format]/[name].js"
          },
        },
      },
    },
    plugins: [
      vue({
        customElement: true,
      }),
      !isIIFE && dts({
        insertTypesEntry: true,
        rollupTypes: true,
        tsconfigPath: "tsconfig.app.json",
        include: ["./src/**"],
      }),
    ].filter(Boolean),
    resolve: {
      alias: [
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
        {
          find: "Utils",
          replacement: fileURLToPath(new URL("./src/utils", import.meta.url)),
        },
        {
          find: "Components",
          replacement: fileURLToPath(
            new URL("./src/components", import.meta.url)
          ),
        },
        {
          find: "Types",
          replacement: fileURLToPath(new URL("./src/types", import.meta.url)),
        },
      ],
    },
  }
})
