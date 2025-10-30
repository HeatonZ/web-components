#!/usr/bin/env node

/**
 * 自动化移除组件脚本
 * 用法: node scripts/remove-component.js MyButton
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
  console.log('用法: node scripts/remove-component.js MyButton')
  process.exit(1)
}

// 转换为 kebab-case
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

const kebabName = toKebabCase(componentName)
const componentFileName = `${componentName}.ce.vue`
const componentFilePath = path.join(rootDir, 'src/components', componentFileName)

console.log('\n🗑️  开始移除组件...\n')
console.log(`组件名称: ${componentName}`)
console.log(`标签名称: ${kebabName}\n`)

// 确认是否删除
if (!fs.existsSync(componentFilePath)) {
  console.error(`❌ 错误: 组件文件不存在: ${componentFilePath}`)
  process.exit(1)
}

console.log('⚠️  即将删除以下内容:')
console.log(`   - src/components/${componentFileName}`)
console.log('   - src/main.ts 中的相关代码')
console.log('   - vite.config.ts 中的配置')
console.log('   - package.json 中的导出配置\n')

// 步骤 1: 删除组件文件
console.log('📝 步骤 1/4: 删除组件文件...')
fs.unlinkSync(componentFilePath)
console.log(`✅ 已删除: src/components/${componentFileName}`)

// 步骤 2: 更新 main.ts
console.log('\n📝 步骤 2/4: 更新 main.ts...')
const mainTsPath = path.join(rootDir, 'src/main.ts')
let mainTsContent = fs.readFileSync(mainTsPath, 'utf-8')

// 删除 import 语句
const importPattern = new RegExp(`import ${componentName}Vue from "Components/${componentName}\\.ce\\.vue"\\n?`, 'g')
mainTsContent = mainTsContent.replace(importPattern, '')

// 删除 defineCustomElement 语句
const definePattern = new RegExp(`const ${componentName} = defineCustomElement\\(${componentName}Vue\\)\\n?`, 'g')
mainTsContent = mainTsContent.replace(definePattern, '')

// 从 Components 对象中删除
mainTsContent = mainTsContent.replace(
  new RegExp(`\\s*,?\\s*${componentName}\\s*,?`, 'g'),
  (match) => match.includes(',') ? '' : match
)

// 从 export 语句中删除
mainTsContent = mainTsContent.replace(
  new RegExp(`${componentName}\\s*,\\s*|,\\s*${componentName}`, 'g'),
  ''
)

// 删除注册函数
const registerFunctionPattern = new RegExp(
  `\\nexport function register${componentName}\\(\\)[^}]*}\\n?`,
  'g'
)
mainTsContent = mainTsContent.replace(registerFunctionPattern, '\n')

fs.writeFileSync(mainTsPath, mainTsContent, 'utf-8')
console.log('✅ 已更新: src/main.ts')

// 步骤 3: 更新 vite.config.ts
console.log('\n📝 步骤 3/4: 更新 vite.config.ts...')
const viteConfigPath = path.join(rootDir, 'vite.config.ts')
let viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8')

// 删除 entry 配置
const entryPattern = new RegExp(`\\s*,?\\s*"${kebabName}":[^,\\n]*`, 'g')
viteConfigContent = viteConfigContent.replace(entryPattern, '')

fs.writeFileSync(viteConfigPath, viteConfigContent, 'utf-8')
console.log('✅ 已更新: vite.config.ts')

// 步骤 4: 更新 package.json
console.log('\n📝 步骤 4/4: 更新 package.json...')
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

// 删除 exports
if (packageJson.exports && packageJson.exports[`./${kebabName}`]) {
  delete packageJson.exports[`./${kebabName}`]
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8')
console.log('✅ 已更新: package.json')

// 完成
console.log('\n✨ 组件移除完成！\n')
console.log('📋 后续步骤:')
console.log('   1. 运行 npm run build 重新构建')
console.log('   2. 更新 package.json 的版本号')
console.log('   3. 检查是否有其他地方引用了该组件\n')

