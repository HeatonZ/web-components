# 新增组件指南

本文档提供添加新组件到项目中的完整步骤。

## 📝 步骤一: 创建组件文件

在 `src/components/` 目录下创建新的 Vue 组件文件，文件名必须以 `.ce.vue` 结尾（表示 Custom Element）。

**命名规范**: 使用 PascalCase（大驼峰）命名，如 `MyButton.ce.vue`

```vue
<!-- src/components/MyButton.ce.vue -->
<template>
  <button class="my-button">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
// 组件逻辑
defineProps<{
  type?: 'primary' | 'default'
}>()
</script>

<style scoped>
.my-button {
  /* 样式 */
}
</style>
```

## 📝 步骤二: 在 main.ts 中注册组件

编辑 `src/main.ts` 文件，按照以下步骤操作:

### 2.1 导入组件
```typescript
import MyButtonVue from "Components/MyButton.ce.vue"
```

### 2.2 定义自定义元素
```typescript
const MyButton = defineCustomElement(MyButtonVue)
```

### 2.3 添加到组件集合
```typescript
const Components: Record<string, ReturnType<typeof defineCustomElement>> = {
  PreviewImage,
  NumberUnit,
  MyButton,  // ← 添加这行
}
```

### 2.4 导出组件
在 `export` 语句中添加:
```typescript
export { PreviewImage, NumberUnit, MyButton }  // ← 添加 MyButton
```

### 2.5 添加注册函数（推荐）
```typescript
export function registerMyButton() {
  customElements.get('my-button') || customElements.define('my-button', MyButton)
}
```

**完整示例**:
```typescript
import { defineCustomElement } from "vue"
import { kebabCase } from "lodash"
import PreviewImageVue from "Components/PreviewImage.ce.vue"
import NumberUnitVue from "Components/NumberUnit.ce.vue"
import MyButtonVue from "Components/MyButton.ce.vue"  // ← 1. 导入

const PreviewImage = defineCustomElement(PreviewImageVue)
const NumberUnit = defineCustomElement(NumberUnitVue)
const MyButton = defineCustomElement(MyButtonVue)  // ← 2. 定义

const Components: Record<string, ReturnType<typeof defineCustomElement>> = {
  PreviewImage,
  NumberUnit,
  MyButton,  // ← 3. 添加到集合
}

// 导出所有组件
export { PreviewImage, NumberUnit, MyButton }  // ← 4. 导出

export default Components

export function register(key?: string, component?: CustomElementConstructor) {
  if (key && component) {
    customElements.get(key) || customElements.define(key, component)
  } else {
    Object.keys(Components).forEach((key) => {
      customElements.get(kebabCase(key)) || customElements.define(kebabCase(key), Components[key])
    })
  }
}

// 按需注册函数
export function registerPreviewImage() {
  customElements.get('preview-image') || customElements.define('preview-image', PreviewImage)
}

export function registerNumberUnit() {
  customElements.get('number-unit') || customElements.define('number-unit', NumberUnit)
}

export function registerMyButton() {  // ← 5. 添加注册函数
  customElements.get('my-button') || customElements.define('my-button', MyButton)
}
```

## 📝 步骤三: 配置 Vite 构建

编辑 `vite.config.ts`，在 `build.lib.entry` 对象中添加新组件入口:

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/main.ts"),
        "preview-image": resolve(__dirname, "src/components/PreviewImage.ce.vue"),
        "number-unit": resolve(__dirname, "src/components/NumberUnit.ce.vue"),
        "my-button": resolve(__dirname, "src/components/MyButton.ce.vue"),  // ← 添加这行
      },
      formats: ["es", "cjs"],
      name: "WebComponentsZsf",
    },
    // ...
  }
})
```

**注意**: 入口名称使用 kebab-case（短横线分隔），与 HTML 标签名保持一致。

## 📝 步骤四: 更新 package.json

编辑 `package.json`，在 `exports` 字段中添加新组件的导出配置:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/es/index.js",
      "require": "./dist/cjs/index.js"
    },
    "./preview-image": {
      "types": "./dist/preview-image.d.ts",
      "import": "./dist/es/preview-image.js",
      "require": "./dist/cjs/preview-image.js"
    },
    "./number-unit": {
      "types": "./dist/number-unit.d.ts",
      "import": "./dist/es/number-unit.js",
      "require": "./dist/cjs/number-unit.js"
    },
    "./my-button": {
      "types": "./dist/my-button.d.ts",
      "import": "./dist/es/my-button.js",
      "require": "./dist/cjs/my-button.js"
    }
  }
}
```

## 📝 步骤五: 构建和测试

运行构建命令:
```bash
npm run build
```

检查 `dist/` 目录，确保生成了以下文件:
- `dist/es/my-button.js` - ES Module 格式
- `dist/cjs/my-button.js` - CommonJS 格式
- `dist/my-button.d.ts` - TypeScript 类型定义

## 📝 步骤六: 更新版本号

编辑 `package.json`，更新版本号:
```json
{
  "version": "0.0.8"  // 增加版本号
}
```

## ✅ 检查清单

添加新组件前，请确保完成以下所有步骤:

- [ ] 在 `src/components/` 创建 `.ce.vue` 组件文件
- [ ] 在 `src/main.ts` 中导入组件
- [ ] 在 `src/main.ts` 中定义 Custom Element
- [ ] 在 `src/main.ts` 的 Components 对象中添加组件
- [ ] 在 `src/main.ts` 中导出组件
- [ ] 在 `src/main.ts` 中添加组件注册函数
- [ ] 在 `vite.config.ts` 的 entry 中添加组件入口
- [ ] 在 `package.json` 的 exports 中添加导出配置
- [ ] 运行 `npm run build` 确保构建成功
- [ ] 更新 `package.json` 版本号

## 💡 使用示例

新组件添加完成后，用户可以通过以下方式使用:

### 全量导入
```javascript
import { register } from 'web-components-zsf'
register()
```
```html
<my-button type="primary">点击我</my-button>
```

### 按需导入
```javascript
import { registerMyButton } from 'web-components-zsf'
registerMyButton()
```
```html
<my-button type="primary">点击我</my-button>
```

### 子路径导入
```javascript
import MyButtonVue from 'web-components-zsf/my-button'
import { defineCustomElement } from 'vue'

const MyButton = defineCustomElement(MyButtonVue)
customElements.define('my-button', MyButton)
```
```html
<my-button type="primary">点击我</my-button>
```

## 🎯 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件文件名 | PascalCase.ce.vue | `MyButton.ce.vue` |
| 组件变量名 | PascalCase | `MyButton` |
| 自定义元素标签名 | kebab-case | `my-button` |
| Vite 入口名 | kebab-case | `"my-button"` |
| package.json 导出路径 | kebab-case | `"./my-button"` |
| 注册函数名 | camelCase (register前缀) | `registerMyButton` |

## ⚠️ 注意事项

1. **文件命名**: 组件文件必须以 `.ce.vue` 结尾，这表示该组件用于创建 Custom Element
2. **标签名转换**: 组件名会自动转换为 kebab-case 格式作为 HTML 标签名（如 MyButton → my-button）
3. **避免重复注册**: 注册函数会自动检查组件是否已注册，避免重复注册
4. **Vue 外部化**: Vue 被配置为外部依赖，不会打包到组件中，用户需要自行安装 Vue
5. **TypeScript 类型**: 使用 TypeScript 编写组件时，类型定义会自动生成

## 🔄 自动化脚本（可选）

为了简化新增组件的流程，你可以创建一个脚本来自动化这些步骤。

<details>
<summary>查看自动化脚本示例</summary>

```bash
# scripts/add-component.sh
#!/bin/bash

COMPONENT_NAME=$1
KEBAB_NAME=$(echo $COMPONENT_NAME | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')

echo "添加组件: $COMPONENT_NAME (标签名: $KEBAB_NAME)"

# 创建组件文件
cat > "src/components/${COMPONENT_NAME}.ce.vue" << EOF
<template>
  <div class="${KEBAB_NAME}">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// TODO: 添加组件逻辑
</script>

<style scoped>
.${KEBAB_NAME} {
  /* TODO: 添加样式 */
}
</style>
EOF

echo "✅ 组件文件已创建: src/components/${COMPONENT_NAME}.ce.vue"
echo "⚠️  请手动完成以下步骤:"
echo "   1. 编辑 src/main.ts 添加组件导入和导出"
echo "   2. 编辑 vite.config.ts 添加构建入口"
echo "   3. 编辑 package.json 添加 exports 配置"
```

使用方式:
```bash
chmod +x scripts/add-component.sh
./scripts/add-component.sh MyButton
```

</details>

## 📚 相关文档

- [使用指南](./USAGE.md) - 组件库使用方法
- [README](./README.md) - 项目概述

