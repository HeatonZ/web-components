# 依赖按需加载说明

## 📦 依赖处理机制

### 当前配置

在 `vite.config.ts` 中，我们配置了：

```typescript
rollupOptions: {
  external: ["vue"],
  // ...
}
```

这意味着 **Vue 被外部化**，不会打包到组件中。

## 🔍 依赖按需加载分析

### 1. Vue (已外部化)

✅ **Vue 是外部依赖**
- Vue 不会被打包到组件库中
- 用户必须自己安装 Vue
- 无论全量导入还是按需导入，Vue 都不会增加包体积

### 2. lodash (需要优化)

⚠️ **当前问题**: `lodash` 会被完整打包

```typescript
import { kebabCase } from "lodash"
```

**优化方案**:

#### 方案 A: 使用 lodash-es (推荐)
```bash
npm install lodash-es
npm install --save-dev @types/lodash-es
```

```typescript
// src/main.ts
import kebabCase from "lodash-es/kebabCase"
```

优势: 
- 支持 Tree-shaking
- 只打包使用的函数
- 包体积最小

#### 方案 B: 自己实现 kebabCase
```typescript
// src/utils/string.ts
export function kebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}
```

优势:
- 零依赖
- 包体积最小
- 完全可控

#### 方案 C: 外部化 lodash
```typescript
// vite.config.ts
rollupOptions: {
  external: ["vue", "lodash"],
}
```

优势:
- 由用户自己提供 lodash
- 组件库包体积小

劣势:
- 增加用户负担
- 需要用户安装 lodash

### 3. decimal.js (需要外部化)

⚠️ **当前问题**: `decimal.js` 会被打包到使用它的组件中

**当前行为**:
```javascript
// 如果 NumberUnit 组件使用了 decimal.js
import Decimal from 'decimal.js'

// 按需导入 NumberUnit 时，decimal.js 会被打包进去
import NumberUnitVue from 'web-components-zsf/number-unit'
```

**优化方案**: 外部化 decimal.js

```typescript
// vite.config.ts
rollupOptions: {
  external: ["vue", "decimal.js"],
}
```

```json
// package.json
{
  "peerDependencies": {
    "vue": "^3.5",
    "decimal.js": "^10.4.3"
  }
}
```

### 4. utils-zsf (需要外部化)

同 decimal.js，建议外部化。

## ✅ 推荐配置

### 完整优化方案

#### 1. 更新 vite.config.ts
```typescript
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import { fileURLToPath } from "url"
import { resolve } from "path"

export default defineConfig({
  define: {
    "process.env": {},
  },
  build: {
    lib: {
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
      // 外部化所有依赖
      external: [
        "vue",
        "lodash-es",
        "decimal.js",
        "utils-zsf",
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "lodash-es": "_",
          "decimal.js": "Decimal",
          "utils-zsf": "UtilsZsf",
        },
        assetFileNames: (assetInfo) => {
          return assetInfo.name || "assets/[name][extname]"
        },
        chunkFileNames: "chunks/[name]-[hash].js",
        entryFileNames: (chunkInfo) => {
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
```

#### 2. 更新 package.json
```json
{
  "dependencies": {
    "decimal.js": "^10.4.3",
    "lodash-es": "^4.17.21",
    "utils-zsf": "^0.0.4"
  },
  "peerDependencies": {
    "vue": "^3.5"
  },
  "devDependencies": {
    "@types/lodash-es": "^4.17.7",
    // ... 其他依赖
  }
}
```

#### 3. 更新 src/main.ts
```typescript
import { defineCustomElement } from "vue"
import kebabCase from "lodash-es/kebabCase"  // 改用 lodash-es
// ...
```

## 📊 包体积对比

### 优化前
```
全量导入: ~200KB (包含 lodash 等依赖)
按需导入单个组件: ~100KB (仍包含部分依赖)
```

### 优化后
```
全量导入: ~50KB (仅组件代码)
按需导入单个组件: ~10-20KB (仅该组件代码)

用户需要安装:
- vue: ~150KB
- decimal.js: ~30KB (仅在使用相关组件时需要)
- lodash-es: 按需加载，~1-5KB
```

## 🎯 最佳实践

### 1. 组件开发时
- 尽量减少外部依赖
- 如果必须使用，优先使用支持 Tree-shaking 的库
- 考虑自己实现简单的工具函数

### 2. 依赖分类
- **核心依赖** (如 vue): 放在 `peerDependencies`
- **可选依赖** (如某个组件特有的库): 放在 `peerDependencies` 或文档中说明
- **开发依赖**: 放在 `devDependencies`

### 3. 用户使用时
```json
// 用户的 package.json
{
  "dependencies": {
    "vue": "^3.5",
    "web-components-zsf": "^0.0.7",
    // 如果使用了需要 decimal.js 的组件
    "decimal.js": "^10.4.3"
  }
}
```

## 💡 总结

### 问题: 按需导入的话，依赖是不是也是按需导入的？

**答案**: 取决于配置

1. **外部化的依赖** (如 vue)
   - ✅ 完全由用户控制
   - ✅ 不影响组件包体积
   - ✅ 用户只需安装一次

2. **未外部化的依赖** (如当前的 lodash)
   - ⚠️ 会被打包到组件中
   - ⚠️ 即使按需导入，该组件的依赖仍会被包含
   - ⚠️ 建议优化（外部化或使用支持 Tree-shaking 的版本）

3. **支持 Tree-shaking 的依赖** (如 lodash-es)
   - ✅ 只打包使用的函数
   - ✅ 包体积最优
   - ✅ 推荐使用

### 建议
1. 将所有运行时依赖外部化，放在 `peerDependencies`
2. 使用 `lodash-es` 替代 `lodash`
3. 或者自己实现简单的工具函数，实现零依赖

