---
title: AI 協作指南提示詞模板集（精簡版）
description: 精簡的 AI 協作指南文檔體系生成模板，3個核心模板快速落地到任何 React 專案
tags: [Prompt, AI, Automation, Template, React, Documentation, Streamlined]
published: 2025-07-13
updated: 2025-07-14
draft: false
---
# React 專案 AI 協作指南 - 精簡提示詞模板集

> **精簡 AI 協作文檔體系生成器** - 僅3個核心模板，快速生成可維護的AI協作指南，適用於任何 React 專案

## 🔍 模板 1: 專案分析提示詞

```markdown
你是一個專業的 React 專案分析師，請深度分析這個專案並提取完整的技術架構資訊。

**分析任務**:
請掃描專案檔案並分析以下方面：

### 1. 技術棧識別
- **React 生態**: React 版本、相關庫 (React Router、React Query 等)
- **TypeScript**: 配置嚴格程度、型別定義組織
- **狀態管理**: Redux Toolkit、Zustand、Jotai、Context API、或其他
- **UI 組件庫**: Material-UI、Ant Design、Chakra UI、Tailwind、或自定義
- **樣式方案**: CSS Modules、Styled Components、Emotion、Tailwind CSS
- **表單處理**: React Hook Form、Formik、或原生處理
- **資料獲取**: TanStack Query、SWR、Apollo Client、或原生 fetch
- **構建工具**: Vite、Webpack、Create React App、或其他
- **測試框架**: Jest、Vitest、Testing Library、或其他

### 2. 專案結構分析
- **組織模式**: Feature-based、Layer-based、Atomic Design、或混合
- **目錄結構**: 實際的資料夾組織和命名規範
- **組件分層**: 原子組件、複合組件、頁面組件的組織
- **Hook 組織**: 自定義 Hook 的分類和位置
- **API 層**: API 調用的組織和封裝方式
- **型別定義**: TypeScript 型別的組織和命名

### 3. 程式碼模式識別
- **組件模式**: 函數組件使用率、Props 型別定義模式
- **Hook 模式**: 自定義 Hook 的設計模式和命名規範
- **狀態模式**: 本地狀態 vs 全域狀態的使用模式
- **API 模式**: 資料獲取、快取、錯誤處理的模式
- **路由模式**: 路由組織、懶加載、權限控制

### 4. 開發規範推斷
- **命名規範**: 檔案、組件、變數的命名模式
- **程式碼風格**: ESLint 規則、Prettier 配置
- **資料夾規範**: 檔案組織和模組化規則
- **匯入規範**: 相對路徑 vs 絕對路徑、匯入順序

**請提供以下檔案內容進行分析**:
1. package.json (完整內容)
2. tsconfig.json (如果存在)
3. 主要目錄結構 (src/ 下的完整結構)
4. 3-5 個代表性組件檔案
5. 主要的 Hook 檔案 (如果存在)
6. API 層檔案 (如果存在)
7. 路由配置檔案
8. 狀態管理相關檔案

**輸出格式**: 請以詳細的結構化格式輸出分析結果，為後續生成 AI 協作指南提供完整基礎。
```

## 📝 模板 2: 整合的AI協作指南生成提示詞

```markdown
基於專案分析結果，生成精簡整合的 AI-QUICK-REF.md 檔案，作為AI協作的唯一入口。

**專案分析結果**:
[在這裡貼上模板1的分析結果]

**生成要求**:
1. **整合性**: 將開發規範、工作流程、提示模板整合到單一文檔
2. **技術棧準確性**: 使用專案實際的技術棧，不要使用通用範例
3. **程式碼範例真實性**: 提供基於專案實際模式的程式碼範例
4. **精簡可維護**: 避免內容重複，保持文檔精簡
5. **即用性**: 提供可直接使用的協作模板

**請生成包含以下結構的完整 AI-QUICK-REF.md**:

# 🤖 AI Agent 協作指南

> **[專案名稱] - AI 協作完整入口**

## 🎯 快速開始提示模板

### 基本協作模板
你是 [專案名稱] 專案的資深開發者。

**專案技術棧**: [實際技術棧清單]
**參考規範**: 遵循函數組件、Hook 模式、型別安全、現有架構模式

**我需要**: [描述你的具體需求]

### 進階協作模板
你是 [專案名稱] 專案的資深開發者，請參考：
- AI-QUICK-REF.md 的核心約定和開發規範
- docs/ai-context.md 的專案技術上下文
- snapshot.md 的專案結構
- 現有程式碼模式 ([實際的關鍵目錄])

**任務**: [具體需求]
**約束**: [特定要求]
**期望輸出**: [描述期望的格式]

## 📚 精簡文檔體系

| 優先級 | 文檔 | 用途 |
|--------|------|------|
| 🔥🔥🔥 | `AI-QUICK-REF.md` (本文檔) | **AI 協作完整入口** - 核心約定、規範、模板 |
| 🔥🔥 | [`docs/ai-context.md`](docs/ai-context.md) | 專案技術上下文 |
| 🔥 | [`snapshot.md`](../snapshot.md) | 專案結構快照 |
```
## ⚡ 核心約定

### ✅ 必須使用
- 函數組件 + Hooks
- TypeScript 嚴格模式
- [專案實際使用的UI庫]
- [專案實際使用的狀態管理]
- [專案實際使用的表單處理]

### ❌ 禁止使用
- `any` 型別
- 類組件
- 直接 DOM 操作
- 內聯樣式 (優先 [專案樣式方案])

## 🏗️ 專案結構

```
src/
├── [實際目錄結構]
```

## � 開發規範（整合）

### 組件開發規範
- **命名**: 使用 PascalCase，檔案名與組件名一致
- **Props**: 必須定義 TypeScript 介面
- **結構**: 函數組件 + Hook 模式
- **範例**: [基於專案實際的組件範例]

### Hook 使用規範
- **命名**: 以 `use` 開頭，使用 camelCase
- **職責**: 單一職責原則，邏輯封裝
- **型別**: 完整的 TypeScript 型別定義
- **範例**: [基於專案實際的 Hook 範例]

### 狀態管理規範
- **本地狀態**: 使用 useState、useReducer
- **全域狀態**: [專案實際使用的狀態管理方案]
- **伺服器狀態**: [專案實際使用的資料獲取方案]
- **範例**: [基於專案實際的狀態管理範例]

### API 層規範
- **組織**: [專案實際的 API 組織方式]
- **錯誤處理**: [專案實際的錯誤處理模式]
- **型別定義**: 完整的請求/回應型別
- **範例**: [基於專案實際的 API 範例]

### 樣式規範
- **方案**: [專案實際使用的樣式方案]
- **組織**: [專案實際的樣式組織方式]
- **命名**: [專案實際的樣式命名規範]
- **範例**: [基於專案實際的樣式範例]

## 🎭 常見協作場景模板

### 1. 新增功能
```markdown
我需要新增 [功能名稱] 功能，包括：
- API 介面設計
- 型別定義
- Hook 封裝
- UI 組件實現
- 路由配置

請按照專案現有模式實現，確保使用 [專案技術棧]。
```

### 2. 程式碼審查
```markdown
請審查以下程式碼，重點檢查：
- TypeScript 型別安全性
- React Hook 使用規範
- 專案命名約定
- 效能優化機會
- 是否符合 [專案名稱] 專案規範

[貼上程式碼]
```

### 3. 問題解決
```markdown
我在 [具體模組] 遇到 [具體問題]。

**當前實現**: [描述現狀]
**期望結果**: [描述目標]
**專案約束**: 必須使用現有的 Hook 模式和 [專案UI庫] 組件

請提供符合專案架構的解決方案。
```

### 4. 重構建議
```markdown
我想重構 [組件/模組名稱]，目標是：
- 提升可重用性
- 改善效能
- 增強型別安全

請分析現有實現並提供重構方案，確保：
- 不破壞現有 API
- 遵循專案架構模式 ([專案狀態管理])
- 保持向後相容性
```

## 🔄 AI Agent 標準流程（整合）

### 文檔發現流程
1. **首先閱讀**: `AI-QUICK-REF.md` (本文檔) - 獲取核心約定和規範
2. **深入了解**: `docs/ai-context.md` - 理解專案技術上下文
3. **參考結構**: `snapshot.md` - 了解專案架構
4. **開始協作**: 使用上方的協作場景模板

### 協作時間建議
- **快速協作**: 5分鐘 - 僅閱讀本文檔核心約定
- **標準協作**: 10分鐘 - 閱讀本文檔 + ai-context.md
- **深度協作**: 15分鐘 - 完整閱讀所有文檔 + 分析現有程式碼

---

**專案首頁**: [README.md](README.md) | **專案技術上下文**: [`docs/ai-context.md`](docs/ai-context.md)
```

**重要**:
1. **整合性**: 將所有AI協作相關內容整合到本文檔，避免分散
2. **基於實際**: 所有內容都基於專案實際情況，避免使用通用範例
3. **精簡維護**: 減少文檔數量，降低維護複雜度
4. **即用性**: 提供可直接使用的協作模板和規範
```

## � 模板 3: snapshot.md 專案結構快照生成提示詞

### 3A: 直接生成 snapshot.md 內容

```markdown
基於專案分析結果，直接生成 snapshot.md 專案結構快照文檔。

**專案分析結果**:
[在這裡貼上模板1的分析結果]

**生成要求**:
1. **結構完整性**: 反映專案實際的目錄結構
2. **信息豐富性**: 包含目錄樹、關鍵文件說明、依賴信息
3. **AI 友好性**: 結構化輸出，便於 AI 理解和引用
4. **更新便利性**: 為後續腳本自動更新做準備

**請生成包含以下結構的完整 snapshot.md**:

```

## 專案目錄結構

```text
[基於專案實際結構的 ASCII 目錄樹]
```

## 關鍵目錄說明

### src/ - 主要源碼目錄
- **components/** - [基於專案實際的組件組織說明]
- **hooks/** - [基於專案實際的 Hook 組織說明]
- **pages/** - [基於專案實際的頁面組織說明]
- **lib/** - [基於專案實際的工具庫組織說明]
- **types/** - [基於專案實際的型別定義組織說明]

### docs/ - 文檔目錄
- **AI-QUICK-REF.md** - AI 協作主入口
- **ai-context.md** - 專案技術上下文

### 配置文件
- **package.json** - 專案依賴和腳本配置
- **tsconfig.json** - TypeScript 配置
- **vite.config.ts** - [或其他構建工具配置]
- **tailwind.config.ts** - [或其他樣式配置]

## 技術棧概覽

### 核心技術
- **React**: [版本] - [使用特點]
- **TypeScript**: [版本] - [配置特點]
- **[狀態管理]**: [版本] - [使用模式]
- **[UI 庫]**: [版本] - [使用範圍]

### 開發工具
- **構建工具**: [實際使用的工具]
- **樣式方案**: [實際使用的方案]
- **測試框架**: [實際使用的框架]
- **代碼規範**: [實際使用的工具]

## 專案統計

- **總文件數**: [基於實際掃描的數量]
- **組件數量**: [基於實際掃描的數量]
- **Hook 數量**: [基於實際掃描的數量]
- **頁面數量**: [基於實際掃描的數量]
- **依賴數量**: [基於 package.json 的統計]

## 依賴清單

### 生產依賴
```json
[基於專案實際的 dependencies]
```

### 開發依賴
```json
[基於專案實際的 devDependencies]
```

---

*此文檔由 AI 根據專案分析結果生成，後續可通過 snapshot 腳本自動更新*
```

**重要**:
1. 請確保目錄結構反映專案實際情況
2. 關鍵目錄說明要基於專案實際的組織方式
3. 技術棧信息要準確反映專案使用的版本和配置
4. 統計數據要基於實際的文件掃描結果
```

### 3B: 生成優化的 snapshot 腳本

基於專案分析結果和參考 snapshot.cjs，生成專案專用的 snapshot 生成腳本。

**專案分析結果**:
[在這裡貼上模板1的分析結果]

**參考腳本**: snapshot.cjs (已存在於專案中)

**優化要求**:
1. **React 專案適配**: 針對 React 專案優化文件掃描和解析
2. **現代前端支援**: 支援 TypeScript、JSX、現代構建工具
3. **AI 協作優化**: 輸出格式更適合 AI 理解和處理
4. **可配置性**: 支援專案特定的配置需求

**請生成優化的 snapshot.js 腳本**，包含以下改進：

#### 文件支援擴展
```javascript
// 擴展支援的文件類型，針對 React 專案
const FILE_EXTENSIONS = [
  '.js', '.jsx',           // JavaScript React
  '.ts', '.tsx',           // TypeScript React
  '.vue',                  // Vue (如果需要)
  '.json',                 // 配置文件
  '.md'                    // 文檔文件
];
```

#### 排除規則優化
```javascript
// 針對現代前端專案的排除規則
const EXCLUDES = [
  'node_modules', '.git', 'dist', 'build',
  '.next', '.nuxt', '.vite',           // 現代構建工具
  'coverage', '.nyc_output',           // 測試覆蓋率
  '.vscode', '.idea',                  // IDE 配置
  'public/assets', 'static/assets'     // 靜態資源
];
```

**腳本特點**:
1. **純 Node.js** - 僅使用內建模組，無額外依賴
2. **React 優化** - 專門針對 React 專案的文件和模式識別
3. **TypeScript 支援** - 完整支援 TypeScript 型別定義解析
4. **AI 友好** - 輸出格式結構化，便於 AI 理解和處理
5. **可配置** - 支援專案特定的配置需求
6. **自動化** - 一鍵生成完整的專案快照

**使用方式**:
```bash
# 在專案根目錄執行
node snapshot.js

# 或加入到 package.json scripts
"scripts": {
  "snapshot": "node snapshot.js"
}
```

**重要**:
1. 請確保腳本適應專案實際的技術棧和目錄結構
2. 解析規則要針對專案實際使用的程式碼模式
3. 輸出格式要便於 AI 協作和人工閱讀
4. 配置選項要反映專案的實際需求

### 3C: 生成 AI 上下文自動更新腳本

基於專案分析結果，生成專案專用的 AI 上下文自動更新腳本。

**專案分析結果**:
[在這裡貼上模板1的分析結果]

**生成要求**:
1. **智能分析**: 自動掃描專案結構變化和程式碼模式
2. **架構感知**: 識別專案特定的技術棧和開發約定
3. **上下文豐富**: 生成符合 ai-context.md 架構的詳細上下文
4. **統計追蹤**: 提供專案統計資訊和最近變更追蹤

**請生成完整的 scripts/update-ai-context.js 腳本**，以下是完整的腳本模板：

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

## 專案基本資訊
- **專案名稱**: [專案名稱]
- **主要功能**: [基於專案分析推斷的主要功能]
- **技術棧**: [實際檢測到的技術棧]
- **當前狀態**: ${summary.patterns.apiHooks} 個 API Hook, ${summary.structure.pages} 個頁面, ${summary.structure.components} 個組件

## AI 需要的關鍵上下文

### 1. 架構決策

#### 狀態管理
- **客戶端狀態**: [檢測到的狀態管理方案] - ${summary.patterns.customHooks} 個自定義 Hook
- **伺服器狀態**: [檢測到的資料獲取方案] - ${summary.patterns.apiHooks} 個 API Hook
- **表單狀態**: [檢測到的表單處理方案]

#### 路由策略
- [基於專案實際路由配置的分析]
- 懶加載 + Suspense
- 巢狀路由結構

#### API 設計
- [基於API層分析的模式]
- 型別安全的 API 客戶端
- [資料獲取方案] 統一管理

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
- ❌ 不直接使用 fetch (使用 [資料獲取方案])

## AI 協作最佳實踐

### 提示模板

**角色**: 你是 [專案名稱] 專案的資深開發者

**上下文**:
- 專案使用 [實際技術棧]
- 遵循函數組件 + Hooks 模式
- 使用 [UI庫] 組件庫
- 嚴格的 TypeScript 配置
- 當前有 ${summary.patterns.apiHooks} 個 API Hook, ${summary.structure.pages} 個頁面

**任務**: [具體描述你的需求]

**約束**:
- 必須符合專案的 ESLint 規則
- 使用現有的 Hook 模式
- 保持型別安全
- 遵循專案的命名規範

**期望輸出**: [描述你期望的輸出格式]


**腳本特點**:
1. **ES Modules 格式** - 使用現代 JavaScript 模組語法
2. **零依賴** - 僅使用 Node.js 內建模組
3. **智能分析** - 自動識別專案技術棧和模式
4. **結構化輸出** - 生成符合 ai-context.md 架構的內容
5. **統計追蹤** - 提供詳細的專案統計和變更追蹤
6. **可擴展** - 支援新增自定義分析規則

**使用方式**:
```bash
# 在專案根目錄執行
node scripts/update-ai-context.js

# 或加入到 package.json scripts
"scripts": {
  "update-ai-context": "node scripts/update-ai-context.js"
}
```

**自動化建議**:
```json
// package.json 中的 scripts 配置
{
  "scripts": {
    "dev": "vite && npm run update-ai-context",
    "build": "npm run update-ai-context && vite build",
    "update-docs": "npm run snapshot && npm run update-ai-context"
  }
}
```

**重要**:
1. 腳本會自動識別專案使用的技術棧和模式
2. 生成的上下文與手動維護的 ai-context.md 保持一致的架構
3. 統計資訊準確反映專案當前狀態
4. 支援根據專案實際情況調整分析規則

## 🎯 精簡使用指南

### 📋 **精簡文檔體系生成流程**

這套精簡模板系統能夠為任何 React 專案快速生成可維護的 AI 協作文檔體系：

#### 🎯 **核心目標**
- 📋 **快速落地** - 15分鐘內完成設置
- 🚀 **精簡維護** - 僅3個核心文檔
- 🎯 **高效協作** - 單一入口，避免分散
- 📏 **即用模板** - 提供可直接使用的協作模板

#### 📚 **精簡文檔體系**

| 模板 | 生成文檔/腳本 | 作用 | 優先級 |
|------|-------------|------|--------|
| 模板1 | 專案分析報告 | 技術棧與架構分析基礎 | 🔥🔥🔥 |
| 模板2 | `AI-QUICK-REF.md` | 整合的AI協作完整入口 | 🔥🔥🔥 |
| 模板3A | `snapshot.md` | 專案結構快照內容 | 🔥 |
| 模板3B | `snapshot.js` | 專案結構快照腳本 | 🔥 |
| 模板3C | `scripts/update-ai-context.js` | AI上下文自動更新腳本 | 🔥 |

#### 📊 **精簡效果**
- **核心文檔**: 3個 (AI-QUICK-REF.md + ai-context.md + snapshot.md)
- **自動化腳本**: 2個 (snapshot.js + update-ai-context.js)
- **模板數量**: 6個 → 3個主模板 (減少50%)
- **設置時間**: 45分鐘 → 15分鐘 (減少67%)
- **維護複雜度**: 大幅降低，主要依靠自動化

### 🚀 **精簡使用流程**

#### 新專案快速設置 (15分鐘)
1. **專案分析** (5分鐘)
   - 準備專案關鍵檔案 (package.json、主要組件、目錄結構)
   - 使用模板1進行技術棧和架構分析

2. **生成AI協作指南** (8分鐘)
   - 使用模板2生成整合的 `AI-QUICK-REF.md`
   - 包含核心約定、開發規範、協作模板、工作流程

3. **設置自動化** (2分鐘)
   - 使用模板3B生成 `snapshot.js` 腳本
   - 使用模板3C生成 `scripts/update-ai-context.js` 腳本
   - 執行腳本生成 `snapshot.md` 和 `docs/ai-context.md`

#### 現有專案改造 (12分鐘)
1. **現狀評估** (3分鐘)
   - 分析現有文檔和規範
   - 識別可整合的內容

2. **整合生成** (6分鐘)
   - 使用模板2生成整合的AI協作指南
   - 保留有效內容，補充缺失部分

3. **自動化設置** (3分鐘)
   - 配置 snapshot.js 和 update-ai-context.js 腳本
   - 建立自動化文檔維護流程
   - 設置 package.json scripts 自動執行

###  **精簡文檔體系檢查**

#### ✅ **核心文檔檢查清單**
- [ ] `AI-QUICK-REF.md` - 整合的AI協作完整入口
- [ ] `docs/ai-context.md` - 專案技術上下文（自動生成）
- [ ] `snapshot.md` - 專案結構快照（自動生成）

#### 🔗 **自動化腳本檢查清單**
- [ ] `snapshot.js` - 專案結構快照生成腳本
- [ ] `scripts/update-ai-context.js` - AI上下文自動更新腳本
- [ ] `package.json` scripts 配置正確

#### 🔗 **文檔連結正確性檢查**
- [ ] 所有相對路徑連結正確
- [ ] 核心約定清晰明確
- [ ] 協作模板可直接使用
- [ ] 自動生成的內容與手動內容一致

#### 🎯 **協作效果驗證**
- [ ] AI Agent 能快速找到唯一入口
- [ ] 技術約定和規範整合完整
- [ ] 協作場景涵蓋實際需求
- [ ] 自動化腳本正常運行
- [ ] 維護負擔大幅降低

### 🌟 **精簡最佳實踐**

#### 📝 **精簡維護策略**
- **單一入口**: 所有AI協作信息集中在 `AI-QUICK-REF.md`
- **智能自動化**:
  - 使用 `snapshot.js` 自動維護專案結構
  - 使用 `update-ai-context.js` 自動更新技術上下文
- **版本控制**: 將核心文檔和腳本納入版本控制

#### 🤖 **高效協作模式**
- **即用模板**: 直接使用內建的協作場景模板
- **快速上手**: 新團隊成員5分鐘內掌握協作方式
- **實時同步**: 自動化腳本確保文檔與程式碼同步
- **持續優化**: 根據實際使用效果調整模板

#### 🔄 **可持續發展**
- **跨專案複用**: 模板可快速應用到其他專案
- **標準化**: 建立團隊統一的AI協作標準
- **自動化維護**: 大幅減少手動維護工作
- **效率提升**: 從設置到維護全程自動化

#### ⚙️ **推薦的自動化配置**
```json
// package.json 中的 scripts 配置
{
  "scripts": {
    "dev": "vite && npm run update-docs",
    "build": "npm run update-docs && vite build",
    "update-docs": "node snapshot.js && node scripts/update-ai-context.js",
    "snapshot": "node snapshot.js",
    "update-ai-context": "node scripts/update-ai-context.js"
  }
}
```

---

**這套精簡模板系統能在15分鐘內為任何 React 專案建立完整且可維護的 AI 協作體系，通過智能自動化大幅提升開發效率並降低維護負擔。**
