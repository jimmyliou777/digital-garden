---
title: ShiftScheduleAtom 測試實作指南
description: 針對 Jotai + Immer 狀態管理的完整測試實作指南，包含 Vitest 設置與測試案例
tags: [Jotai, Immer, 測試, Vitest, React, 狀態管理]
published: 2025-10-14
draft: false
---

# ShiftScheduleAtom 測試實作指南

> **文件版本：** v1.0
> **建立日期：** 2025-10-14
> **相關文件：** [jotai-immer-refactoring-guide.md](./jotai-immer-refactoring-guide.md)

---

## 📋 目錄

1. [測試環境設置](#測試環境設置)
2. [測試案例](#測試案例)
3. [運行測試](#運行測試)
4. [測試覆蓋率](#測試覆蓋率)

---

## 測試環境設置

### 方案 1: 使用 Vitest（推薦）

**為什麼選擇 Vitest？**
- ✅ 與 Vite 完美整合（專案已使用 Vite）
- ✅ 快速執行（使用 ESM）
- ✅ 與 Jest API 兼容
- ✅ 內建 TypeScript 支援
- ✅ 優秀的 UI 模式

#### 安裝依賴

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
```

#### 配置文件

**創建 `vitest.config.ts`：**

```tsx
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.test.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**創建 `src/test/setup.ts`：**

```tsx
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 擴展 expect 匹配器
expect.extend(matchers);

// 每個測試後清理
afterEach(() => {
  cleanup();
});
```

#### 更新 package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

---

## 測試案例

### 測試案例 1: 基礎 Atom 測試

**文件：** `src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts`

```tsx
import { describe, it, expect } from 'vitest';
import { createStore } from 'jotai';
import { shiftScheduleAtom } from '../index';
import { ViewModeEnum } from '../type';

describe('shiftScheduleAtom', () => {
  it('應該有正確的初始值', () => {
    const store = createStore();
    const initialValue = store.get(shiftScheduleAtom);

    expect(initialValue).toEqual({
      viewMode: ViewModeEnum.VIEW,
      shiftScheduleParams: undefined,
      selectedShift: undefined,
      selectedBadge: undefined,
      selectedEmployees: [],
    });
  });

  it('應該能夠更新狀態', () => {
    const store = createStore();

    // 使用 draft 模式更新
    store.set(shiftScheduleAtom, draft => {
      draft.viewMode = ViewModeEnum.EDIT;
    });

    const updatedValue = store.get(shiftScheduleAtom);
    expect(updatedValue.viewMode).toBe(ViewModeEnum.EDIT);
    
    // 其他屬性應該保持不變
    expect(updatedValue.selectedEmployees).toEqual([]);
    expect(updatedValue.selectedShift).toBeUndefined();
  });

  it('應該保持不可變性', () => {
    const store = createStore();
    const initialValue = store.get(shiftScheduleAtom);

    // 更新狀態
    store.set(shiftScheduleAtom, draft => {
      draft.viewMode = ViewModeEnum.EDIT;
    });

    const updatedValue = store.get(shiftScheduleAtom);

    // 應該是不同的對象引用
    expect(updatedValue).not.toBe(initialValue);
    
    // 但初始值不應該被修改
    expect(initialValue.viewMode).toBe(ViewModeEnum.VIEW);
  });
});
```

---

### 測試案例 2: 切換檢視模式測試

**文件：** `src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts`

```tsx
import { describe, it, expect } from 'vitest';
import { createStore } from 'jotai';
import { 
  shiftScheduleAtom, 
  toggleViewModeAtom,
  viewModeAtom,
} from '../index';
import { ViewModeEnum } from '../type';

describe('toggleViewModeAtom', () => {
  it('應該從 VIEW 切換到 EDIT', () => {
    const store = createStore();

    // 初始狀態應該是 VIEW
    expect(store.get(viewModeAtom)).toBe(ViewModeEnum.VIEW);

    // 切換模式
    store.set(toggleViewModeAtom);

    // 應該變成 EDIT
    expect(store.get(viewModeAtom)).toBe(ViewModeEnum.EDIT);
  });

  it('應該從 EDIT 切換到 VIEW', () => {
    const store = createStore();

    // 先設置為 EDIT
    store.set(shiftScheduleAtom, draft => {
      draft.viewMode = ViewModeEnum.EDIT;
    });

    // 切換模式
    store.set(toggleViewModeAtom);

    // 應該變成 VIEW
    expect(store.get(viewModeAtom)).toBe(ViewModeEnum.VIEW);
  });

  it('切換模式時應該清空選中的班次', () => {
    const store = createStore();

    // 設置選中的班次
    const mockShift = { id: 'shift-001', name: '早班' };
    store.set(shiftScheduleAtom, draft => {
      draft.selectedShift = mockShift as any;
    });

    // 切換模式
    store.set(toggleViewModeAtom);

    // 選中的班次應該被清空
    const state = store.get(shiftScheduleAtom);
    expect(state.selectedShift).toBeUndefined();
  });

  it('應該能夠連續切換多次', () => {
    const store = createStore();

    // 第一次切換：VIEW -> EDIT
    store.set(toggleViewModeAtom);
    expect(store.get(viewModeAtom)).toBe(ViewModeEnum.EDIT);

    // 第二次切換：EDIT -> VIEW
    store.set(toggleViewModeAtom);
    expect(store.get(viewModeAtom)).toBe(ViewModeEnum.VIEW);

    // 第三次切換：VIEW -> EDIT
    store.set(toggleViewModeAtom);
    expect(store.get(viewModeAtom)).toBe(ViewModeEnum.EDIT);
  });
});
```

---

### 測試案例 3: 員工列表操作測試（完整版）

**文件：** `src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts`

由於這個測試文件較長，我將在下一個文件中繼續...

---

## 運行測試

### 基本命令

```bash
# 運行所有測試（監聽模式）
npm test

# 運行所有測試（單次運行）
npm run test:run

# 運行特定測試文件
npm test shiftScheduleAtom.test

# 運行測試並生成覆蓋率報告
npm run test:coverage

# 使用 UI 模式運行測試
npm run test:ui
```

### 測試輸出範例

```
✓ src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts (3)
  ✓ shiftScheduleAtom (3)
    ✓ 應該有正確的初始值
    ✓ 應該能夠更新狀態
    ✓ 應該保持不可變性

✓ src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts (4)
  ✓ toggleViewModeAtom (4)
    ✓ 應該從 VIEW 切換到 EDIT
    ✓ 應該從 EDIT 切換到 VIEW
    ✓ 切換模式時應該清空選中的班次
    ✓ 應該能夠連續切換多次

Test Files  2 passed (2)
     Tests  7 passed (7)
  Start at  14:30:25
  Duration  234ms
```

---

## 測試覆蓋率

### 覆蓋率目標

| 類型 | 目標 | 說明 |
|------|------|------|
| **語句覆蓋率** | > 90% | 所有語句都應該被執行 |
| **分支覆蓋率** | > 85% | 所有條件分支都應該被測試 |
| **函數覆蓋率** | 100% | 所有 action atoms 都應該被測試 |
| **行覆蓋率** | > 90% | 所有代碼行都應該被執行 |

### 覆蓋率報告範例

```
File                                    | % Stmts | % Branch | % Funcs | % Lines |
----------------------------------------|---------|----------|---------|---------|
All files                               |   92.5  |   87.3   |  100.0  |   92.8  |
 shiftScheduleApproval                  |   92.5  |   87.3   |  100.0  |   92.8  |
  index.ts                              |   92.5  |   87.3   |  100.0  |   92.8  |
```

### 查看詳細覆蓋率報告

運行測試後，打開 `coverage/index.html` 查看詳細的覆蓋率報告。

---

## 測試最佳實踐

### 1. 測試命名規範

```tsx
// ✅ 好的命名
it('應該從 VIEW 切換到 EDIT', () => {});
it('添加重複員工時不應該增加列表長度', () => {});

// ❌ 不好的命名
it('test1', () => {});
it('works', () => {});
```

### 2. 使用 describe 分組

```tsx
describe('addSelectedEmployeeAtom', () => {
  it('應該能夠添加員工', () => {});
  it('不應該添加重複的員工', () => {});
});
```

### 3. 每個測試應該獨立

```tsx
// ✅ 好的做法
it('測試 A', () => {
  const store = createStore(); // 每個測試創建新的 store
  // ...
});

it('測試 B', () => {
  const store = createStore(); // 獨立的 store
  // ...
});
```

### 4. 使用清晰的斷言

```tsx
// ✅ 好的斷言
expect(employees).toHaveLength(1);
expect(employees[0].employeeId).toBe('emp-001');

// ❌ 不好的斷言
expect(employees.length === 1).toBe(true);
```

---

## 持續整合（CI）

### GitHub Actions 配置範例

**創建 `.github/workflows/test.yml`：**

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:run
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 下一步

1. ✅ 安裝測試依賴
2. ✅ 配置 Vitest
3. ✅ 創建測試文件
4. ✅ 運行測試
5. ✅ 查看覆蓋率報告
6. ✅ 設置 CI/CD

---

**相關文件：**
- [jotai-immer-refactoring-guide.md](./jotai-immer-refactoring-guide.md) - 重構指南
- [jotai-immer-employee-tests.md](./jotai-immer-employee-tests.md) - 員工操作測試（下一個文件）

