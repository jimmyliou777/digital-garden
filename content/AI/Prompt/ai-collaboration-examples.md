---
title: AI 協作實戰範例
description: AI 協作實戰範例
tags: [Prompt, AI, Integration]
published: 2025-07-13
draft: false
---
# AI 協作實戰範例

## 範例 1: 新增員工管理功能

### 開發者提示

```markdown
我需要新增一個員工詳情頁面，要求：
1. 顯示員工基本資訊
2. 可以編輯員工資料
3. 支援頭像上傳
4. 整合現有的員工 API

請按照專案現有模式實現。
```

### AI 回應策略

1. **分析現有模式**: 檢查 `src/hooks/api/useEmployees.ts` 和相關組件
2. **設計型別**: 基於現有 `Employee` 型別擴展
3. **實現 Hook**: 遵循 `useEmployee` 模式
4. **建立組件**: 使用 @mayo/mayo-ui-beta 組件
5. **配置路由**: 按照現有路由模式

### 實際輸出範例

```typescript
// 1. 型別定義 (src/types/interface/employee.ts)
export interface EmployeeDetail extends Employee {
  avatar?: string;
  bio?: string;
  skills: string[];
}

// 2. API Hook (src/hooks/api/useEmployeeDetail.ts)
export const useEmployeeDetail = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeAPI.getEmployeeDetail(id),
    enabled: !!id,
  });
};

// 3. 頁面組件 (src/pages/EmployeeDetailPage.tsx)
// [完整組件實現]
```

## 範例 2: 效能優化諮詢

### 開發者提示

```markdown
我的排班時間軸組件渲染很慢，有 1000+ 個時間項目。
請分析並提供優化建議。

[貼上組件程式碼]
```

### AI 分析流程

1. **識別效能瓶頸**: 檢查渲染邏輯、狀態更新
2. **參考專案模式**: 查看是否已使用 react-window
3. **提供具體方案**: 基於專案現有工具
4. **保持一致性**: 確保優化方案符合專案架構

### 優化建議範例

```typescript
// 使用專案中已有的 react-window
import { FixedSizeList as List } from 'react-window';

// 結合 Jotai 的記憶化選擇器
const visibleTimelineItemsAtom = atom((get) => {
  const items = get(timelineItemsAtom);
  const selectedEmployees = get(selectedEmployeeAtom);

  return useMemo(() =>
    items.filter(item =>
      selectedEmployees.length === 0 ||
      selectedEmployees.includes(item.employeeId)
    ), [items, selectedEmployees]
  );
});
```

## 範例 3: 程式碼審查

### 開發者提交

```typescript
// 新的表單組件
const EmployeeForm = ({ employee, onSubmit }: any) => {
  const [formData, setFormData] = useState(employee);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
    </form>
  );
};
```

### AI 審查回饋

#### 問題識別

1. 使用了 any 型別 (違反專案規範)
2. 沒有使用 React Hook Form (專案標準)
3. 沒有型別安全的表單驗證
4. 沒有使用 @mayo/mayo-ui-beta 組件

#### 改善建議

```typescript
interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: EmployeeFormData) => void;
}

const EmployeeForm: FC<EmployeeFormProps> = ({ employee, onSubmit }) => {
  const { control, handleSubmit } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employee,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input {...field} label="姓名" />
        )}
      />
    </form>
  );
};
```

## 最佳實踐總結

### 有效提示的要素

1. **明確的上下文**: 說明當前工作的模組和功能
2. **具體的需求**: 詳細描述期望的行為和約束
3. **參考現有模式**: 指出希望遵循的現有實現
4. **品質要求**: 明確型別安全、效能、可維護性要求

### 迭代改善流程

1. **初始實現**: AI 提供基於專案模式的實現
2. **開發者回饋**: 指出不符合預期的部分
3. **精細調整**: AI 根據回饋調整實現
4. **最終確認**: 確保符合所有專案標準

### 協作效率提升技巧

- 建立專案特定的提示模板庫
- 定期更新 AI 上下文資訊
- 記錄成功的協作模式
- 分享團隊最佳實踐
