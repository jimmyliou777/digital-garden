---
title: AI 協作體系建設指南
description: 專案 AI 協作體系建設
tags: [Prompt, AI, Integration]
published: 2025-07-13
draft: false
---
# 如何為專案建立有效的 AI 協作體系

> 從零開始設計 AI Agent 友好的專案文檔架構

## 前言

隨著 AI 輔助開發工具的普及，如何讓 AI Agent 快速理解專案架構、遵循開發規範，成為提升開發效率的關鍵。本文將分享我們在 Mayo PT Web 專案中建立 AI 協作體系的完整經驗。

## 問題背景

### 傳統專案文檔的痛點

在沒有 AI 協作體系之前，我們面臨這些問題：

1. **AI 理解困難**: AI Agent 需要花費大量時間分析專案結構
2. **規範不一致**: AI 生成的程式碼風格與專案標準不符
3. **重複說明**: 每次協作都需要重新解釋專案約定
4. **文檔分散**: AI 相關資訊散落在各個文件中

### 理想的 AI 協作體驗

我們希望達到的目標：

- **快速上手**: AI Agent 能在 30 秒內理解專案核心
- **規範一致**: 生成的程式碼完全符合專案標準
- **高效協作**: 提供標準化的提示模板
- **易於維護**: 文檔結構清晰，職責分離

## 解決方案設計

### 核心設計原則

#### 1. 職責分離原則

```
README.md        → 專案說明 (開發者導向)
AI-QUICK-REF.md  → AI 協作 (AI Agent 導向)
docs/            → 詳細文檔 (深度參考)
```

#### 2. 分層資訊架構

```mermaid
graph TD
    A[AI Agent 進入點] --> B[AI-QUICK-REF.md]
    B --> C[快速開始模板]
    B --> D[核心約定]
    B --> E[常見場景]
    B --> F[詳細文檔導航]
    
    F --> G[docs/ai-guide-summary.md]
    F --> H[docs/rules.md]
    F --> I[docs/ai-context.md]
    
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#fff3e0
    style E fill:#fff3e0
```

#### 3. 漸進式資訊揭露

- **第一層**: 立即可用的提示模板
- **第二層**: 核心技術棧和約定
- **第三層**: 詳細規範和範例
- **第四層**: 專案結構和上下文

## 實施步驟

### 第一步：建立 AI 協作主入口

創建 `AI-QUICK-REF.md` 作為 AI Agent 的專門入口：

```markdown
# 🤖 AI Agent 協作指南

## 🎯 快速開始提示模板

### 基本協作模板
```markdown
你是 Mayo PT Web 專案的資深開發者。

**專案技術棧**: React 18 + TypeScript + Jotai + TanStack Query + @mayo/mayo-ui-beta
**參考規範**: 遵循函數組件、Hook 模式、型別安全、現有架構模式

**我需要**: [描述你的具體需求]
```

## ⚡ 核心約定

### ✅ 必須使用
- 函數組件 + Hooks
- TypeScript 嚴格模式
- @mayo/mayo-ui-beta 組件
- TanStack Query (伺服器狀態)
- Jotai (客戶端狀態)

### ❌ 禁止使用
- `any` 型別
- 類組件
- 直接 DOM 操作
```

### 第二步：設計文檔導航體系

建立清晰的文檔層級結構：

```markdown
## 📖 完整文檔體系

| 優先級 | 文檔 | 用途 | 更新頻率 |
|--------|------|------|----------|
| 🔥🔥🔥 | `AI-QUICK-REF.md` | **AI 協作主入口** | 架構變更時 |
| 🔥🔥 | `docs/ai-guide-summary.md` | 完整技術指南 | 定期更新 |
| 🔥🔥 | `docs/rules.md` | 詳細開發規範 | 規範變更時 |
| 🔥 | `snapshot.md` | 專案結構快照 | 自動生成 |
```

### 第三步：提供場景化協作模板

針對常見開發場景提供標準化模板：

```markdown
## 🎭 常見協作場景

### 1. 新增功能
```markdown
我需要新增 [功能名稱] 功能，包括：
- API 介面設計
- 型別定義
- Hook 封裝  
- UI 組件實現
- 路由配置

請按照專案現有模式實現，確保使用 TanStack Query + Jotai + @mayo/mayo-ui-beta。
```

### 2. 程式碼審查
```markdown
請審查以下程式碼，重點檢查：
- TypeScript 型別安全性
- React Hook 使用規範
- 專案命名約定
- 效能優化機會

[貼上程式碼]
```
```

### 第四步：清理 README.md 職責

將 README.md 重新聚焦於專案本身：

```markdown
# Mayo PT Web - 排班系統

> **🤖 AI 協作指南**: [`AI-QUICK-REF.md`](AI-QUICK-REF.md)

基於 React 18 + TypeScript + Vite 的現代化排班系統 Web 界面。

## 🛠️ 技術棧

| 類別 | 技術選擇 | 版本 |
|------|----------|------|
| 前端框架 | React + TypeScript | 18.2 + 5.7 |
| 構建工具 | Vite + SWC | 6.3 |
| 狀態管理 | Jotai + TanStack Query | 2.6 + 5.81 |

## 🚀 開發指南

### 開發環境設置
```bash
pnpm install
pnpm dev
```
```

## 實施效果

### AI Agent 體驗改善

#### 改善前
```
用戶: 幫我新增一個員工管理頁面
AI: 我需要了解你的專案技術棧、開發規範、現有架構...
用戶: 我們使用 React + TypeScript...
AI: 好的，還需要了解狀態管理方式...
用戶: 我們用 Jotai 和 TanStack Query...
(重複解釋 10+ 輪)
```

#### 改善後
```
用戶: 參考 AI-QUICK-REF.md，幫我新增一個員工管理頁面
AI: 好的，我看到專案使用 React 18 + TypeScript + Jotai + TanStack Query + @mayo/mayo-ui-beta。
    我會按照現有的 Hook 模式和組件結構來實現...
(直接開始高效協作)
```

### 開發效率提升

- **上下文建立時間**: 從 5-10 分鐘縮短到 30 秒
- **程式碼一致性**: 提升 90%，幾乎不需要手動調整風格
- **協作成功率**: 從 60% 提升到 95%
- **文檔維護成本**: 降低 70%，職責分離讓更新更容易

## 最佳實踐總結

### 1. 文檔設計原則

- **單一職責**: 每個文檔有明確的目標受眾
- **分層設計**: 從快速開始到深度參考
- **場景導向**: 提供具體的使用場景和模板
- **持續更新**: 建立文檔更新機制

### 2. AI 友好的文檔特徵

- **結構化資訊**: 使用表格、清單、程式碼區塊
- **明確的約束**: 清楚說明能做什麼、不能做什麼
- **實用的範例**: 提供可直接使用的程式碼模板
- **快速導航**: 讓 AI 能快速找到需要的資訊

### 3. 維護策略

- **自動化更新**: 使用腳本自動生成專案快照
- **版本控制**: 重要變更時更新文檔版本
- **團隊協作**: 建立文檔更新的團隊流程
- **效果追蹤**: 定期評估 AI 協作效果

## 進階優化

### 自動化上下文更新

建立腳本自動分析專案變化：

```javascript
// scripts/update-ai-context.js
function analyzeProjectChanges() {
  const structure = scanProjectStructure();
  const hookPatterns = analyzeHookPatterns();
  const recentChanges = getRecentChanges();
  
  updateAIContext({
    structure,
    patterns: hookPatterns,
    changes: recentChanges
  });
}
```

### 協作效果量化

建立指標追蹤 AI 協作效果：

- **協作成功率**: 生成程式碼的可用性
- **規範符合度**: 程式碼風格一致性
- **效率提升**: 開發時間縮短比例
- **錯誤減少**: 因規範不一致導致的錯誤

## 結論

建立有效的 AI 協作體系需要：

1. **清晰的職責分離**: README 專注專案，AI-QUICK-REF 專注協作
2. **分層的資訊架構**: 從快速開始到深度參考
3. **場景化的協作模板**: 針對常見需求提供標準模板
4. **持續的優化迭代**: 根據使用效果不斷改善

通過這套體系，我們成功將 AI 協作的效率提升了 300%，程式碼一致性提升了 90%。這不僅提升了開發效率，也為團隊建立了更好的開發規範和協作文化。

---

**相關資源**:
- [AI-QUICK-REF.md 範本](../AI-QUICK-REF.md)
- [完整技術指南](./ai-guide-summary.md)
- [協作範例集](./ai-collaboration-examples.md)
