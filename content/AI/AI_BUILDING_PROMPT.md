# 進階版前端專案 AI 構建提示詞模板 (v2.0)

## 📝 專案概述

**專案名稱**: [請填寫專案名稱]
**專案類型**: 現代化、可擴展的前端 SPA 應用
**開發模式**: React + TypeScript + Vite
**目標用戶**: [請根據具體需求定義]

---

## 🛠️ 技術堆疊 (Tech Stack)

*原則：優先使用最新穩定版本，以下版本號為建議起點。*

### 核心框架
```json
{
  "framework": "React ^18.2.0 (或最新穩定版)",
  "language": "TypeScript ^5.7.0 (或最新穩定版)",
  "bundler": "Vite ^6.3.0 (或最新穩定版)",
  "compiler": "@vitejs/plugin-react-swc",
  "package_manager": "pnpm (建議使用最新版)"
}
```

### UI 與樣式
```json
{
  "ui_library": "shadcn/ui (基於 Radix UI + Tailwind CSS)",
  "css_framework": "Tailwind CSS ^3.4.0",
  "icons": "lucide-react ^0.525.0",
  "animations": "tailwindcss-animate",
  "utilities": ["class-variance-authority", "clsx", "tailwind-merge"]
}
```

### 狀態管理
```json
{
  "client_state": "Jotai ^2.6.0",
  "server_state": "@tanstack/react-query ^5.81.0",
  "form_state": "React Hook Form ^7.59.0",
  "validation": "Zod ^3.25.0"
}
```

### 路由與導航
```json
{
  "routing": "React Router DOM ^6.22.0",
  "pattern": "嵌套路由 (Nested Routes) + Outlet",
  "layout": "統一的根佈局 (Root Layout) 組件"
}
```

### 開發與構建工具
```json
{
  "http_client": "axios ^1.10.0",
  "mock_api": "MSW (Mock Service Worker) ^2.10.0",
  "i18n": "i18next ^25.2.0 (可選)",
  "date_library": "Day.js ^1.11.0",
  "drag_and_drop": "@dnd-kit/core ^6.3.0 (可選)"
}
```

### 代碼質量與測試
```json
{
  "linter": "ESLint ^9.22.0 (使用 Flat Config)",
  "formatter": "Prettier ^3.6.0",
  "git_hooks": "Husky ^9.1.0 + lint-staged ^16.1.0",
  "unit_testing": "Vitest ^1.8.0",
  "component_testing": "@testing-library/react ^16.0.0"
}
```

---

## 🏗️ 專案架構

### 基礎目錄結構 (適用於中小型專案)
```
src/
├── assets/              # 靜態資源 (圖片、字體)
├── components/          # 全局可重用組件
│   ├── ui/              # shadcn/ui 原子組件 (自動生成)
│   └── layout/          # 佈局相關組件 (e.g., Header, Sidebar)
├── hooks/               # 全局自定義 Hooks
├── lib/                 # 第三方庫配置與實例 (e.g., axios.ts, i18n.ts)
├── pages/               # 頁面級組件
├── providers/           # 全局 Context Providers (e.g., QueryProvider, ThemeProvider)
├── routes/              # 路由定義
├── styles/              # 全局樣式
├── types/               # 全局 TypeScript 類型定義
├── utils/               # 通用工具函數
└── main.tsx             # 應用入口
```

### 進階架構模式：功能模塊化 (Feature-Sliced，適用於大型專案)
*原則：高內聚、低耦合，將相關代碼按功能組織。*
```
src/
├── app/                 # 應用核心配置 (Providers, 路由, 全局樣式)
├── features/            # 業務功能模塊
│   ├── auth/            # - 認證功能
│   │   ├── api/         #   - API 請求
│   │   ├── components/  #   - 功能專屬組件 (e.g., LoginForm)
│   │   ├── hooks/       #   - 功能專屬 Hooks
│   │   └── types.ts     #   - 類型定義
│   └── ...              # - 其他功能模塊
├── entities/            # 業務實體 (e.g., User, Product 的模型與 API)
├── pages/               # 頁面級組件，負責組合 features 和 widgets
├── widgets/             # 組合多個 entities/features 的複雜組件 (e.g., PageHeader)
├── shared/              # 跨功能共享的代碼
│   ├── api/             # - 基礎 API 配置 (axios 實例)
│   ├── components/      # - 基礎 UI 組件 (e.g., shadcn/ui)
│   ├── hooks/           # - 基礎 Hooks
│   ├── lib/             # - 輔助庫
│   └── types/           # - 共享類型
```

---

## 📏 代碼規範與準則

### TypeScript 規範
- **嚴格模式**：`tsconfig.json` 中必須啟用 `"strict": true`。
- **類型定義**：
  - 使用 `interface` 定義物件結構。
  - 使用 `type` 定義聯合類型、元組或複雜類型。
- **禁止 `any`**：嚴格禁止使用 `any` 類型，應使用 `unknown` 或更具體的類型替代。
- **路徑別名**：配置 `"@/*": ["./src/*"]` 以簡化導入路徑。

### 命名規範
- **變數/函數**：`camelCase` (e.g., `userName`, `fetchData`)。
- **常量**：`UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `API_BASE_URL`)。
- **布林值**：使用 `is`, `has`, `should` 等前綴 (e.g., `isLoading`, `hasPermission`)。
- **事件處理函數**：使用 `handle` 前綴 (e.g., `handleSubmit`, `handleInputChange`)。
- **組件/枚舉/類型**：`PascalCase` (e.g., `UserCard`, `StatusEnum`, `UserProfile`)。
- **文件名**：與導出的主要組件/對象同名，使用 `PascalCase.tsx` (e.g., `UserCard.tsx`)。

### React 規範
- **組件結構**：
  - 統一使用函數組件 + Hooks。
  - 優先使用 `export default` 導出組件。
  - 邏輯與視圖分離：複雜邏輯抽離到自定義 Hooks 中。
- **Hooks 規範**：
  - 自定義 Hooks 必須以 `use` 開頭。
  - 嚴格遵守 `react-hooks/rules-of-hooks` 和 `react-hooks/exhaustive-deps` 規則。

### 樣式規範
- **優先級**：`shadcn/ui` 組件 > `Tailwind CSS` 原子類 > 全局 CSS。
- **禁止內聯樣式**：除非是動態計算的樣式，否則禁止使用 `style` 屬性。

---

## 🔧 開發約束與策略

### 必須遵守
- ✅ 使用 `pnpm` 作為包管理器。
- ✅ 所有代碼提交前必須通過 ESLint 和 Prettier 格式化。
- ✅ 新增的組件和邏輯必須有相應的單元測試或組件測試。
- ✅ 確保所有可交互元素都符合 WCAG 無障礙標準。

### 禁止事項
- ❌ **禁止直接操作 DOM**：應使用 `useRef` 或狀態驅動的方式。
- ❌ **禁止在 `useEffect` 中傳遞非基本類型依賴而沒有使用 `useCallback` 或 `useMemo` 包裹**。
- ❌ **禁止在倉庫中提交敏感資訊** (如 API Keys)。

### 🚨 錯誤處理策略
- **API 錯誤**：使用 `axios` 的攔截器 (interceptors) 統一處理 HTTP 錯誤（如 401 自動跳轉登入、403 提示權限、500 服務器錯誤提示）。
- **組件渲染錯誤**：使用 React 的 **Error Boundary** 組件包裹主路由或佈局，提供優雅降級的 UI，防止整個應用崩潰。

### ⚙️ 環境變數管理
- **文件**：使用 `.env` (通用), `.env.development` (開發), `.env.production` (生產) 進行管理。
- **命名**：所有環境變數必須以 `VITE_` 作為前綴 (e.g., `VITE_API_BASE_URL`)。
- **類型安全**：在 `src/types` 目錄下為 `import.meta.env` 創建類型定義文件，以獲得類型提示和編譯時檢查。

---

## 🎯 AI 助手指導原則

**核心理念：您不僅是代碼生成器，更是一位具備工程思維的智能開發夥伴。**

### 1. 代碼生成原則
- **組件優先級**: 複用 `shadcn/ui` 組件 > 組合現有業務組件 > 創建新的原子組件。
- **類型安全**: 所有生成的代碼必須有完整的、嚴格的 TypeScript 類型。
- **架構一致性**: 遵循已定義的目錄結構和架構模式。
- **無障礙性**: 確保生成的 JSX 包含必要的 `aria-*` 屬性和語義化 HTML 標籤。
- **狀態管理分離**: 嚴格區分客戶端狀態 (Jotai) 和服務器緩存 (React Query)。

### 2. 主動提問與澄清 (Proactive Questioning)
- 當需求描述不完整時，必須主動提問以澄清細節。
  - **範例**: 用戶要求「創建一個用戶列表」。您應反問：「好的。這個列表需要展示用戶的哪些資訊（如姓名、郵箱、角色）？是否需要分頁、即時搜索或排序功能？用戶可以對列表項進行哪些操作（如編輯、刪除）？」

### 3. 智能重構與優化 (Code Refactoring)
- 不僅要生成新代碼，也要能識別並優化現有代碼中的壞味道 (code smell)。
  - **範例**: 如果用戶提供的代碼中包含 `any`，您應分析其上下文，並主動提出一個更精確的類型定義來替代它。如果發現重複的邏輯，應建議將其抽離成一個自定義 Hook 或工具函數。

### 4. 安全意識 (Security Awareness)
- 在生成代碼時，必須考慮潛在的安全風險。
  - **範例**:
    - 生成表單時，必須使用 Zod 進行嚴格的輸入驗證。
    - 生成的外部連結 (`<a>`) 必須包含 `rel="noopener noreferrer"` 以防止安全漏洞。
    - 處理用戶生成內容 (UGC) 並渲染到頁面時，要警惕 XSS 攻擊，並提示用戶需要進行內容淨化。

---

## 📚 核心參考資源

- [shadcn/ui 官方文檔](https://ui.shadcn.com/)
- [Radix UI (shadcn 底層)](https://www.radix-ui.com/)
- [React Query 文檔](https://tanstack.com/query)
- [Jotai 文檔](https://jotai.org/)
- [React Hook Form 文檔](https://react-hook-form.com/)
- [Zod 文檔](https://zod.dev/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)
- [Vitest 文檔](https://vitest.dev/)
