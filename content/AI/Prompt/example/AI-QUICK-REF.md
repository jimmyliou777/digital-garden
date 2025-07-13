---
title: AI Agent 協作指南範例
description: 專案 AI 協作體系建設
tags: [Prompt, AI, Integration]
published: 2025-07-13
draft: false
---
# 🤖 AI Agent 協作指南

> **Mayo PT Web 專案 - AI 協作完整入口**

## 🎯 快速開始提示模板

### 基本協作模板
```markdown
你是 Mayo PT Web 專案的資深開發者。

**專案技術棧**: React 18 + TypeScript + Jotai + TanStack Query + @mayo/mayo-ui-beta
**參考規範**: 遵循函數組件、Hook 模式、型別安全、現有架構模式

**我需要**: [描述你的具體需求]
```

### 進階協作模板
```markdown
你是 Mayo PT Web 專案的資深開發者，請參考：
- AI-QUICK-REF.md 的核心約定
- docs/rules.md 的詳細開發規範
- 現有程式碼模式 (src/hooks/api/, src/components/)

**任務**: [具體需求]
**約束**: [特定要求]
**期望輸出**: [描述期望的格式]
```

## 📚 關鍵文檔路徑

| 優先級 | 文檔 | 用途 |
|--------|------|------|
| 🔥🔥🔥 | [`docs/ai-guide-summary.md`](docs/ai-guide-summary.md) | **主要入口** - 完整協作指南 |
| 🔥🔥 | [`docs/rules.md`](docs/rules.md) | 詳細開發規範 |
| 🔥 | [`snapshot.md`](snapshot.md) | 專案結構快照 |
| 🔥 | [`docs/ai-context.md`](docs/ai-context.md) | AI 專用上下文 |

## ⚡ 核心約定

### ✅ 必須使用
- 函數組件 + Hooks
- TypeScript 嚴格模式
- @mayo/mayo-ui-beta 組件
- TanStack Query (伺服器狀態)
- Jotai (客戶端狀態)
- React Hook Form + Zod (表單)

### ❌ 禁止使用
- `any` 型別
- 類組件
- 直接 DOM 操作
- 內聯樣式 (優先 Tailwind)

## 🏗️ 專案結構

```
src/
├── components/     # UI 組件
├── hooks/api/      # API Hook 模式
├── pages/          # 頁面組件
├── lib/jotai/      # Jotai atoms
├── types/          # 型別定義
└── api/            # API 客戶端
```

## 🔧 常用模式

### API Hook
```typescript
export const useEmployees = (params?: QueryParams) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeAPI.getEmployees(params),
    staleTime: 5 * 60 * 1000,
  });
};
```

### Jotai Atom
```typescript
export const userInfoAtom = atom<UserInfo | null>(null);
```

### 組件結構
```typescript
interface Props {
  // 明確型別定義
}

export const Component: FC<Props> = ({ ...props }) => {
  // Hook 調用
  // 事件處理
  return (
    // @mayo/mayo-ui-beta 組件
  );
};
```

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
- 是否符合 Mayo PT Web 專案規範

[貼上程式碼]
```

### 3. 問題解決
```markdown
我在 [具體模組] 遇到 [具體問題]。

**當前實現**: [描述現狀]
**期望結果**: [描述目標]
**專案約束**: 必須使用現有的 Hook 模式和 @mayo/mayo-ui-beta 組件

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
- 遵循專案架構模式 (Jotai + TanStack Query)
- 保持向後相容性
```

## 📖 完整文檔體系

| 優先級 | 文檔 | 用途 | 更新頻率 |
|--------|------|------|----------|
| 🔥🔥🔥 | `AI-QUICK-REF.md` (本文檔) | **AI 協作主入口** | 架構變更時 |
| 🔥🔥 | [`docs/ai-context.md`](docs/ai-context-auto.md) | **自動生成的專案上下文** | 自動更新 |
| 🔥🔥 | [`docs/ai-prompt-templates.md`](docs/ai-prompt-templates.md) | **自動生成的提示模板** | 自動更新 |
| 🔥🔥 | [`docs/rules.md`](docs/rules.md) | 詳細開發規範 | 規範變更時 |
| 🔥 | [`snapshot.md`](snapshot.md) | 專案結構快照 | 自動生成 |
| 💡 | [`docs/ai-guide-summary.md`](docs/ai-guide-summary.md) | 完整技術指南 | 定期更新 |
| 💡 | [`docs/ai-collaboration-examples.md`](docs/ai-collaboration-examples.md) | 實戰協作範例 | 經驗累積時 |

## 🔄 協作流程建議

### AI Agent 分析流程
1. **首先查看**: `AI-QUICK-REF.md` (本文檔) - 獲取核心約定
2. **深入了解**: `docs/rules.md` - 理解詳細規範
3. **參考結構**: `snapshot.md` - 了解專案架構
4. **學習模式**: 分析 `src/hooks/api/` 和 `src/components/` 的現有實現

### 開發者使用建議
- **快速協作**: 直接使用上方的提示模板
- **複雜需求**: 組合多個模板，提供更詳細的上下文
- **持續改善**: 將成功的協作經驗回饋到文檔中

---

**專案首頁**: [README.md](README.md) | **完整技術指南**: [`docs/ai-guide-summary.md`](docs/ai-guide-summary.md)
