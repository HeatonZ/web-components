import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import { fileURLToPath } from "url"

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
  },
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es", "cjs", "umd"],
      fileName: "index",
      name: "LIB",
    },
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: "tsconfig.app.json",
      include: ["./src/**"],
    }),
  ],
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
})
