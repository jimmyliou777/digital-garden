---
title: AI 輔助開發指南總結
description: AI 輔助開發指南總結
tags: [Prompt, AI, Integration]
published: 2025-07-13
draft: false
---
# AI 輔助開發指南總結

## 快速開始

### 基本提示模板

```markdown
你是 Mayo PT Web 專案的資深開發者。

**專案技術棧**:
- React 18 + TypeScript + Vite
- 狀態管理: Jotai + TanStack Query
- UI: @mayo/mayo-ui-beta + Tailwind CSS
- 表單: React Hook Form + Zod

**我需要**: [描述你的具體需求]

**請遵循專案規範**: 函數組件、Hook 模式、型別安全、現有架構模式
```

## 專案核心資訊

### 技術架構

| 層級 | 技術選擇 | 用途 |
|------|----------|------|
| 前端框架 | React 18 + TypeScript | 主要開發框架 |
| 構建工具 | Vite 6.3 + SWC | 快速開發和構建 |
| 狀態管理 | Jotai + TanStack Query | 客戶端 + 伺服器狀態 |
| UI 組件 | @mayo/mayo-ui-beta | 企業級組件庫 |
| 樣式系統 | Tailwind CSS | 實用優先的 CSS |
| 表單處理 | React Hook Form + Zod | 型別安全的表單 |
| 路由管理 | React Router v6 | 現代路由解決方案 |

### 目錄結構

```
src/
├── components/     # UI 組件
│   ├── common/     # 通用組件
│   ├── layout/     # 佈局組件
│   └── schedule/   # 排班相關組件
├── hooks/          # 自定義 Hook
│   └── api/        # API 相關 Hook
├── pages/          # 頁面組件
├── api/            # API 客戶端
├── lib/            # 第三方庫配置
│   └── jotai/      # Jotai atoms
├── types/          # 型別定義
├── utils/          # 工具函數
├── routes/         # 路由配置
└── providers/      # Context Providers
```

## 開發規範

### 必須遵循

- ✅ 使用函數組件 + Hooks
- ✅ 嚴格的 TypeScript 型別檢查
- ✅ ESLint + Prettier 程式碼規範
- ✅ 使用 @mayo/mayo-ui-beta 組件
- ✅ TanStack Query 管理伺服器狀態
- ✅ Jotai 管理客戶端狀態

### 禁止事項

- ❌ 使用 `any` 型別
- ❌ 使用類組件
- ❌ 直接操作 DOM
- ❌ 忽略 ESLint 規則
- ❌ 內聯樣式 (優先使用 Tailwind)

## 常用協作場景

### 1. 新增功能

```markdown
我需要新增 [功能名稱]，包括：
- [ ] API 介面設計
- [ ] 型別定義
- [ ] Hook 封裝
- [ ] UI 組件
- [ ] 路由配置

請按照專案現有模式實現。
```

### 2. 程式碼審查

```markdown
請審查以下程式碼，重點檢查：
- TypeScript 型別安全
- Hook 使用規範
- 專案命名約定
- 效能優化機會

[貼上程式碼]
```

### 3. 問題解決

```markdown
我在 [具體模組] 遇到 [具體問題]。

當前實現: [描述現狀]
期望結果: [描述目標]

請提供符合專案架構的解決方案。
```

## Hook 模式範例

### API Hook 模式

```typescript
// 查詢 Hook
export const useEmployees = (params?: EmployeeQueryParams) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeAPI.getEmployees(params),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

// 變更 Hook
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: employeeAPI.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.lists(),
      });
    },
  });
};
```

### Jotai Atom 模式

```typescript
// 基本 atom
export const userInfoAtom = atom<UserInfo | null>(null);

// 衍生 atom
export const isLoggedInAtom = atom(
  (get) => get(userInfoAtom) !== null
);

// 寫入 atom
export const updateUserAtom = atom(
  null,
  (get, set, update: Partial<UserInfo>) => {
    const current = get(userInfoAtom);
    if (current) {
      set(userInfoAtom, { ...current, ...update });
    }
  }
);
```

## 組件開發模式

### 基本組件結構

```typescript
interface ComponentProps {
  // 明確的型別定義
}

export const Component: FC<ComponentProps> = ({ 
  // 解構 props
}) => {
  // Hook 調用
  // 事件處理函數
  // 渲染邏輯
  
  return (
    // JSX 使用 @mayo/mayo-ui-beta 組件
  );
};
```

## 更新機制

- 每次重大架構變更後更新指南
- 新增重要開發約定時同步更新
- 定期檢查與實際程式碼的一致性
- 收集團隊協作經驗並更新範例

## 相關文檔

- [詳細開發規範](./rules.md)
- [AI 協作範例](./ai-collaboration-examples.md)
- [AI 上下文配置](./ai-context.md)
- [專案快照](../snapshot.md)
