# web-components

基于 Vue 3 的 Web Components 组件库，支持按需加载。

## 📦 安装

```bash
npm install web-components-zsf
```

## 🚀 快速开始

### 方式一: 原生 HTML (无需构建工具) ⭐

```html
<!DOCTYPE html>
<html>
<body>
  <!-- 使用组件 -->
  <preview-image src="..."></preview-image>
  <number-unit value="100"></number-unit>

  <!-- 从 CDN 引入 -->
  <script src="https://unpkg.com/web-components-zsf"></script>
  <script>
    WebComponentsZsf.register()
  </script>
</body>
</html>
```

### 方式二: 在构建项目中使用

```javascript
import { register } from 'web-components-zsf'

// 注册所有组件
register()
```

```html
<preview-image src="..."></preview-image>
<number-unit value="100"></number-unit>
```

## 📚 文档

- [使用指南](./docs/USAGE.md) - 在框架中使用（Vue、React 等）
- [原生 HTML 使用](./docs/NATIVE_USAGE.md) - 无需构建工具，直接使用
- [新增组件指南](./docs/ADD_COMPONENT.md) - 添加新组件的步骤
- [依赖说明](./docs/DEPENDENCY.md) - 依赖管理和优化

## ✨ 特性

- ✅ **原生 HTML 可用** - 无需 npm、webpack 等构建工具 🌟
- ✅ **零外部依赖** - Vue 已内置打包，开箱即用
- ✅ **CDN 友好** - 支持 unpkg、jsdelivr 直接引入
- ✅ 基于 Vue 3 + Web Components 标准开发
- ✅ 支持按需加载，优化包体积
- ✅ 完整的 TypeScript 类型支持
- ✅ **完美支持 Tree-shaking，依赖也能按需加载**
- ✅ 使用 lodash-es，零冗余打包
- ✅ 支持 ES Module、CommonJS 和 IIFE 格式
- ✅ `sideEffects: false` 配置，构建工具友好

## 🧪 测试

### 单元测试

```bash
# 运行单元测试
npm test

# UI 界面模式
npm run test:ui

# 生成覆盖率报告
npm run test:coverage
```

### 原生 HTML 测试

```bash
# 在浏览器中测试
npm run test:native
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 代码检查和构建
npm run build

# 添加新组件
npm run add

# 移除组件
npm run remove
```

## 📦 组件列表

- `preview-image` - 图片预览组件
- `number-unit` - 数字单位格式化组件

## 🤝 贡献

欢迎贡献新组件！

**方式一**: 使用自动化脚本 (推荐)
```bash
npm run add MyButton
```

**方式二**: 手动添加，请参考 [新增组件指南](./docs/ADD_COMPONENT.md)。

<public-pack> 