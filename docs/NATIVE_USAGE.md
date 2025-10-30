# 原生 HTML 使用指南

本文档说明如何在原生 HTML 中使用 Web Components，无需任何构建工具或框架。

## ✨ 特性

- ✅ **零依赖**: 所有依赖（包括 Vue）都已打包，开箱即用
- ✅ **原生支持**: 无需 npm、webpack、vite 等构建工具
- ✅ **CDN 友好**: 支持通过 unpkg、jsdelivr 等 CDN 引入
- ✅ **轻量级**: Gzip 压缩后约 120-180KB
- ✅ **现代浏览器**: 支持所有支持 Web Components 的浏览器

## 🚀 快速开始

### 方式一: 直接引入 IIFE 文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Web Components 测试</title>
</head>
<body>
  <!-- 1. 使用组件 -->
  <preview-image src="./images/sample-image.svg"></preview-image>
  <number-unit value="1000" unit=""></number-unit>

  <!-- 2. 引入脚本（本地文件） -->
  <script src="node_modules/web-components-zsf/dist/iife/index.js"></script>
  
  <!-- 3. 注册组件 -->
  <script>
    WebComponentsZsf.register()
  </script>
</body>
</html>
```

### 方式二: 使用 CDN (推荐)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Web Components 测试</title>
</head>
<body>
  <!-- 1. 使用组件 -->
  <preview-image src="./images/sample-image.svg"></preview-image>
  <number-unit value="1000" unit=""></number-unit>

  <!-- 2. 从 CDN 引入（自动加载最新版本） -->
  <script src="https://unpkg.com/web-components-zsf"></script>
  
  <!-- 3. 注册组件 -->
  <script>
    WebComponentsZsf.register()
  </script>
</body>
</html>
```

**其他 CDN**:
```html
<!-- jsdelivr -->
<script src="https://cdn.jsdelivr.net/npm/web-components-zsf"></script>

<!-- 指定版本 -->
<script src="https://unpkg.com/web-components-zsf@0.0.7"></script>
<script src="https://cdn.jsdelivr.net/npm/web-components-zsf@0.0.7"></script>
```

### 方式三: ES Module (现代浏览器)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Web Components 测试</title>
</head>
<body>
  <preview-image src="https://dummyimage.com/600x400/000/fff"></preview-image>

  <script type="module">
    // 从 CDN 导入
    import { register } from 'https://unpkg.com/web-components-zsf/dist/es/index.js'
    register()
  </script>
</body>
</html>
```

## 📚 API 使用

### 全局对象: WebComponentsZsf

当使用 IIFE 格式引入时，会创建一个全局对象 `WebComponentsZsf`。

**可用属性和方法**:

```javascript
// 组件
WebComponentsZsf.PreviewImage     // PreviewImage 组件构造函数
WebComponentsZsf.NumberUnit       // NumberUnit 组件构造函数

// 注册函数
WebComponentsZsf.register()                    // 注册所有组件
WebComponentsZsf.register(name, component)     // 注册单个组件
WebComponentsZsf.registerPreviewImage()        // 注册 PreviewImage
WebComponentsZsf.registerNumberUnit()          // 注册 NumberUnit

// 默认导出
WebComponentsZsf.default  // 所有组件的集合对象
```

### 注册所有组件

```javascript
WebComponentsZsf.register()
```

注册后可以使用：
- `<preview-image>`
- `<number-unit>`

### 注册单个组件

```javascript
// 方式 1: 使用便捷函数
WebComponentsZsf.registerPreviewImage()

// 方式 2: 手动注册
WebComponentsZsf.register('preview-image', WebComponentsZsf.PreviewImage)

// 方式 3: 使用自定义标签名
customElements.define('my-image', WebComponentsZsf.PreviewImage)
```

## 🎨 组件使用示例

### PreviewImage - 图片预览

```html
<!-- 基本使用 -->
<preview-image src="image.jpg"></preview-image>

<!-- 带请求配置 -->
<preview-image 
  src="https://api.example.com/image" 
  :requestInit='{"headers": {"Authorization": "Bearer token"}}'
></preview-image>
```

**属性**:
- `src` (string): 图片 URL，必填
- `requestInit` (object): fetch 请求配置，可选

**说明**:
- 会先发送 HEAD 请求验证图片可访问性
- 只有验证通过后才显示图片
- 支持所有标准 img 属性（通过 `v-bind="$attrs"`）

### NumberUnit - 数字单位格式化

```html
<!-- 基本使用 -->
<number-unit value="1000" unit=""></number-unit>
<!-- 显示: 1K -->

<number-unit value="1000000" unit=""></number-unit>
<!-- 显示: 1M -->

<!-- 指定单位 -->
<number-unit value="1024" unit="KB"></number-unit>
<!-- 显示: 1024 KB -->
```

**属性**:
- `value` (string): 数值，必填
- `unit` (string): 单位，可选
- `preset` (object): 预设配置，可选

## 🌐 浏览器兼容性

### 支持的浏览器

组件基于 Web Components 标准，需要以下浏览器版本：

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 67+ |
| Firefox | 63+ |
| Safari | 13.1+ |
| Edge | 79+ |
| Opera | 54+ |

### 旧版浏览器支持

如需支持旧版浏览器，需要引入 polyfill：

```html
<!-- 加载 Web Components polyfill -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2/webcomponents-loader.js"></script>

<!-- 等待 polyfill 加载完成 -->
<script>
  window.addEventListener('WebComponentsReady', function() {
    // 加载组件库
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/web-components-zsf'
    script.onload = function() {
      WebComponentsZsf.register()
    }
    document.head.appendChild(script)
  })
</script>
```

## 📦 包体积

### IIFE 格式 (dist/iife/index.js)

- **原始大小**: ~400-600KB (包含 Vue runtime + 所有依赖)
- **Gzip 压缩**: ~120-180KB
- **Brotli 压缩**: ~100-150KB

### 单个组件

如果只需要单个组件，可以只引入该组件：

```html
<!-- 只引入 PreviewImage -->
<script src="https://unpkg.com/web-components-zsf/dist/iife/preview-image.js"></script>
<script>
  // 组件会自动注册
  // 或者手动注册
  customElements.define('preview-image', PreviewImageComponent)
</script>
```

**单组件大小**:
- PreviewImage: ~150-200KB (包含 Vue)
- NumberUnit: ~400-500KB (包含 Vue + utils-zsf + decimal.js)

## 🔧 高级用法

### 动态加载组件

```html
<script>
  // 当需要时才加载组件
  async function loadComponents() {
    // 动态加载脚本
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/web-components-zsf'
    
    // 等待加载完成
    await new Promise((resolve) => {
      script.onload = resolve
      document.head.appendChild(script)
    })
    
    // 注册组件
    WebComponentsZsf.register()
    
    console.log('组件加载完成')
  }

  // 用户点击按钮时才加载
  document.getElementById('loadBtn').addEventListener('click', loadComponents)
</script>
```

### 条件注册

```html
<script>
  // 根据页面需求注册不同组件
  const path = window.location.pathname
  
  if (path.includes('/gallery')) {
    // 图片相关页面只注册 PreviewImage
    WebComponentsZsf.registerPreviewImage()
  } else if (path.includes('/dashboard')) {
    // 数据相关页面只注册 NumberUnit
    WebComponentsZsf.registerNumberUnit()
  } else {
    // 其他页面注册所有组件
    WebComponentsZsf.register()
  }
</script>
```

### 自定义标签名

```html
<script>
  // 使用自己喜欢的标签名
  customElements.define('my-img', WebComponentsZsf.PreviewImage)
  customElements.define('num-unit', WebComponentsZsf.NumberUnit)
</script>

<!-- 使用自定义标签 -->
<my-img src="image.jpg"></my-img>
<num-unit value="1000"></num-unit>
```

### 监听组件事件

```html
<preview-image id="myImage" src="image.jpg"></preview-image>

<script>
  const img = document.getElementById('myImage')
  
  // 监听加载事件（如果组件支持）
  img.addEventListener('load', () => {
    console.log('图片加载成功')
  })
</script>
```

## 🐛 故障排除

### 问题 1: 组件未显示

**检查**:
1. 打开浏览器控制台查看错误
2. 确认脚本已加载: `console.log(typeof WebComponentsZsf)`
3. 确认组件已注册: `console.log(customElements.get('preview-image'))`
4. 检查浏览器是否支持 Web Components

**解决**:
```html
<script>
  // 检查环境
  console.log('WebComponentsZsf:', typeof WebComponentsZsf)
  
  if (typeof WebComponentsZsf !== 'undefined') {
    WebComponentsZsf.register()
    console.log('组件已注册')
  } else {
    console.error('WebComponentsZsf 未加载，请检查脚本引入')
  }
  
  // 检查组件是否注册
  setTimeout(() => {
    const defined = customElements.get('preview-image')
    console.log('preview-image 是否已定义:', !!defined)
  }, 100)
</script>
```

### 问题 2: CDN 加载失败

**原因**: 网络问题或 CDN 不可用

**解决**: 使用多个 CDN 备选

```html
<script>
  const cdns = [
    'https://unpkg.com/web-components-zsf',
    'https://cdn.jsdelivr.net/npm/web-components-zsf',
    '/local/path/to/dist/iife/index.js'  // 本地备份
  ]
  
  async function loadFromCDN(urls) {
    for (const url of urls) {
      try {
        const script = document.createElement('script')
        script.src = url
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
        
        console.log('从', url, '加载成功')
        return
      } catch (error) {
        console.warn('从', url, '加载失败，尝试下一个')
      }
    }
    
    console.error('所有 CDN 都加载失败')
  }
  
  loadFromCDN(cdns).then(() => {
    WebComponentsZsf.register()
  })
</script>
```

### 问题 3: ES Module CORS 错误

**错误**: `Access to script at 'file://...' has been blocked by CORS policy`

**原因**: 浏览器不允许通过 `file://` 协议加载 ES Module

**解决**: 必须使用 HTTP 服务器

```bash
# 使用 Python
python3 -m http.server 8080

# 使用 Node.js
npx http-server -p 8080

# 然后访问
http://localhost:8080/your-page.html
```

### 问题 4: 版本不匹配

**解决**: 指定具体版本

```html
<!-- ❌ 可能获取到缓存的旧版本 -->
<script src="https://unpkg.com/web-components-zsf"></script>

<!-- ✅ 指定具体版本 -->
<script src="https://unpkg.com/web-components-zsf@0.0.7"></script>

<!-- ✅ 或添加时间戳避免缓存 -->
<script src="https://unpkg.com/web-components-zsf?t=20241030"></script>
```

## 📝 完整示例

### 示例 1: 图片画廊

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>图片画廊</title>
  <style>
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    
    preview-image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>图片画廊</h1>
  
  <div class="gallery" id="gallery"></div>

  <script src="https://unpkg.com/web-components-zsf"></script>
  <script>
    // 注册组件
    WebComponentsZsf.registerPreviewImage()
    
    // 动态生成图片
    const gallery = document.getElementById('gallery')
    for (let i = 1; i <= 12; i++) {
      const img = document.createElement('preview-image')
      img.setAttribute('src', `https://via.placeholder.com/200/0099ff/ffffff?text=Image+${i}`)
      gallery.appendChild(img)
    }
  </script>
</body>
</html>
```

### 示例 2: 数据仪表板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>数据仪表板</title>
  <style>
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .card h3 {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }
    
    .card number-unit {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>数据仪表板</h1>
  
  <div class="dashboard">
    <div class="card">
      <h3>总用户数</h3>
      <number-unit value="1234567" unit=""></number-unit>
    </div>
    
    <div class="card">
      <h3>今日访问</h3>
      <number-unit value="98765" unit=""></number-unit>
    </div>
    
    <div class="card">
      <h3>活跃用户</h3>
      <number-unit value="54321" unit=""></number-unit>
    </div>
    
    <div class="card">
      <h3>存储空间</h3>
      <number-unit value="1048576" unit="KB"></number-unit>
    </div>
  </div>

  <script src="https://unpkg.com/web-components-zsf"></script>
  <script>
    WebComponentsZsf.registerNumberUnit()
    
    // 模拟数据更新
    setInterval(() => {
      const units = document.querySelectorAll('number-unit')
      units.forEach(unit => {
        const currentValue = parseInt(unit.getAttribute('value'))
        const newValue = currentValue + Math.floor(Math.random() * 100)
        unit.setAttribute('value', newValue.toString())
      })
    }, 5000)
  </script>
</body>
</html>
```

## 📚 相关文档

- [README](../README.md) - 项目概述
- [使用指南](./USAGE.md) - 在构建工具中使用
- [Tree-shaking 优化](./TREE_SHAKING.md) - 优化指南
- [测试文档](../test/README.md) - 本地测试说明

## 🎉 总结

使用本组件库在原生 HTML 中非常简单：

1. ✅ 引入一个 script 标签
2. ✅ 调用 `WebComponentsZsf.register()`
3. ✅ 在 HTML 中使用组件

无需任何构建工具、无需安装 npm 包、无需学习框架，开箱即用！

