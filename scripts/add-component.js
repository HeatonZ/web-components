#!/usr/bin/env node

/**
 * 自动化添加新组件脚本
 * 用法: node scripts/add-component.js MyButton
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// 获取命令行参数
const componentName = process.argv[2]

if (!componentName) {
  console.error('❌ 错误: 请提供组件名称')
  console.log('用法: node scripts/add-component.js MyButton')
  process.exit(1)
}

// 验证组件名格式 (必须是 PascalCase)
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ 错误: 组件名必须是 PascalCase 格式 (如: MyButton, UserCard)')
  process.exit(1)
}

// 转换为 kebab-case
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

const kebabName = toKebabCase(componentName)
const componentFileName = `${componentName}.ce.vue`
const componentFilePath = path.join(rootDir, 'src/components', componentFileName)

console.log('\n🚀 开始添加新组件...\n')
console.log(`组件名称: ${componentName}`)
console.log(`标签名称: ${kebabName}`)
console.log(`文件路径: src/components/${componentFileName}\n`)

// 步骤 1: 创建组件文件
console.log('📝 步骤 1/4: 创建组件文件...')
if (fs.existsSync(componentFilePath)) {
  console.error(`❌ 错误: 组件文件已存在: ${componentFilePath}`)
  process.exit(1)
}

const componentTemplate = `<template>
  <div class="${kebabName}">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// TODO: 添加组件的 props 定义
// defineProps<{
//   prop1?: string
// }>()

// TODO: 添加组件逻辑
</script>

<style scoped>
.${kebabName} {
  /* TODO: 添加样式 */
}
</style>
`

fs.writeFileSync(componentFilePath, componentTemplate, 'utf-8')
console.log(`✅ 已创建: src/components/${componentFileName}`)

// 步骤 2: 更新 main.ts
console.log('\n📝 步骤 2/4: 更新 main.ts...')
const mainTsPath = path.join(rootDir, 'src/main.ts')
let mainTsContent = fs.readFileSync(mainTsPath, 'utf-8')

// 添加 import (在 lodash-es 之后)
const importStatement = `import ${componentName}Vue from "Components/${componentName}.ce.vue"`
const lodashImportIndex = mainTsContent.indexOf('from "lodash-es"')
if (lodashImportIndex !== -1) {
  const lodashLineEnd = mainTsContent.indexOf('\n', lodashImportIndex)
  mainTsContent = mainTsContent.slice(0, lodashLineEnd + 1) + 
    importStatement + '\n' + 
    mainTsContent.slice(lodashLineEnd + 1)
} else {
  const lastImportIndex = mainTsContent.lastIndexOf('import ')
  const lastImportLineEnd = mainTsContent.indexOf('\n', lastImportIndex)
  mainTsContent = mainTsContent.slice(0, lastImportLineEnd + 1) + 
    importStatement + '\n' + 
    mainTsContent.slice(lastImportLineEnd + 1)
}

// 添加 defineCustomElement
const defineStatement = `const ${componentName} = defineCustomElement(${componentName}Vue)`
const lastDefineIndex = mainTsContent.lastIndexOf('defineCustomElement(')
const lastDefineLineEnd = mainTsContent.indexOf('\n', lastDefineIndex)
mainTsContent = mainTsContent.slice(0, lastDefineLineEnd + 1) + 
  defineStatement + '\n' + 
  mainTsContent.slice(lastDefineLineEnd + 1)

// 添加到 Components 对象
const componentsObjectMatch = mainTsContent.match(/const Components[^{]*{([^}]*)}/)
if (componentsObjectMatch) {
  const componentsContent = componentsObjectMatch[1].trim()
  const newComponentsContent = componentsContent + `,\n  ${componentName},`
  mainTsContent = mainTsContent.replace(
    /const Components[^{]*{([^}]*)}/,
    `const Components: Record<string, ReturnType<typeof defineCustomElement>> = {\n  ${newComponentsContent}\n}`
  )
}

// 添加到 export 语句
mainTsContent = mainTsContent.replace(
  /export \{ ([^}]+) \}/,
  (match, exports) => {
    const exportsList = exports.split(',').map(e => e.trim())
    exportsList.push(componentName)
    return `export { ${exportsList.join(', ')} }`
  }
)

// 添加注册函数
const registerFunctionName = `register${componentName}`
const registerFunction = `
export function ${registerFunctionName}() {
  customElements.get('${kebabName}') || customElements.define('${kebabName}', ${componentName})
}`

mainTsContent = mainTsContent.trim() + '\n' + registerFunction + '\n'

fs.writeFileSync(mainTsPath, mainTsContent, 'utf-8')
console.log('✅ 已更新: src/main.ts')

// 步骤 3: 更新 vite.config.ts
console.log('\n📝 步骤 3/4: 更新 vite.config.ts...')
const viteConfigPath = path.join(rootDir, 'vite.config.ts')
let viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8')

// 在 entry 对象中添加新入口
const entryPattern = /(entry:\s*{[^}]*?)(\n\s*})/
viteConfigContent = viteConfigContent.replace(
  entryPattern,
  `$1,\n        "${kebabName}": resolve(__dirname, "src/components/${componentFileName}")$2`
)

fs.writeFileSync(viteConfigPath, viteConfigContent, 'utf-8')
console.log('✅ 已更新: vite.config.ts')

// 步骤 4: 更新 package.json
console.log('\n📝 步骤 4/4: 更新 package.json...')
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

// 添加 exports
if (!packageJson.exports) {
  packageJson.exports = {}
}

packageJson.exports[`./${kebabName}`] = {
  types: `./dist/${kebabName}.d.ts`,
  import: `./dist/es/${kebabName}.js`,
  require: `./dist/cjs/${kebabName}.js`
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8')
console.log('✅ 已更新: package.json')

// 完成
console.log('\n✨ 组件添加完成！\n')
console.log('📋 后续步骤:')
console.log(`   1. 编辑 src/components/${componentFileName} 完善组件逻辑`)
console.log('   2. 运行 npm run build 构建组件')
console.log('   3. 测试组件功能')
console.log('   4. 更新 package.json 的版本号')
console.log('\n💡 使用示例:')
console.log(`   import { ${registerFunctionName} } from 'web-components-zsf'`)
console.log(`   ${registerFunctionName}()`)
console.log(`   // 或者`)
console.log(`   import ${componentName}Vue from 'web-components-zsf/${kebabName}'`)
console.log('\n')

