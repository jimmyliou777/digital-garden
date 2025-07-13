---
title: AI 協作上下文配置
description: AI 協作上下文配置
tags: [Prompt, AI, Integration]
published: 2025-07-13
draft: false
---

# AI 協作上下文配置

## 專案基本資訊
- **專案名稱**: Mayo PT Web
- **主要功能**: 排班系統 Web 界面
- **技術棧**: React 18 + TypeScript + Vite + Jotai + TanStack Query
- **UI 框架**: @mayo/mayo-ui-beta + Tailwind CSS

## AI 需要的關鍵上下文

### 1. 架構決策

#### 狀態管理
- **客戶端狀態**: Jotai (原子化)
- **伺服器狀態**: TanStack Query
- **表單狀態**: React Hook Form + Zod

#### 路由策略
- React Router v6
- 懶加載 + Suspense
- 巢狀路由結構

#### API 設計
- Axios + 攔截器
- MSW 模擬
- 型別安全的 API 客戶端

### 2. 開發約定

#### 命名規範
- **組件**: PascalCase
- **Hook**: use + PascalCase
- **常數**: UPPER_SNAKE_CASE
- **檔案**: kebab-case 或 PascalCase

#### 目錄結構
- `/components`: UI 組件
- `/hooks`: 自定義 Hook
- `/lib`: 第三方庫配置
- `/types`: 型別定義

### 3. 禁止事項

- ❌ 不使用 any 型別
- ❌ 不使用類組件
- ❌ 不直接修改 DOM
- ❌ 不忽略 ESLint 規則

## AI 協作最佳實踐

### 提示模板

```markdown
**角色**: 你是 Mayo PT Web 專案的資深開發者

**上下文**:
- 專案使用 React 18 + TypeScript + Jotai + TanStack Query
- 遵循函數組件 + Hooks 模式
- 使用 @mayo/mayo-ui-beta 組件庫
- 嚴格的 TypeScript 配置

**任務**: [具體描述你的需求]

**約束**:
- 必須符合專案的 ESLint 規則
- 使用現有的 Hook 模式
- 保持型別安全
- 遵循專案的命名規範

**期望輸出**: [描述你期望的輸出格式]
```

### 常見協作場景

#### 1. 新增功能

```markdown
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
```

#### 2. 程式碼審查

```markdown
請審查以下程式碼，檢查：
- TypeScript 型別安全性
- React Hook 使用規範
- 專案命名約定
- 效能最佳化機會
- 可維護性改善建議

[貼上程式碼]
```

#### 3. 重構建議

```markdown
我想重構 [組件/模組名稱]，目標是：
- 提升可重用性
- 改善效能
- 增強型別安全

請分析現有實現並提供重構方案，確保：
- 不破壞現有 API
- 遵循專案架構模式
- 保持向後相容性
```

## 更新機制
- 每次重大架構變更後更新此檔案
- 新增重要開發約定時同步更新
- 定期檢查與實際程式碼的一致性
