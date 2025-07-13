---
title: AI RD Building Prompt
description: AI構建專案提示詞模板
tags: [Prompt, AI]
published: 2025-07-09
draft: false
---
# 前端專案 AI 構建提示詞模板

## 📝 專案概述

**專案名稱**: [專案名稱]  
**專案類型**: 現代化前端 SPA 應用  
**開發模式**: React + TypeScript + Vite  
**目標用戶**: [根據具體需求定義]

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
  "ui_library": "shadcn/ui (Radix UI + Tailwind CSS)",
  "css_framework": "Tailwind CSS 3.4.17",
  "radix_components": "@radix-ui/react-* (按需安裝)",
  "icons": "lucide-react ^0.525.0",
  "animations": "tailwindcss-animate",
  "utilities": ["class-variance-authority", "clsx", "tailwind-merge"]
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
  "dnd": "@dnd-kit/core ^6.3.1"
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
├── components/           # 可重用組件
│   ├── ui/              # shadcn/ui 組件 (自動生成)
│   │   ├── button.tsx   # 按鈕組件
│   │   ├── card.tsx     # 卡片組件
│   │   ├── input.tsx    # 輸入框組件
│   │   └── ...          # 其他 UI 組件
│   ├── layout/          # 佈局組件
│   │   ├── index.tsx    # 主Layout
│   │   └── sidebar/     # 側邊欄組件
│   └── feature/         # 業務組件
├── lib/                 # 工具庫配置
│   ├── utils.ts         # shadcn/ui 工具函數
│   └── validations.ts   # Zod 驗證schemas
├── hooks/               # 自定義Hooks
│   └── api/             # API相關hooks
├── pages/               # 頁面組件
├── routes/              # 路由配置
│   └── index.tsx        # 主路由配置
├── providers/           # Context Providers
│   └── QueryProvider.tsx # React Query Provider
├── mocks/               # MSW Mock配置
├── types/               # TypeScript類型定義
├── utils/               # 工具函數
├── assets/              # 靜態資源
└── styles/              # 全局樣式
    └── globals.css      # Tailwind 全局樣式
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
      { path: 'dashboard', element: <DashboardPage /> },
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
const DashboardHeader = () => {};

// ✅ 文件名：camelCase.tsx
// userCard.tsx
// dashboardHeader.tsx

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
    <Card className="user-card">
      {/* JSX內容 */}
    </Card>
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

#### shadcn/ui + Tailwind CSS 使用
```tsx
// ✅ 優先使用 shadcn/ui 組件
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ✅ 使用 Tailwind 進行自定義樣式
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <Button variant="default" size="md">
    提交
  </Button>
</div>
```

## 🔧 開發約束

### 必須使用
- ✅ 函數組件 + Hooks（禁止類組件）
- ✅ shadcn/ui 組件庫優先
- ✅ TypeScript 嚴格模式
- ✅ pnpm 包管理
- ✅ ESLint + Prettier 代碼檢查
- ✅ Radix UI 無障礙性原語

### 禁止使用
- ❌ any 類型
- ❌ 類組件
- ❌ 直接 DOM 操作
- ❌ 內聯樣式（除非必要）
- ❌ 未聲明的依賴

## 📋 開發流程

### 初始化專案
```bash
# 1. 創建 Vite + React + TypeScript 專案
pnpm create vite@latest my-app -- --template react-ts
cd my-app
pnpm install

# 2. 安裝 Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer @tailwindcss/vite
pnpm add -D @types/node

# 3. 配置 Tailwind CSS (src/index.css)
# @import "tailwindcss";

# 4. 配置路徑別名 (vite.config.ts)
# 添加 path resolve 配置

# 5. 初始化 shadcn/ui
pnpm dlx shadcn@latest init

# 6. 添加基礎組件
pnpm dlx shadcn@latest add button card input form
```

### 添加新組件
```bash
# 1. 添加 shadcn/ui 組件
pnpm dlx shadcn@latest add [component-name]

# 2. 組件自動添加到 src/components/ui/
# 3. 可直接在專案中使用和自定義
```

### 創建新頁面
```bash
# 1. 創建頁面組件
src/pages/NewPage.tsx

# 2. 創建路由配置  
src/routes/newPageRoute.tsx

# 3. 更新主路由
src/routes/index.tsx
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

### shadcn/ui 配置
```json
// components.json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Tailwind CSS 配置
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

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

## 🎯 AI 助手指導原則

### 代碼生成原則
1. **組件優先級**: shadcn/ui 組件 > 組合現有組件 > 創建新組件
2. **類型安全**: 所有代碼必須有完整的TypeScript類型
3. **路由一致性**: 新頁面必須遵循現有路由模式  
4. **樣式一致性**: 優先使用Tailwind CSS類名
5. **無障礙性**: 使用 Radix UI 確保組件可訪問性
6. **狀態管理**: 客戶端狀態用Jotai，服務端狀態用React Query

### 常見開發場景

#### 場景1: 創建表單頁面
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const FormPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: FormData) => {
    // 處理提交邏輯
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>表單標題</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">提交</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
```

#### 場景2: 整合API數據
```typescript
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{user.email}</p>
            <Button variant="outline" size="sm">
              編輯
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

#### 場景3: 響應式佈局
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>統計1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,234</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>統計2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5,678</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>操作</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">新增項目</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

## 📚 參考資源

- [shadcn/ui 官方文檔](https://ui.shadcn.com/)
- [Radix UI 文檔](https://radix-ui.com/)
- [React Query 文檔](https://tanstack.com/query)
- [Jotai 文檔](https://jotai.org)
- [React Router v6](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [MSW 文檔](https://mswjs.io)

---

**🤖 AI 助手注意事項**:
- 嚴格遵循上述技術棧和規範
- 生成的代碼必須能直接運行
- 優先使用 shadcn/ui 組件和模式
- 確保類型安全和代碼質量
- 遵循既定的目錄結構和命名規範
- 重視無障礙性和用戶體驗
- 使用複製粘貼模式管理 UI 組件 