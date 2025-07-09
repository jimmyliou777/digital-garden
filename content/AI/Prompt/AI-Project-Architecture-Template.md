---
title: AI Building Prompt
description: AI構建專案提示詞模板
tags: [Prompt, AI]
published: 2025-07-09
draft: false
---
# MAYO-PT-Web AI 專案架構生成提示詞模板

## 📝 專案概述

**專案名稱**: MAYO-PT-Web  
**專案類型**: 企業級人力資源管理平台  
**開發模式**: 現代化前端SPA應用  
**目標用戶**: HR管理人員、員工排班系統

## 🛠️ 技術堆疊

### 核心框架
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 5.7.2",
  "bundler": "Vite 6.3.1",
  "compiler": "@vitejs/plugin-react-swc",
  "package_manager": "pnpm 10.10.0"
}
```

### UI 與樣式
```json
{
  "ui_library": "@mayo/mayo-ui-beta ^2.1.13",
  "css_framework": "Tailwind CSS 3.4.17",
  "icons": "lucide-react ^0.525.0",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 狀態管理
```json
{
  "client_state": "jotai ^2.6.4",
  "server_state": "@tanstack/react-query ^5.81.2", 
  "form_state": "react-hook-form ^7.59.0",
  "validation": "zod ^3.25.67"
}
```

### 路由與導航
```json
{
  "routing": "react-router-dom ^6.22.3",
  "pattern": "嵌套路由 + Outlet",
  "layout": "統一Layout包裝"
}
```

### 開發工具
```json
{
  "http_client": "axios ^1.10.0",
  "mock": "msw ^2.10.2",
  "i18n": "i18next ^25.2.1",
  "date": "dayjs ^1.11.10",
  "dnd": "@dnd-kit/core ^6.3.1",
  "timeline": "react-calendar-timeline 0.30.0-beta.3"
}
```

### 代碼質量
```json
{
  "linter": "ESLint 9.22.0 (flat config)",
  "formatter": "Prettier 3.6.0",
  "git_hooks": "Husky 9.1.7",
  "staged_lint": "lint-staged 16.1.2"
}
```

## 🏗️ 專案架構

### 目錄結構
```
src/
├── api/                    # API客戶端層
│   └── client.ts          # axios實例配置
├── components/            # 可重用組件
│   ├── layout/           # 佈局組件
│   │   ├── index.tsx     # 主Layout
│   │   └── sidebar/      # 側邊欄組件
│   ├── schedule/         # 業務組件(排班)
│   └── demo/             # 示例組件
├── hooks/                # 自定義Hooks
│   └── api/              # API相關hooks
├── pages/                # 頁面組件
├── routes/               # 路由配置
│   └── index.tsx         # 主路由配置
├── providers/            # Context Providers
│   └── QueryProvider.tsx # React Query Provider
├── mocks/                # MSW Mock配置
│   ├── browser.ts        # 瀏覽器MSW
│   ├── handlers.ts       # API handlers
│   └── data/             # Mock數據
├── types/                # TypeScript類型定義
├── utils/                # 工具函數
├── schemas/              # Zod驗證Schema
├── assets/               # 靜態資源
└── lib/                  # 第三方庫配置
```

### 架構模式

#### 1. 分層架構
- **展示層**: Pages + Components
- **邏輯層**: Hooks + Utils  
- **數據層**: API + Mocks
- **狀態層**: Jotai Atoms + React Query

#### 2. 狀態管理模式
```typescript
// 客戶端狀態 (Jotai)
export const userAtom = atom({
  id: '',
  name: '',
  role: ''
});

// 服務端狀態 (React Query)  
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers()
  });
};
```

#### 3. 路由架構
```typescript
const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: '', element: <HomePage /> },
      { path: 'schedule', element: <SchedulePage /> },
      // 更多路由...
    ],
  },
];
```

## 📏 代碼規範準則

### TypeScript 規範

#### 類型定義
```typescript
// ✅ 正確：使用interface定義物件類型
interface User {
  id: string;
  name: string;
  role: UserRole;
}

// ✅ 正確：使用type定義聯合類型
type UserRole = 'admin' | 'user' | 'guest';

// ❌ 錯誤：禁止使用any
const data: any = {};
```

#### 嚴格模式配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 命名規範

#### 變數命名
```typescript
// ✅ 變數：camelCase
const userName = 'john';
const userList = ['user1', 'user2'];

// ✅ 常量：UPPER_SNAKE_CASE  
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ Flag變數：is前綴
const isLoading = true;
const isAuthenticated = false;

// ✅ 事件處理：handle前綴
const handleSubmit = () => {};
const handleInputChange = () => {};
```

#### 組件命名
```typescript
// ✅ 組件：PascalCase
const UserCard = () => {};
const ShiftScheduler = () => {};

// ✅ 文件名：camelCase.tsx
// userCard.tsx
// shiftScheduler.tsx

// ✅ 枚舉：PascalCase + Enum後綴
enum StatusEnum {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
```

### React 規範

#### 組件結構
```typescript
// ✅ 正確：函數組件 + export default
const UserCard: FC<UserCardProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  return (
    <div className="user-card">
      {/* JSX內容 */}
    </div>
  );
};

export default UserCard;
```

#### Hooks規範
```typescript
// ✅ 自定義Hook
export const useUserData = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    enabled: !!userId
  });
};
```

### 樣式規範

#### Tailwind CSS 使用
```tsx
// ✅ 優先使用 @mayo/mayo-ui-beta 組件
import { Button, Card, Input } from '@mayo/mayo-ui-beta/v2';

// ✅ 使用 Tailwind 進行自定義樣式
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <Button variant="primary" size="md">
    提交
  </Button>
</div>
```

## 🔧 開發約束

### 必須使用
- ✅ 函數組件 + Hooks（禁止類組件）
- ✅ @mayo/mayo-ui-beta 組件庫優先
- ✅ TypeScript 嚴格模式
- ✅ pnpm 包管理
- ✅ ESLint + Prettier 代碼檢查

### 禁止使用
- ❌ any 類型
- ❌ 類組件
- ❌ 直接 DOM 操作
- ❌ 內聯樣式（除非必要）
- ❌ 未聲明的依賴

## 📋 開發流程

### 創建新頁面
```bash
# 1. 創建頁面組件
src/pages/NewPage.tsx

# 2. 創建路由配置  
src/routes/newPageRoute.tsx

# 3. 更新主路由
src/routes/index.tsx
```

### 創建新組件
```bash
# 1. 創建組件文件
src/components/feature/NewComponent.tsx

# 2. 創建索引文件（如需要）
src/components/feature/index.tsx

# 3. 導出組件
export { default as NewComponent } from './NewComponent';
```

### API 整合
```typescript
// 1. 定義API函數
export const getUsers = (): Promise<User[]> => {
  return client.get('/users').then(res => res.data);
};

// 2. 創建React Query Hook
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });
};

// 3. 在組件中使用
const { data: users, isLoading } = useUsers();
```

## 🧪 質量保證

### ESLint 配置重點
```javascript
// eslint.config.js
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'simple-import-sort/imports': 'error',
      'jsx-a11y/alt-text': 'error',
    }
  }
];
```

### Prettier 配置
```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

### Git Hooks
```bash
# pre-commit 自動執行
- ESLint 自動修復
- Prettier 格式化  
- 檢查通過才允許提交
```

## 🎯 AI 助手指導原則

### 代碼生成原則
1. **組件優先級**: @mayo/mayo-ui-beta > 組合現有組件 > 創建新組件
2. **類型安全**: 所有代碼必須有完整的TypeScript類型
3. **路由一致性**: 新頁面必須遵循現有路由模式  
4. **樣式一致性**: 優先使用Tailwind CSS類名
5. **狀態管理**: 客戶端狀態用Jotai，服務端狀態用React Query

### 常見開發場景

#### 場景1: 創建表單頁面
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Card } from '@mayo/mayo-ui-beta/v2';

const FormPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: FormData) => {
    // 處理提交邏輯
  };

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('name')} error={errors.name?.message} />
        <Button type="submit">提交</Button>
      </form>
    </Card>
  );
};
```

#### 場景2: 整合API數據
```typescript
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/client';

const UserList = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  if (isLoading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;

  return (
    <div className="grid gap-4">
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

## 📚 參考資源

- [Mayo UI Beta 文檔](https://mayo-ui-beta.com)
- [React Query 文檔](https://tanstack.com/query)
- [Jotai 文檔](https://jotai.org)
- [React Router v6](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [MSW 文檔](https://mswjs.io)

---

**🤖 AI 助手注意事項**:
- 嚴格遵循上述技術棧和規範
- 生成的代碼必須能直接運行
- 優先使用項目現有的組件和模式
- 確保類型安全和代碼質量
- 遵循既定的目錄結構和命名規範