# 開發指南

## 專案概述
- **目的**: Mayo PT Web是一個用於排班系統的Web界面實現。
- **技術棧**: React 18 + TypeScript + Vite + React Router v6 + @mayo/mayo-ui + Tailwind CSS 4
- **包管理**: 使用pnpm作為包管理工具，版本為10.10.0

## 專案架構
- **目錄結構**:
  - `/src`: 源代碼目錄
    - `App.tsx`: 應用程序入口點和路由配置
    - `layout.tsx`: 應用程序整體佈局
    - `main.tsx`: React應用掛載點
    - `pages/`: 頁面組件目錄
    - `assets/`: 靜態資源目錄
    - `styles.css`: 全局樣式
  - 配置文件位於根目錄，包括`vite.config.ts`、`tsconfig.json`等

## 代碼規範
- **命名規則**:
  - 組件使用PascalCase: `Layout`、`Button`
  - 變量和函數使用camelCase: `menuData`、`handleClick`
  - 常量使用UPPER_SNAKE_CASE: `MAX_ITEMS`、`API_URL`

- **TypeScript規範**:
  - 必須為組件屬性定義清晰的接口或類型
  - 禁止使用`any`類型，優先使用具體類型或`unknown`
  - 強制使用類型安全的方法處理事件和狀態

- **文件組織**:
  - 組件文件使用`.tsx`擴展名
  - 非組件TypeScript文件使用`.ts`擴展名
  - 每個文件應只包含一個主要組件

## 功能實現標準
- **組件開發**:
  - 必須使用函數組件和Hooks，禁止使用類組件
  - 組件應有明確的職責，避免過大的組件
  - 公共組件應設計為可重用
  
- **路由管理**:
  - 路由定義集中在App.tsx
  - 使用`createBrowserRouter`創建路由
  - 所有頁面路由應為Layout的子路由

- **狀態管理**:
  - 本地狀態使用useState和useReducer
  - 跨組件狀態可能用到Context API或第三方庫

## 第三方庫使用規範
- **@mayo/mayo-ui**:
  - 優先使用該庫中的組件
  - 導入時使用解構語法
  - 確保導入所需的CSS：`import '@mayo/mayo-ui/dist/index.css'`
  
- **React Router**:
  - 遵循v6版本的API規範
  - 使用hook函數如`useNavigate`、`useParams`進行路由操作
  
- **Tailwind CSS**:
  - 優先使用Tailwind類名進行樣式設計
  - 遵循Tailwind的設計理念
  - 避免創建大量自定義CSS

## 工作流規範
- **開發命令**:
  - 啟動開發服務器: `pnpm dev`
  - 構建生產版本: `pnpm build`
  - 代碼檢查: `pnpm lint`
  
- **常見流程**:
  - 創建新頁面流程（見下文關鍵文件交互規範）
  - 添加新功能時，確保編寫適當的類型定義
  - 提交前運行lint檢查確保代碼質量

## 關鍵文件交互規範
- **創建新頁面的完整流程**:
  1. 在`src/pages/`目錄下創建新的頁面組件
  2. 在`App.tsx`中添加新的路由配置
  3. 在`layout.tsx`中更新側邊欄菜單配置（如需要）
  
- **修改路由時**:
  - 確保App.tsx和layout.tsx保持同步
  - 更新layout.tsx中的`matchPath`屬性以匹配新路由
  
- **添加新依賴時**:
  - 確保在package.json中正確聲明
  - 考慮依賴的兼容性和影響

## AI決策標準
- **組件選擇決策樹**:
  1. 檢查@mayo/mayo-ui是否已有合適組件
  2. 如有，直接使用該組件
  3. 如無，檢查是否可以組合現有組件實現
  4. 如仍無法實現，再考慮創建新組件
  
- **樣式處理優先級**:
  1. Tailwind CSS類
  2. @mayo/mayo-ui組件自帶樣式
  3. 全局styles.css中的樣式
  4. 最後才考慮內聯樣式（儘量避免）
  
- **路由管理決策**:
  1. 遵循現有路由模式
  2. 確保與佈局系統兼容
  3. 保持URL結構一致性

## 禁止行為
- **禁止**使用CSS-in-JS或過多內聯樣式
- **禁止**使用類組件，應使用函數組件和Hooks
- **禁止**直接修改DOM，應通過React的方式管理UI
- **禁止**使用未在package.json中聲明的第三方庫
- **禁止**創建不遵循專案命名規範的文件或組件
- **禁止**忽略TypeScript類型錯誤或過度使用類型斷言

## 代碼示例
### 正確的組件定義方式
```tsx
// 正確定義接口
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

// 正確的組件實現
export function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {text}
    </button>
  );
}
```

### 錯誤的組件定義方式
```tsx
// 錯誤：使用any類型
function Button(props: any) {
  return (
    <button 
      onClick={props.onClick}
      disabled={props.disabled}
      style={{ backgroundColor: 'blue', color: 'white' }} // 錯誤：使用內聯樣式而非Tailwind
    >
      {props.text}
    </button>
  );
}
```

### 正確的頁面創建流程
```tsx
// 1. 創建頁面組件 src/pages/NewPage.tsx
export default function NewPage() {
  return <div>新頁面內容</div>;
}

// 2. 更新App.tsx中的路由
import NewPage from './pages/NewPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ...其他路由
      {
        path: "new-page",
        element: <NewPage />,
      },
    ],
  },
]);

// 3. 更新layout.tsx中的菜單
const menuData = [
  // ...其他菜單項
  {
    title: '測試菜單',
    key: 'test',
    items: [
      {
        title: '新頁面',
        matchPath: '/new-page',
        onMenuClick: () => {
          navigate('/new-page');
        },
      },
    ],
  },
];
```