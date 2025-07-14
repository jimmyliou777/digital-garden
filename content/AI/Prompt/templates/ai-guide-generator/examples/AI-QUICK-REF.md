
# 🤖 AI Agent 協作指南

> **MAYO PT Web - AI 協作完整入口**

## 🎯 快速開始提示模板

### 基本協作模板
```markdown
你是 MAYO PT Web 專案的資深開發者，請參考：
- AI-QUICK-REF.md 的核心約定和開發規範
- docs/ai-context.md 的專案技術上下文
- snapshot.md 的專案結構
- 現有程式碼模式 (src/hooks/api/, src/components/, src/lib/jotai/)

**我需要**: [描述你的具體需求]
```

### 進階協作模板
```markdown
你是 MAYO PT Web 專案的資深開發者，請參考：
- AI-QUICK-REF.md 的核心約定和開發規範
- docs/ai-context.md 的專案技術上下文
- snapshot.md 的專案結構
- 現有程式碼模式 (src/hooks/api/, src/components/, src/lib/jotai/)

**任務**: [具體需求]
**技術約束**: React 18 + TypeScript + TanStack Query + Jotai + @mayo/mayo-ui-beta
**參考模式**: [指定要參考的具體檔案或模式]
**期望輸出**: [描述期望的格式和內容]
```

## ⚡ 核心約定

### ✅ 必須使用
- 函數組件 + Hooks
- TypeScript 嚴格模式
- TanStack Query (伺服器狀態)
- Jotai (客戶端狀態)
- React Hook Form + Zod (表單)
- @mayo/mayo-ui-beta (UI 組件)
- Tailwind CSS (樣式)

### ❌ 禁止使用
- `any` 型別
- 類組件
- 直接 DOM 操作
- 內聯樣式
- 手動編輯 package.json (使用包管理器)

## 📋 專案概述

### 技術棧
- **前端框架**: React 18.2.0 + TypeScript 5.7.2
- **構建工具**: Vite 6.3.1 + SWC
- **狀態管理**: TanStack Query 5.81.2 + Jotai 2.6.4
- **表單處理**: React Hook Form 7.59.0 + Zod 3.25.71
- **UI 組件**: @mayo/mayo-ui-beta 2.1.13 + Tailwind CSS 3.4.17
- **路由**: React Router 6.22.3
- **HTTP 客戶端**: Axios 1.10.0
- **開發工具**: ESLint + Prettier + Husky + MSW
- **國際化**: i18next + react-i18next
- **包管理器**: pnpm 10.10.0

### 專案架構
```
src/
├── api/           # API 層統一管理
├── components/    # 組件 (common/layout/feature)
├── hooks/         # 自定義 Hook (api/feature)
├── lib/           # 第三方庫配置 (jotai)
├── pages/         # 頁面組件
├── providers/     # Context Provider
├── routes/        # 路由配置
├── types/         # TypeScript 型別
├── utils/         # 工具函數
└── mocks/         # MSW 模擬數據
```

## 🎯 開發規範

### 命名規範
- **檔案**: camelCase (hooks/utils) | PascalCase (components/pages)
- **組件**: PascalCase
- **變數**: camelCase
- **常數/枚舉**: UPPER_SNAKE_CASE
- **型別**: PascalCase + 描述性後綴 (Interface, Enum, Schema)

### 匯入規範
```typescript
// 1. 第三方庫
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 2. 內部模組 (使用 @/ 別名)
import { apiClient } from '@/api/client';
import { UserInfoAtom } from '@/lib/jotai/user';

// 3. 相對路徑
import './styles.css';
```

### 資料夾組織
- **功能導向**: 按業務功能組織 (api, hooks, components)
- **層級導向**: 按技術層級分離 (types, utils, providers)
- **index 檔案**: 統一匯出入口
- **絕對路徑**: 使用 `@/` 別名避免深層相對路徑

## 💻 程式碼模式

### 1. API Hook 模式
```typescript
// hooks/api/user/useGetUserInfo.ts
const userInfoSchema = z.object({
  userName: z.string(),
  userRole: z.array(z.string()),
  CompanyId: z.string(),
  isVerify: z.boolean(),
});

type UserInfo = z.infer<typeof userInfoSchema>;

export function useGetUserInfo(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const fdApi = getEnv('VITE_SERVER_ENV_FD_BACKEND_SERVER');

  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `${fdApi}/userInfo`,
  };

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => apiRequestWithSchema<UserInfo>(config, {
      responseSchema: userInfoSchema
    }),
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
```

### 2. 狀態管理模式
```typescript
// lib/jotai/user/index.tsx
export interface UserInfoAtom {
  isVerify: boolean;
  userModule: string[];
  userName: string;
  userRole: string[];
  CompanyId: string;
  companyName: string;
}

export const userInfoAtom = atom<UserInfoAtom | null>(null);
```

### 3. 表單組件模式
```typescript
// components/demo/demoForm/index.tsx
const CustomFormSchema = z.object({
  username: z.string().min(1, 'You have to input correct username'),
  birthday: z.string().min(1, { message: 'You have to choose birthday' }),
  hobby: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one item.',
  }),
});

const DemoForm = () => {
  const form = useForm<z.infer<typeof CustomFormSchema>>({
    resolver: zodResolver(CustomFormSchema),
    defaultValues: {
      username: '',
      birthday: new Date().toDateString(),
      hobby: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormItemContent
          name="username"
          description="Enter your username to display in the custom form."
          label="Username"
          control={form.control}
          itemComponent={
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormControl>
                  <Input
                    showMaxLength
                    maxLength={30}
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="w-full"
                  />
                </FormControl>
              )}
            />
          }
        />
      </form>
    </Form>
  );
};
```

### 4. API 層模式
```typescript
// api/axios-instance.ts
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
});

// 請求攔截器（附帶 token）
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => ({
    ...config,
    headers: {
      ...config.headers,
      Authorization: getCookie(CookieNameEnum.AUTH_TOKEN) || '',
    },
    withCredentials: true,
  } as InternalAxiosRequestConfig),
  (error: AxiosError) => Promise.reject(error),
);
```

### 5. 路由模式
```typescript
// routes/index.tsx
const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      defaultRoute,
      timelineDemoRoute,
      shiftSchedulerRoute,
      // ...其他路由
    ],
  },
];
```

### 6. 型別定義模式
```typescript
// types/enums/common/cookie.tsx
export enum CookieNameEnum {
  LOCALE = 'locale',
  AUTH_TOKEN = '__ModuleSessionCookie',
}

// types/interface/select/index.ts
export interface SelectOption {
  label: string;
  value: string;
}
```

## 🔄 AI 協作工作流程

### 1. 任務分析階段
```
1. 理解需求 → 2. 檢查現有程式碼 → 3. 確認技術方案 → 4. 開始實作
```

### 2. 實作前檢查清單
- [ ] 確認使用正確的技術棧 (React 18 + TypeScript)
- [ ] 檢查是否需要新的 API Hook
- [ ] 確認狀態管理方案 (TanStack Query vs Jotai)
- [ ] 檢查是否需要新的型別定義
- [ ] 確認 UI 組件使用 @mayo/mayo-ui-beta
- [ ] 檢查是否需要 MSW 模擬數據

### 3. 程式碼審查要點
- TypeScript 嚴格模式合規
- 使用函數組件 + Hooks
- 正確的錯誤處理和載入狀態
- Zod schema 驗證
- 適當的快取策略 (TanStack Query)
- 無障礙性 (jsx-a11y)

## 📝 常用提示模板

### 新增 API Hook
```
請建立一個新的 API Hook，用於 [功能描述]：
- 使用 TanStack Query
- 包含 Zod schema 驗證
- 遵循專案的 API Hook 模式
- 檔案位置：hooks/api/[模組]/use[功能名稱].ts
- 包含適當的快取策略和錯誤處理
```

### 新增表單組件
```
請建立一個表單組件，包含以下欄位：[欄位列表]
- 使用 React Hook Form + Zod
- 使用 @mayo/mayo-ui-beta 組件
- 遵循專案的表單模式 (參考 DemoForm)
- 包含適當的驗證規則和錯誤訊息
- 支援 i18n (如需要)
```

### 新增頁面組件
```
請建立一個新頁面：[頁面描述]
- 使用函數組件
- 包含適當的資料獲取 (TanStack Query)
- 使用 Layout 包裝
- 遵循專案的頁面結構
- 包含載入和錯誤狀態處理
```

### 狀態管理
```
請新增 [狀態描述] 的狀態管理：
- 評估使用 TanStack Query (伺服器狀態) 或 Jotai (客戶端狀態)
- 包含適當的型別定義
- 遵循專案的狀態管理模式
- 考慮狀態的生命週期和快取策略
```

### 程式碼重構
```
請重構以下程式碼，確保：
- 符合專案的 TypeScript 嚴格模式
- 使用正確的命名規範
- 遵循專案的程式碼模式
- 保持功能不變
- 改善效能和可維護性
```

## 🚨 常見問題與解決方案

### Q: 如何處理 API 錯誤？
A: 使用統一的 axios 攔截器，已在 `api/axios-instance.ts` 中配置，包含狀態碼處理和錯誤訊息統一化

### Q: 如何新增新的路由？
A: 在 `routes/` 目錄下建立新的路由檔案，並在 `routes/index.tsx` 中註冊到 children 陣列

### Q: 如何使用 Mayo UI 組件？
A: 從 `@mayo/mayo-ui-beta/v2` 匯入，參考 `components/demo/demoForm` 範例，注意載入對應的 CSS

### Q: 如何處理表單驗證？
A: 使用 React Hook Form + Zod，參考 `DemoForm` 組件模式，使用 `FormItemContent` 包裝

### Q: 如何管理環境變數？
A: 使用 `utils/env-config.ts` 中的 `getEnv` 函數，遵循 Vite 的環境變數規範

### Q: 如何新增 MSW 模擬數據？
A: 在 `mocks/` 目錄下新增對應的 handler，並在 `mocks/handlers` 中註冊

### Q: 如何處理國際化？
A: 使用 i18next，配置在 `i18n.ts`，支援瀏覽器語言檢測和 HTTP 後端載入

---

**📌 重要提醒**:
- 始終使用專案既有的技術棧和模式
- 新增功能前先檢查是否有類似的實作可參考
- 保持程式碼風格一致性
- 優先使用專案內建的工具和組件
- 使用包管理器 (pnpm) 管理依賴，不要手動編輯 package.json
- 遵循 TypeScript 嚴格模式，避免使用 `any` 型別
