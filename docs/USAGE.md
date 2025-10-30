# 使用指南

## 📦 安装

```bash
npm install web-components-zsf
```

## 🚀 使用方式

### 方式一: 全量导入 (适合使用所有组件的场景)

```javascript
import { register } from 'web-components-zsf'

// 注册所有组件
register()
```

```html
<!-- 使用组件 -->
<preview-image src="..."></preview-image>
<number-unit value="100"></number-unit>
```

### 方式二: 按需导入 - 使用注册函数 (推荐 ⭐)

```javascript
import { registerPreviewImage, registerNumberUnit } from 'web-components-zsf'

// 只注册需要的组件
registerPreviewImage()
registerNumberUnit()
```

```html
<preview-image src="..."></preview-image>
<number-unit value="100"></number-unit>
```

### 方式三: 按需导入 - 手动注册

```javascript
import { PreviewImage, NumberUnit, register } from 'web-components-zsf'

// 手动注册单个组件
register('preview-image', PreviewImage)
register('number-unit', NumberUnit)
```

### 方式四: 直接从子路径导入 (最小包体积 🎯)

```javascript
// 只导入 PreviewImage 组件,不会引入其他组件代码
import PreviewImageVue from 'web-components-zsf/preview-image'
import { defineCustomElement } from 'vue'

const PreviewImage = defineCustomElement(PreviewImageVue)
customElements.define('preview-image', PreviewImage)
```

```html
<preview-image src="..."></preview-image>
```

## 📊 包体积对比

| 导入方式 | 包体积 | 说明 |
|---------|--------|------|
| 全量导入 | 所有组件代码 | 适合使用多个组件 |
| 按需导入(方式二、三) | 只打包导入的组件 | Tree-shaking 会移除未使用的组件 |
| 子路径导入(方式四) | 最小 | 直接引入单个组件文件 |

## 🔧 框架集成示例

### Vue 3 项目

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { register } from 'web-components-zsf'

// 注册所有 Web Components
register()

createApp(App).mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <div>
    <preview-image :src="imageUrl"></preview-image>
    <number-unit :value="1000"></number-unit>
  </div>
</template>

<script setup>
const imageUrl = 'https://example.com/image.jpg'
</script>
```

### React 项目

```jsx
// App.jsx
import { useEffect } from 'react'
import { register } from 'web-components-zsf'

function App() {
  useEffect(() => {
    // 注册所有 Web Components
    register()
  }, [])

  return (
    <div>
      <preview-image src="https://example.com/image.jpg"></preview-image>
      <number-unit value={1000}></number-unit>
    </div>
  )
}

export default App
```

### 原生 HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { register } from 'https://unpkg.com/web-components-zsf'
    register()
  </script>
</head>
<body>
  <preview-image src="https://example.com/image.jpg"></preview-image>
  <number-unit value="1000"></number-unit>
</body>
</html>
```

## 📝 组件文档

### preview-image

图片预览组件

**属性**:
- `src` - 图片地址

**使用示例**:
```html
<preview-image src="https://example.com/image.jpg"></preview-image>
```

### number-unit

数字单位格式化组件

**属性**:
- `value` - 数字值

**使用示例**:
```html
<number-unit value="1000"></number-unit>
<!-- 显示: 1K -->

<number-unit value="1000000"></number-unit>
<!-- 显示: 1M -->
```

## 🌐 TypeScript 支持

本组件库提供完整的 TypeScript 类型定义。

```typescript
import { 
  PreviewImage, 
  NumberUnit, 
  register,
  registerPreviewImage,
  registerNumberUnit 
} from 'web-components-zsf'

// 所有导出都有完整的类型定义
register() // ✅ 类型安全
registerPreviewImage() // ✅ 类型安全
```

## ⚠️ 注意事项

### 1. 组件命名

- 组件在 JavaScript 中使用 **PascalCase** (如: `PreviewImage`)
- 在 HTML 中使用 **kebab-case** (如: `preview-image`)
- 注册函数使用 **camelCase** (如: `registerPreviewImage`)

### 2. 避免重复注册

组件代码会自动检查避免重复注册，多次调用 `register()` 或注册函数不会报错。

```javascript
// 这样是安全的
register()
register() // 不会重复注册
registerPreviewImage() // 不会重复注册 (已经通过 register() 注册过)
```

### 3. Vue 依赖

本组件库依赖 Vue 3，请确保你的项目中已安装 Vue:

```bash
npm install vue@^3.5
```

### 4. 浏览器兼容性

组件基于 Web Components 标准，需要现代浏览器支持:
- Chrome 67+
- Firefox 63+
- Safari 13.1+
- Edge 79+

如需支持旧版浏览器，请使用 polyfill:
```bash
npm install @webcomponents/webcomponentsjs
```

```html
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
```

## 🔄 按需加载最佳实践

### 场景一: 只使用 1-2 个组件

**推荐**: 使用子路径导入 (方式四)

```javascript
import PreviewImageVue from 'web-components-zsf/preview-image'
import { defineCustomElement } from 'vue'

const PreviewImage = defineCustomElement(PreviewImageVue)
customElements.define('preview-image', PreviewImage)
```

**优势**: 包体积最小，只加载需要的组件

### 场景二: 使用 3-5 个组件

**推荐**: 使用按需注册函数 (方式二)

```javascript
import { 
  registerPreviewImage, 
  registerNumberUnit,
  registerButton 
} from 'web-components-zsf'

registerPreviewImage()
registerNumberUnit()
registerButton()
```

**优势**: 代码简洁，Tree-shaking 自动优化

### 场景三: 使用大部分组件

**推荐**: 全量导入 (方式一)

```javascript
import { register } from 'web-components-zsf'
register()
```

**优势**: 代码最简单，一次性注册所有组件

## 💡 高级用法

### 条件注册

根据路由或条件动态注册组件:

```javascript
import { registerPreviewImage, registerNumberUnit } from 'web-components-zsf'

// 根据路由注册组件
if (route.path === '/gallery') {
  registerPreviewImage()
}

if (route.path === '/dashboard') {
  registerNumberUnit()
}
```

### 懒加载

结合动态导入实现懒加载:

```javascript
// 当需要时才加载组件
async function loadPreviewImage() {
  const { registerPreviewImage } = await import('web-components-zsf')
  registerPreviewImage()
}

// 用户点击按钮时才加载
button.addEventListener('click', async () => {
  await loadPreviewImage()
  // 现在可以使用 <preview-image> 了
})
```

### 自定义标签名

```javascript
import { PreviewImage } from 'web-components-zsf'

// 使用自定义标签名注册
customElements.define('my-custom-image', PreviewImage)
```

```html
<my-custom-image src="..."></my-custom-image>
```

## 🐛 故障排除

### 问题 1: 组件不显示

**原因**: 组件未注册

**解决方案**:
```javascript
// 确保在使用前注册组件
import { register } from 'web-components-zsf'
register()
```

### 问题 2: TypeScript 类型错误

**原因**: 类型定义未正确加载

**解决方案**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "types": ["web-components-zsf"]
  }
}
```

### 问题 3: 打包后体积过大

**原因**: 使用了全量导入

**解决方案**: 改用按需导入或子路径导入

```javascript
// ❌ 全量导入
import { register } from 'web-components-zsf'
register()

// ✅ 按需导入
import { registerPreviewImage } from 'web-components-zsf'
registerPreviewImage()

// ✅ 子路径导入 (包体积最小)
import PreviewImageVue from 'web-components-zsf/preview-image'
```

### 问题 4: Vue 版本冲突

**原因**: 项目中 Vue 版本与组件库要求不匹配

**解决方案**:
```bash
# 确保安装 Vue 3.5+
npm install vue@^3.5
```

## 📚 相关文档

- [README](../README.md) - 项目概述
- [新增组件指南](./ADD_COMPONENT.md) - 开发者添加新组件的完整步骤
- [依赖说明](./DEPENDENCY.md) - 依赖按需加载机制
- [脚本使用指南](../scripts/README.md) - 自动化脚本使用说明

