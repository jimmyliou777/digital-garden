---
title: AI 協作指南生成器
description:  AI 協作指南生成器
tags: [Prompt, AI, Automation]
published: 2025-07-13
draft: false
---
# React 專案 AI 協作指南生成器

> 通過 AI 自動掃描專案並生成完整的 AI 協作指南體系

## 🎯 使用方法

### 步驟 1: 專案分析提示詞

```markdown
你是一個專業的 React 專案分析師，請分析這個專案並提取以下資訊：

**任務**: 掃描並分析 React 專案的技術架構和組織結構

**分析重點**:
1. **技術棧識別**
   - React 版本和相關生態
   - TypeScript 配置
   - 狀態管理方案 (Redux, Zustand, Jotai, Context API)
   - UI 組件庫 (Material-UI, Ant Design, Chakra UI, 自定義庫)
   - 樣式方案 (CSS Modules, Styled Components, Tailwind CSS)
   - 表單處理 (React Hook Form, Formik, 原生)
   - 路由方案 (React Router, Next.js Router)
   - 構建工具 (Vite, Webpack, Create React App)

2. **專案結構分析**
   - 目錄組織模式 (Feature-based, Layer-based, Atomic Design)
   - 組件分類和層級
   - Hook 使用模式
   - API 層設計
   - 型別定義組織

3. **程式碼模式識別**
   - 組件開發模式 (函數組件 vs 類組件)
   - Hook 使用慣例
   - 狀態管理模式
   - API 調用模式
   - 錯誤處理模式

4. **開發規範推斷**
   - 命名規範
   - 檔案組織規範
   - 程式碼風格約定
   - 禁止使用的模式

**輸出格式**: 請以結構化的 JSON 格式輸出分析結果，包含上述所有分析點。

**專案檔案**: [請提供 package.json, tsconfig.json, 主要目錄結構, 和幾個代表性的組件檔案]
```

### 步驟 2: AI-QUICK-REF.md 生成提示詞

```markdown
基於專案分析結果，生成 AI-QUICK-REF.md 檔案：

**專案分析結果**: [貼上步驟1的分析結果]

**生成要求**:
1. 使用專案實際的技術棧和架構
2. 提供專案特定的提示模板
3. 包含實際的程式碼模式範例
4. 適應專案的目錄結構
5. 反映專案的開發規範

**模板結構**:
```markdown
# 🤖 AI Agent 協作指南

> **{PROJECT_NAME} 專案 - AI 協作完整入口**

## 🎯 快速開始提示模板

### 基本協作模板
[基於實際技術棧的提示模板]

### 進階協作模板
[包含專案特定規範的詳細模板]

## 📚 關鍵文檔路徑
[專案實際的文檔結構]

## ⚡ 核心約定
### ✅ 必須使用
[基於專案實際使用的技術和模式]

### ❌ 禁止使用
[基於專案規範推斷的禁止項目]

## 🏗️ 專案結構
[實際的專案目錄結構]

## 🔧 常用模式
[專案中實際使用的程式碼模式範例]

## 🎭 常見協作場景
[適應專案技術棧的協作場景]

## 📖 完整文檔體系
[專案的文檔組織結構]

## 🔄 協作流程建議
[基於專案特點的協作建議]
```

請生成完整的 AI-QUICK-REF.md 內容。
```

### 步驟 3: 詳細規範文檔生成提示詞

```markdown
基於專案分析，生成 docs/rules.md 開發規範文檔：

**專案分析結果**: [貼上分析結果]

**生成要求**:
1. 詳細的開發規範和最佳實踐
2. 專案特定的程式碼範例
3. 完整的禁止事項清單
4. 架構決策說明
5. 團隊協作規範

**包含章節**:
- 專案概述
- 技術棧說明
- 目錄結構規範
- 組件開發規範
- Hook 使用規範
- 狀態管理規範
- API 層規範
- 樣式規範
- 型別定義規範
- 測試規範
- 禁止行為
- 最佳實踐

請生成完整的 rules.md 內容。
```

### 步驟 4: 技術指南生成提示詞

```markdown
生成 docs/ai-guide-summary.md 完整技術指南：

**專案分析結果**: [貼上分析結果]

**生成要求**:
1. 技術架構詳細說明
2. 開發模式範例
3. 協作場景指導
4. 相關文檔連結

**包含內容**:
- 快速開始指南
- 專案核心資訊
- 技術架構表格
- 目錄結構說明
- 開發規範總結
- Hook 模式範例
- 組件開發模式
- 常用協作場景
- 最佳實踐總結

請生成完整的 ai-guide-summary.md 內容。
```

### 步驟 5: 協作範例生成提示詞

```markdown
生成 docs/ai-collaboration-examples.md 實戰協作範例：

**專案分析結果**: [貼上分析結果]

**生成要求**:
1. 基於專案實際技術棧的協作範例
2. 具體的問題解決案例
3. 程式碼審查範例
4. 重構建議範例

**包含範例**:
- 新增功能完整流程
- 程式碼審查實例
- 效能優化案例
- 重構建議案例
- 問題解決範例
- 最佳實踐總結

請生成完整的 ai-collaboration-examples.md 內容。
```

## 🔧 自動化腳本生成提示詞

```markdown
基於專案分析，生成自動更新腳本 scripts/update-ai-context.js：

**專案分析結果**: [貼上分析結果]

**生成要求**:
1. 適應專案的目錄結構
2. 分析專案特定的模式
3. 生成專案相關的提示模板
4. 支援專案的技術棧

**腳本功能**:
- 掃描專案結構變化
- 分析 Hook 和組件模式
- 生成 Markdown 格式的上下文
- 更新提示模板
- 統計專案資訊

請生成完整的 update-ai-context.js 腳本。
```

## 📦 使用流程

### 新專案初始化
1. 執行專案分析提示詞
2. 依序執行各文檔生成提示詞
3. 生成自動化腳本
4. 建立完整的 AI 協作指南體系

### 現有專案添加指南
1. 分析現有專案結構和技術棧
2. 生成適應現有架構的協作指南
3. 整合到現有文檔體系
4. 設置自動更新機制

## 🎯 預期輸出

完整的文檔體系：
- `AI-QUICK-REF.md` - AI 協作主入口
- `docs/rules.md` - 詳細開發規範
- `docs/ai-guide-summary.md` - 完整技術指南
- `docs/ai-collaboration-examples.md` - 實戰協作範例
- `docs/ai-context.md` - AI 專用上下文
- `scripts/update-ai-context.js` - 自動更新腳本

每個文檔都基於專案實際情況生成，確保 AI 協作的準確性和有效性。

## 🚀 快速啟動

### 一鍵生成指令

```bash
# 1. 複製模板到你的專案
cp -r templates/ your-project/ai-templates/

# 2. 準備專案資訊
# - package.json
# - 目錄結構
# - 代表性組件檔案

# 3. 依序執行提示詞模板
# 使用 templates/prompt-templates.md 中的模板1-4
```

### 自動化腳本 (未來擴展)

```javascript
// 未來可以建立的自動化工具
const generateAIGuide = async (projectPath) => {
  const analysis = await analyzeProject(projectPath);
  const quickRef = await generateQuickRef(analysis);
  const rules = await generateRules(analysis);
  const guide = await generateGuide(analysis);
  const script = await generateScript(analysis);

  await writeFiles({
    'AI-QUICK-REF.md': quickRef,
    'docs/rules.md': rules,
    'docs/ai-guide-summary.md': guide,
    'scripts/update-ai-context.js': script
  });
};
```

## 📊 效果追蹤

建議追蹤以下指標：
- **生成準確度**: 生成的指南與專案實際情況的符合度
- **協作效率**: AI 協作的成功率和效率提升
- **維護成本**: 指南維護的時間成本
- **團隊採用率**: 團隊成員使用 AI 協作指南的比例

## 🔄 持續改善

1. **收集回饋**: 記錄 AI 協作中的問題和改善建議
2. **模板優化**: 根據使用經驗優化提示詞模板
3. **自動化提升**: 逐步提高自動化程度
4. **社群分享**: 將成功經驗分享給開發社群
