---
title: AI 上下文自動更新腳本
description: 專AI 上下文自動更新腳本
tags: [Prompt, AI, Template, Automation, Script]
published: 2025-07-13
draft: false
---
# AI 上下文自動更新腳本 (改進版)

```javascript
// 
#!/usr/bin/env node

/**
 * AI 上下文自動更新腳本 (改進版)
 *
 * 功能：
 * 1. 掃描專案結構變化
 * 2. 分析新增的 Hook 和組件模式
 * 3. 生成符合 ai-context.md 架構的上下文
 * 4. 保持與手動版本一致的資訊架構
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🤖 開始更新 AI 協作上下文 (改進版)...');

// 掃描專案結構
function scanProjectStructure() {
  const structure = {
    components: scanDirectory('src/components'),
    hooks: scanDirectory('src/hooks'),
    pages: scanDirectory('src/pages'),
    api: scanDirectory('src/api'),
    types: scanDirectory('src/types'),
  };

  return structure;
}

function scanDirectory(dirPath) {
  const fullPath = path.join(projectRoot, dirPath);
  if (!fs.existsSync(fullPath)) return [];

  return fs
    .readdirSync(fullPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && /\.(ts|tsx)$/.test(dirent.name))
    .map(dirent => ({
      name: dirent.name,
      path: path.join(dirPath, dirent.name),
      lastModified: fs.statSync(path.join(fullPath, dirent.name)).mtime,
    }));
}

// 分析 Hook 模式
function analyzeHookPatterns() {
  const hooksDir = path.join(projectRoot, 'src/hooks');
  const patterns = {
    apiHooks: [],
    customHooks: [],
  };

  if (fs.existsSync(hooksDir)) {
    const files = fs
      .readdirSync(hooksDir, { recursive: true })
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

    files.forEach(file => {
      const content = fs.readFileSync(path.join(hooksDir, file), 'utf8');

      // 分析 API Hook 模式
      if (content.includes('useQuery') || content.includes('useMutation')) {
        patterns.apiHooks.push({
          file,
          hasQuery: content.includes('useQuery'),
          hasMutation: content.includes('useMutation'),
          hasKeys: content.includes('Keys'),
        });
      }

      // 分析自定義 Hook 模式
      const hookMatches = content.match(/export\s+const\s+(use\w+)/g);
      if (hookMatches) {
        patterns.customHooks.push(
          ...hookMatches.map(match => ({
            name: match.replace(/export\s+const\s+/, ''),
            file,
          })),
        );
      }
    });
  }

  return patterns;
}

// 生成符合 ai-context.md 架構的 Markdown 格式
function generateImprovedMarkdownContext(summary) {
  return `# AI 協作上下文配置 (自動更新)

> 最後更新: ${new Date(summary.lastUpdated).toLocaleString('zh-TW')}

## 專案基本資訊
- **專案名稱**: Mayo PT Web
- **主要功能**: 排班系統 Web 界面
- **技術棧**: React 18 + TypeScript + Vite + Jotai + TanStack Query
- **UI 框架**: @mayo/mayo-ui-beta + Tailwind CSS
- **當前狀態**: ${summary.patterns.apiHooks} 個 API Hook, ${summary.structure.pages} 個頁面, ${summary.structure.components} 個組件

## AI 需要的關鍵上下文

### 1. 架構決策

#### 狀態管理
- **客戶端狀態**: Jotai (原子化) - ${summary.patterns.customHooks} 個自定義 Hook
- **伺服器狀態**: TanStack Query - ${summary.patterns.apiHooks} 個 API Hook
- **表單狀態**: React Hook Form + Zod

#### 路由策略
- React Router v6
- 懶加載 + Suspense
- 巢狀路由結構

#### API 設計
- Axios + 攔截器
- MSW 模擬 (開發環境)
- 型別安全的 API 客戶端
- TanStack Query 統一管理

### 2. 開發約定

#### 命名規範
- **組件**: PascalCase
- **Hook**: use + PascalCase
- **常數**: UPPER_SNAKE_CASE
- **檔案**: kebab-case 或 PascalCase

#### 目錄結構 (當前狀態)
- \`/components\`: UI 組件 (${summary.structure.components} 個)
- \`/hooks\`: 自定義 Hook (${summary.structure.hooks} 個)
  - \`/hooks/api\`: API 相關 Hook (${summary.patterns.apiHooks} 個)
- \`/pages\`: 頁面組件 (${summary.structure.pages} 個)
- \`/lib\`: 第三方庫配置
- \`/types\`: 型別定義 (${summary.structure.typeFiles} 個)
- \`/api\`: API 客戶端 (${summary.structure.apiFiles} 個)

### 3. 禁止事項

- ❌ 不使用 any 型別
- ❌ 不使用類組件
- ❌ 不直接修改 DOM
- ❌ 不忽略 ESLint 規則
- ❌ 不直接使用 fetch (使用 TanStack Query)

## AI 協作最佳實踐

### 提示模板

\`\`\`markdown
**角色**: 你是 Mayo PT Web 專案的資深開發者

**上下文**:
- 專案使用 React 18 + TypeScript + Jotai + TanStack Query
- 遵循函數組件 + Hooks 模式
- 使用 @mayo/mayo-ui-beta 組件庫
- 嚴格的 TypeScript 配置
- 當前有 ${summary.patterns.apiHooks} 個 API Hook, ${summary.structure.pages} 個頁面

**任務**: [具體描述你的需求]

**約束**:
- 必須符合專案的 ESLint 規則
- 使用現有的 Hook 模式
- 保持型別安全
- 遵循專案的命名規範

**期望輸出**: [描述你期望的輸出格式]
\`\`\`

### 常見協作場景

#### 1. 新增功能

\`\`\`markdown
我需要新增一個 [功能名稱] 功能，包括：
- API 介面設計
- 資料型別定義
- Hook 封裝
- UI 組件實現
- 路由配置

請按照專案現有模式實現，並確保：
- 使用 TanStack Query 管理伺服器狀態
- 使用 Jotai 管理客戶端狀態
- 遵循現有的檔案組織結構
- 使用 @mayo/mayo-ui-beta 組件庫
\`\`\`

#### 2. 程式碼審查

\`\`\`markdown
請審查以下程式碼，檢查：
- TypeScript 型別安全性
- React Hook 使用規範
- 專案命名約定
- TanStack Query 使用模式
- 效能最佳化機會
- 可維護性改善建議

[貼上程式碼]
\`\`\`

#### 3. 重構建議

\`\`\`markdown
我想重構 [組件/模組名稱]，目標是：
- 提升可重用性
- 改善效能
- 增強型別安全

請分析現有實現並提供重構方案，確保：
- 不破壞現有 API
- 遵循專案架構模式 (Jotai + TanStack Query)
- 保持向後相容性
\`\`\`

## 專案統計資訊

### 最近變更 (7天內)
${
  summary.recentChanges.length > 0
    ? summary.recentChanges
        .map(change => `- **${change.path}** (${change.lastModified})`)
        .join('\n')
    : '- 無最近變更'
}

### 技術模式統計
- **API Hook 模式**: ${summary.patterns.apiHooks} 個 (TanStack Query)
- **自定義 Hook**: ${summary.patterns.customHooks} 個
- **核心技術棧**: React 18, TypeScript, Vite, Jotai, TanStack Query, @mayo/mayo-ui-beta

## 更新機制
- 此檔案由 \`scripts/update-ai-context.js\` 自動生成
- 建議在重大架構變更後執行更新
- 新增重要開發約定時同步更新手動版本
- 定期檢查與實際程式碼的一致性

---
*自動生成時間: ${new Date().toLocaleString('zh-TW')}*`;
}

// 生成 AI 上下文摘要
function generateAIContextSummary() {
  const structure = scanProjectStructure();
  const hookPatterns = analyzeHookPatterns();
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

  const summary = {
    lastUpdated: new Date().toISOString(),
    projectInfo: {
      name: packageJson.name,
      version: packageJson.version,
      dependencies: Object.keys(packageJson.dependencies).length,
      devDependencies: Object.keys(packageJson.devDependencies).length,
    },
    structure: {
      components: structure.components.length,
      hooks: structure.hooks.length,
      pages: structure.pages.length,
      apiFiles: structure.api.length,
      typeFiles: structure.types.length,
    },
    patterns: {
      apiHooks: hookPatterns.apiHooks.length,
      customHooks: hookPatterns.customHooks.length,
    },
    recentChanges: getRecentChanges(structure),
  };

  return summary;
}

function getRecentChanges(structure) {
  const allFiles = [
    ...structure.components,
    ...structure.hooks,
    ...structure.pages,
    ...structure.api,
    ...structure.types,
  ];

  const recentFiles = allFiles
    .filter(file => {
      const daysSinceModified = (Date.now() - file.lastModified.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceModified <= 7; // 最近 7 天
    })
    .sort((a, b) => b.lastModified - a.lastModified)
    .slice(0, 10);

  return recentFiles.map(file => ({
    path: file.path,
    lastModified: file.lastModified.toISOString().split('T')[0],
  }));
}

// 更新 AI 上下文檔案
function updateAIContextFile() {
  const summary = generateAIContextSummary();
  const contextPath = path.join(projectRoot, 'docs/ai-context.md');

  const markdownContent = generateImprovedMarkdownContext(summary);
  fs.writeFileSync(contextPath, markdownContent);

  console.log('✅ AI 上下文已更新:', contextPath);
  console.log('📊 專案統計:');
  console.log(`   - 組件: ${summary.structure.components}`);
  console.log(`   - Hook: ${summary.structure.hooks}`);
  console.log(`   - 頁面: ${summary.structure.pages}`);
  console.log(`   - API Hook: ${summary.patterns.apiHooks}`);
  console.log(`   - 最近變更: ${summary.recentChanges.length} 個檔案`);
}

// 主執行函數
async function main() {
  try {
    updateAIContextFile();

    console.log('\n🎉 AI 上下文更新完成！');
    console.log('💡 此版本採用與 docs/ai-context.md 相同的資訊架構');
  } catch (error) {
    console.error('❌ 更新失敗:', error.message);
    process.exit(1);
  }
}

// 直接執行主函數
main().catch(error => {
  console.error('❌ 腳本執行失敗:', error);
  process.exit(1);
});

export { generateAIContextSummary, analyzeHookPatterns };

```