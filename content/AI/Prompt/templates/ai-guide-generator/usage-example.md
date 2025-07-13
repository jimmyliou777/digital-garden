---
title: 使用範例：為 React 專案生成 AI 協作指南
description:  使用範例：為 React 專案生成 AI 協作指南
tags: [Prompt, AI, Automation, Example, React]
published: 2025-07-13
draft: false
---
# 使用範例：為 React 專案生成 AI 協作指南

> 以一個典型的 React + TypeScript + Vite 專案為例，展示完整的生成流程

## 📋 範例專案資訊

假設我們有一個電商管理系統專案：
- **專案名稱**: E-Commerce Admin Dashboard
- **技術棧**: React 18 + TypeScript + Vite + Zustand + Material-UI + React Hook Form

## 🔍 步驟 1: 專案分析

### 使用提示詞
```markdown
你是一個專業的 React 專案分析師，請深度分析這個專案並提取完整的技術架構資訊。

[使用 templates/prompt-templates.md 中的模板1]

**請提供以下檔案內容進行分析**:

1. package.json:
```json
{
  "name": "ecommerce-admin-dashboard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.45.0",
    "@hookform/resolvers": "^3.1.0",
    "zod": "^3.21.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "@tanstack/react-query": "^4.29.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.0"
  }
}
```

2. 目錄結構:
```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── layout/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Layout/
│   └── features/
│       ├── products/
│       ├── orders/
│       └── customers/
├── hooks/
│   ├── api/
│   │   ├── useProducts.ts
│   │   ├── useOrders.ts
│   │   └── useCustomers.ts
│   └── common/
│       ├── useLocalStorage.ts
│       └── useDebounce.ts
├── pages/
│   ├── Dashboard/
│   ├── Products/
│   ├── Orders/
│   └── Customers/
├── store/
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── index.ts
├── services/
│   ├── api.ts
│   └── auth.ts
├── types/
│   ├── product.ts
│   ├── order.ts
│   └── user.ts
├── utils/
│   ├── formatters.ts
│   └── validators.ts
└── App.tsx
```

3. 代表性組件範例:
[提供 2-3 個實際的組件檔案內容]
```

### 預期分析結果
AI 會分析並輸出：
- 技術棧：React 18 + TypeScript + Vite + Zustand + Material-UI + TanStack Query
- 架構模式：Feature-based 組織 + Layer-based API 層
- 狀態管理：Zustand stores + TanStack Query for server state
- 組件模式：函數組件 + TypeScript interfaces
- 表單處理：React Hook Form + Zod validation

## 📝 步驟 2: 生成 AI-QUICK-REF.md

### 使用提示詞
```markdown
基於專案分析結果，生成專案專用的 AI-QUICK-REF.md 檔案。

**專案分析結果**: 
[貼上步驟1的完整分析結果]

[使用 templates/prompt-templates.md 中的模板2]
```

### 預期生成結果
```markdown
# 🤖 AI Agent 協作指南

> **E-Commerce Admin Dashboard - AI 協作完整入口**

## 🎯 快速開始提示模板

### 基本協作模板
```markdown
你是 E-Commerce Admin Dashboard 專案的資深開發者。

**專案技術棧**: React 18 + TypeScript + Vite + Zustand + Material-UI + TanStack Query
**參考規範**: 遵循函數組件、Hook 模式、型別安全、Feature-based 架構

**我需要**: [描述你的具體需求]
```

## ⚡ 核心約定

### ✅ 必須使用
- 函數組件 + TypeScript interfaces
- Zustand for client state
- TanStack Query for server state  
- Material-UI components
- React Hook Form + Zod validation

### ❌ 禁止使用
- 類組件
- `any` 型別
- 直接的 fetch 調用 (使用 TanStack Query)
- 內聯樣式 (使用 Material-UI sx prop)

## 🔧 常用模式

### API Hook 模式
```typescript
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
    staleTime: 5 * 60 * 1000,
  });
};
```

### Zustand Store 模式
```typescript
interface AuthState {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ user });
  },
  logout: () => set({ user: null }),
}));
```
```

## 🔧 步驟 3: 生成完整文檔體系

依序使用模板3和模板4生成：
- `docs/rules.md` - 詳細開發規範
- `scripts/update-ai-context.js` - 自動更新腳本

## 🎯 最終輸出

完整的 AI 協作指南體系：

```
project-root/
├── AI-QUICK-REF.md                    # AI 協作主入口
├── docs/
│   ├── rules.md                       # 詳細開發規範
│   ├── ai-guide-summary.md            # 完整技術指南
│   ├── ai-collaboration-examples.md   # 實戰協作範例
│   ├── ai-context-auto.md            # 自動生成的上下文
│   └── ai-prompt-templates.md        # 自動生成的提示模板
├── scripts/
│   └── update-ai-context.js          # 自動更新腳本
└── README.md                         # 專案說明 (包含 AI 指南入口)
```

## 💡 使用效果

### AI 協作前
```
開發者: 幫我新增一個產品管理頁面
AI: 我需要了解你的專案技術棧...
開發者: 我們用 React + TypeScript...
AI: 狀態管理用什麼？
開發者: Zustand...
(重複解釋多輪)
```

### AI 協作後
```
開發者: 參考 AI-QUICK-REF.md，幫我新增一個產品管理頁面
AI: 好的，我看到專案使用 React 18 + TypeScript + Zustand + Material-UI + TanStack Query。
    我會按照 Feature-based 架構在 src/pages/Products/ 建立頁面，
    使用 useProducts hook 獲取資料，Material-UI 組件建立 UI...
(直接開始高效協作)
```

## 🚀 部署建議

1. **新專案**: 在專案初始化時就建立 AI 協作指南
2. **現有專案**: 選擇穩定版本建立指南，避免頻繁變動期
3. **團隊協作**: 將 AI 協作指南納入 onboarding 流程
4. **持續更新**: 設置定期更新機制，保持指南與專案同步

這套模板系統確保每個 React 專案都能擁有量身定制的 AI 協作指南！
