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

## Pre-commit 測試配置

### 為什麼需要 Pre-commit 測試？

- ✅ **提早發現問題** - 在提交前就發現測試失敗
- ✅ **保持代碼質量** - 確保每次提交都通過測試
- ✅ **減少 CI 失敗** - 避免推送後才發現問題
- ✅ **提升團隊效率** - 減少來回修改的時間

---

### 方案 1: 使用 Husky + lint-staged（推薦）

專案已經安裝了 `husky` 和 `lint-staged`，我們可以擴展現有配置。

#### 步驟 1: 更新 package.json

```json
{
  "lint-staged": {
    "*.+(ts|tsx|jsx|js)": [
      "eslint --cache --fix",
      "vitest related --run --reporter=verbose"
    ],
    "*.+(ts|tsx|jsx|js|json|css|md|mdx|html)": "prettier --write"
  }
}
```

**說明：**
- `vitest related --run` - 只運行與修改文件相關的測試
- `--reporter=verbose` - 顯示詳細的測試結果

---

#### 步驟 2: 更新 .husky/pre-commit

**選項 A: 只運行相關測試（快速，推薦）**

```bash
#!/bin/sh
echo "🧪 pre-commit 開始執行"

# 取得已 staged 的 JS/TS 檔案
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' | xargs)

# Lint & fix
if [ -n "$STAGED_FILES" ]; then
  echo "🔍 正在自動修復 Lint 問題..."
  if ! pnpm exec eslint --fix $STAGED_FILES; then
    echo "❌ Lint 修復失敗，請修正後再提交！"
    exit 1
  fi
  git add $STAGED_FILES
fi

# 運行相關測試
echo "🧪 正在運行相關測試..."
if ! pnpm exec vitest related --run --reporter=verbose; then
  echo "❌ 測試失敗，請修正後再提交！"
  exit 1
fi

echo "✅ Lint 和測試通過，準備提交！"
```

**選項 B: 運行所有測試（較慢，更安全）**

```bash
#!/bin/sh
echo "🧪 pre-commit 開始執行"

# 取得已 staged 的 JS/TS 檔案
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' | xargs)

# Lint & fix
if [ -n "$STAGED_FILES" ]; then
  echo "🔍 正在自動修復 Lint 問題..."
  if ! pnpm exec eslint --fix $STAGED_FILES; then
    echo "❌ Lint 修復失敗，請修正後再提交！"
    exit 1
  fi
  git add $STAGED_FILES
fi

# 運行所有測試
echo "🧪 正在運行所有測試..."
if ! pnpm exec vitest run --reporter=verbose; then
  echo "❌ 測試失敗，請修正後再提交！"
  exit 1
fi

echo "✅ Lint 和測試通過，準備提交！"
```

**選項 C: 只測試 Jotai atoms（最快，針對性強）**

```bash
#!/bin/sh
echo "🧪 pre-commit 開始執行"

# 取得已 staged 的 JS/TS 檔案
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' | xargs)

# Lint & fix
if [ -n "$STAGED_FILES" ]; then
  echo "🔍 正在自動修復 Lint 問題..."
  if ! pnpm exec eslint --fix $STAGED_FILES; then
    echo "❌ Lint 修復失敗，請修正後再提交！"
    exit 1
  fi
  git add $STAGED_FILES
fi

# 檢查是否修改了 Jotai atoms
if echo "$STAGED_FILES" | grep -q "src/lib/jotai"; then
  echo "🧪 檢測到 Jotai atoms 修改，正在運行相關測試..."
  if ! pnpm exec vitest run src/lib/jotai --reporter=verbose; then
    echo "❌ Jotai atoms 測試失敗，請修正後再提交！"
    exit 1
  fi
fi

echo "✅ Lint 和測試通過，準備提交！"
```

---

### 方案 2: 使用 Git Hooks 手動配置

如果不想使用 Husky，可以直接編輯 `.git/hooks/pre-commit`：

```bash
#!/bin/sh

echo "🧪 Running pre-commit tests..."

# 運行測試
npm run test:run

if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Commit aborted."
  exit 1
fi

echo "✅ All tests passed!"
```

---

### Pre-commit 執行流程圖

```
git commit
    ↓
🧪 Pre-commit Hook 觸發
    ↓
🔍 Lint 檢查和自動修復
    ↓
    ├─ ✅ 通過 → 繼續
    └─ ❌ 失敗 → 中止提交
    ↓
🧪 運行測試
    ↓
    ├─ ✅ 通過 → 繼續
    └─ ❌ 失敗 → 中止提交
    ↓
✅ 提交成功
```

---

## 預期測試結果展示

### 成功案例

#### 1. 基礎 Atom 測試成功

```bash
$ pnpm exec vitest run src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts

 RUN  v2.1.8 /Users/jimmyliou/Documents/MAYO-PT-Web

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts (3) 45ms
   ✓ shiftScheduleAtom (3) 42ms
     ✓ 應該有正確的初始值 12ms
     ✓ 應該能夠更新狀態 8ms
     ✓ 應該保持不可變性 22ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  14:30:25
   Duration  234ms (transform 45ms, setup 0ms, collect 89ms, tests 45ms, environment 55ms, prepare 0ms)

 PASS  Waiting for file changes...
```

---

#### 2. 切換檢視模式測試成功

```bash
$ pnpm exec vitest run src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts

 RUN  v2.1.8 /Users/jimmyliou/Documents/MAYO-PT-Web

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts (4) 38ms
   ✓ toggleViewModeAtom (4) 35ms
     ✓ 應該從 VIEW 切換到 EDIT 8ms
     ✓ 應該從 EDIT 切換到 VIEW 7ms
     ✓ 切換模式時應該清空選中的班次 10ms
     ✓ 應該能夠連續切換多次 10ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  14:32:18
   Duration  189ms (transform 38ms, setup 0ms, collect 76ms, tests 38ms, environment 37ms, prepare 0ms)

 PASS  Waiting for file changes...
```

---

#### 3. 員工操作測試成功（完整版）

```bash
$ pnpm exec vitest run src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts

 RUN  v2.1.8 /Users/jimmyliou/Documents/MAYO-PT-Web

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25) 156ms
   ✓ 員工列表操作 (25) 152ms
     ✓ addSelectedEmployeeAtom (5) 45ms
       ✓ 應該能夠添加員工 8ms
       ✓ 應該能夠添加多個員工 10ms
       ✓ 不應該添加重複的員工 7ms
       ✓ 應該基於 employeeId 判斷重複 9ms
       ✓ 應該保持添加順序 11ms
     ✓ removeSelectedEmployeeAtom (5) 38ms
       ✓ 應該能夠移除員工 7ms
       ✓ 移除不存在的員工不應該報錯 6ms
       ✓ 應該能夠移除所有員工 9ms
       ✓ 應該能夠移除中間的員工 8ms
       ✓ 從空列表移除員工不應該報錯 8ms
     ✓ setSelectedEmployeesAtom (4) 28ms
       ✓ 應該能夠直接設置員工列表 6ms
       ✓ 應該能夠替換現有的員工列表 7ms
       ✓ 應該能夠設置空列表 7ms
       ✓ 應該保持設置的順序 8ms
     ✓ clearSelectedEmployeesAtom (3) 21ms
       ✓ 應該能夠清空員工列表 6ms
       ✓ 清空空列表不應該報錯 7ms
       ✓ 清空後應該能夠重新添加員工 8ms
     ✓ 複雜操作場景 (4) 20ms
       ✓ 應該能夠處理添加、移除、清空的組合操作 5ms
       ✓ 應該保持不可變性 5ms
       ✓ 應該能夠處理大量操作 5ms
       ✓ 應該正確處理狀態隔離 5ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  14:35:12
   Duration  312ms (transform 52ms, setup 0ms, collect 104ms, tests 156ms, environment 0ms, prepare 0ms)

 PASS  Waiting for file changes...
```

---

#### 4. 所有測試成功（彙總）

```bash
$ pnpm exec vitest run

 RUN  v2.1.8 /Users/jimmyliou/Documents/MAYO-PT-Web

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts (3) 45ms
 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts (4) 38ms
 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25) 156ms

 Test Files  3 passed (3)
      Tests  32 passed (32)
   Start at  14:40:25
   Duration  567ms (transform 135ms, setup 0ms, collect 269ms, tests 239ms, environment 92ms, prepare 32ms)

 PASS  Waiting for file changes...
```

---

### 失敗案例

#### 1. 測試失敗範例

```bash
$ pnpm exec vitest run

 RUN  v2.1.8 /Users/jimmyliou/Documents/MAYO-PT-Web

 ❯ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25) 156ms
   ❯ 員工列表操作 (25) 152ms
     ❯ addSelectedEmployeeAtom (5) 45ms
       × 應該能夠添加員工 8ms
       ✓ 應該能夠添加多個員工 10ms
       ✓ 不應該添加重複的員工 7ms
       ✓ 應該基於 employeeId 判斷重複 9ms
       ✓ 應該保持添加順序 11ms

 ❯ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts > 員工列表操作 > addSelectedEmployeeAtom > 應該能夠添加員工

AssertionError: expected 0 to be 1 // Object.is equality

- Expected
+ Received

- 1
+ 0

 ❯ employeeOperations.test.ts:48:28
     46|       store.set(addSelectedEmployeeAtom, mockEmployee1);
     47|
     48|       const employees = store.get(selectedEmployeesAtom);
       |                            ^
     49|       expect(employees).toHaveLength(1);
     50|       expect(employees[0]).toEqual(mockEmployee1);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 Test Files  1 failed (1)
      Tests  1 failed | 24 passed (25)
   Start at  14:42:15
   Duration  423ms

 FAIL  Tests failed. See above for more information.
```

---

#### 2. Pre-commit 測試失敗

```bash
$ git commit -m "feat: 添加員工功能"

🧪 pre-commit 開始執行
🔍 正在自動修復 Lint 問題...
✅ Lint 通過

🧪 正在運行相關測試...

 RUN  v2.1.8 /Users/jimmyliou/Documents/MAYO-PT-Web

 ❯ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25)
   ❯ 員工列表操作 (25)
     ❯ addSelectedEmployeeAtom (5)
       × 應該能夠添加員工

AssertionError: expected 0 to be 1

 Test Files  1 failed (1)
      Tests  1 failed | 24 passed (25)

❌ 測試失敗，請修正後再提交！
```

**提交被中止，需要修正測試後才能提交。**

---

### 覆蓋率報告展示

```bash
$ pnpm exec vitest run --coverage

 RUN  v2.1.8 /Users/jimmyliou/Documents/MAYO-PT-Web

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts (3)
 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts (4)
 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25)

 Test Files  3 passed (3)
      Tests  32 passed (32)
   Start at  14:45:30
   Duration  892ms

 % Coverage report from v8
-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |   92.85 |    87.50 |  100.00 |   92.85 |
 shiftScheduleApproval         |   92.85 |    87.50 |  100.00 |   92.85 |
  index.ts                     |   92.85 |    87.50 |  100.00 |   92.85 | 75-76,110-112
  type.ts                      |  100.00 |   100.00 |  100.00 |  100.00 |
-------------------------------|---------|----------|---------|---------|-------------------

✅ 測試覆蓋率達標！
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

## Pre-commit 測試最佳實踐

### 1. 選擇合適的測試策略

| 策略 | 速度 | 安全性 | 適用場景 |
|------|------|--------|----------|
| **只運行相關測試** | ⚡⚡⚡ 快 | ⭐⭐ 中 | 日常開發 |
| **只測試 Jotai atoms** | ⚡⚡ 較快 | ⭐⭐⭐ 高 | Atoms 修改 |
| **運行所有測試** | ⚡ 慢 | ⭐⭐⭐⭐⭐ 最高 | 重要提交 |

**建議：**
- 日常開發：使用「只運行相關測試」
- 修改 Atoms：使用「只測試 Jotai atoms」
- 發布前：使用「運行所有測試」

---

### 2. 跳過 Pre-commit 測試（緊急情況）

```bash
# 跳過 pre-commit hook（不推薦）
git commit --no-verify -m "緊急修復"

# 或使用簡寫
git commit -n -m "緊急修復"
```

⚠️ **警告：** 只在緊急情況下使用，並確保之後補上測試！

---

### 3. 優化測試速度

#### 使用 Vitest 的並行執行

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run --threads",
    "test:related": "vitest related --run --threads"
  }
}
```

#### 使用測試快取

Vitest 會自動快取測試結果，只重新運行修改過的測試。

---

### 4. 監控測試性能

```bash
# 顯示測試執行時間
pnpm exec vitest run --reporter=verbose

# 生成性能報告
pnpm exec vitest run --reporter=json --outputFile=test-results.json
```

---

## 常見問題（FAQ）

### Q1: Pre-commit 測試太慢怎麼辦？

**A:** 有幾個優化方案：

1. **只運行相關測試**
```bash
vitest related --run
```

2. **使用並行執行**
```bash
vitest run --threads
```

3. **只測試修改的模組**
```bash
# 在 pre-commit 中
if echo "$STAGED_FILES" | grep -q "src/lib/jotai"; then
  vitest run src/lib/jotai
fi
```

---

### Q2: 如何在 pre-commit 中顯示更詳細的錯誤信息？

**A:** 使用 `--reporter=verbose` 選項：

```bash
pnpm exec vitest run --reporter=verbose
```

---

### Q3: 測試失敗但我確定代碼沒問題，怎麼辦？

**A:** 檢查以下幾點：

1. **確認測試是否過時**
```bash
# 查看測試文件
cat src/lib/jotai/shiftScheduleApproval/__tests__/*.test.ts
```

2. **更新測試快照**（如果使用快照測試）
```bash
vitest run -u
```

3. **清除測試快取**
```bash
vitest run --clearCache
```

---

### Q4: 如何暫時禁用某個測試？

**A:** 使用 `it.skip` 或 `describe.skip`：

```tsx
// 跳過單個測試
it.skip('這個測試暫時跳過', () => {
  // ...
});

// 跳過整個測試組
describe.skip('這組測試暫時跳過', () => {
  // ...
});
```

---

### Q5: Pre-commit 測試通過了，但 CI 失敗了？

**A:** 可能的原因：

1. **環境差異** - 本地和 CI 環境不同
2. **依賴版本** - 使用 `npm ci` 而不是 `npm install`
3. **時區問題** - 測試中使用了時間相關的邏輯
4. **並行測試** - CI 可能使用不同的並行策略

**解決方案：**
```bash
# 本地模擬 CI 環境
rm -rf node_modules
npm ci
npm run test:run
```

---

## 測試報告範例

### 1. 簡潔報告（default）

```bash
$ pnpm test

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts (3)
 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts (4)
 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25)

Test Files  3 passed (3)
     Tests  32 passed (32)
  Duration  567ms
```

---

### 2. 詳細報告（verbose）

```bash
$ pnpm exec vitest run --reporter=verbose

 RUN  v2.1.8

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts (3) 45ms
   ✓ shiftScheduleAtom (3) 42ms
     ✓ 應該有正確的初始值 12ms
     ✓ 應該能夠更新狀態 8ms
     ✓ 應該保持不可變性 22ms

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/toggleViewMode.test.ts (4) 38ms
   ✓ toggleViewModeAtom (4) 35ms
     ✓ 應該從 VIEW 切換到 EDIT 8ms
     ✓ 應該從 EDIT 切換到 VIEW 7ms
     ✓ 切換模式時應該清空選中的班次 10ms
     ✓ 應該能夠連續切換多次 10ms

 ✓ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25) 156ms
   ✓ 員工列表操作 (25) 152ms
     ✓ addSelectedEmployeeAtom (5) 45ms
       ✓ 應該能夠添加員工 8ms
       ✓ 應該能夠添加多個員工 10ms
       ✓ 不應該添加重複的員工 7ms
       ✓ 應該基於 employeeId 判斷重複 9ms
       ✓ 應該保持添加順序 11ms
     ✓ removeSelectedEmployeeAtom (5) 38ms
       ✓ 應該能夠移除員工 7ms
       ✓ 移除不存在的員工不應該報錯 6ms
       ✓ 應該能夠移除所有員工 9ms
       ✓ 應該能夠移除中間的員工 8ms
       ✓ 從空列表移除員工不應該報錯 8ms
     ✓ setSelectedEmployeesAtom (4) 28ms
       ✓ 應該能夠直接設置員工列表 6ms
       ✓ 應該能夠替換現有的員工列表 7ms
       ✓ 應該能夠設置空列表 7ms
       ✓ 應該保持設置的順序 8ms
     ✓ clearSelectedEmployeesAtom (3) 21ms
       ✓ 應該能夠清空員工列表 6ms
       ✓ 清空空列表不應該報錯 7ms
       ✓ 清空後應該能夠重新添加員工 8ms
     ✓ 複雜操作場景 (4) 20ms
       ✓ 應該能夠處理添加、移除、清空的組合操作 5ms
       ✓ 應該保持不可變性 5ms
       ✓ 應該能夠處理大量操作 5ms
       ✓ 應該正確處理狀態隔離 5ms

Test Files  3 passed (3)
     Tests  32 passed (32)
  Start at  14:40:25
  Duration  567ms (transform 135ms, setup 0ms, collect 269ms, tests 239ms)
```

---

### 3. JSON 報告（用於 CI）

```bash
$ pnpm exec vitest run --reporter=json --outputFile=test-results.json
```

**輸出文件 `test-results.json`：**
```json
{
  "numTotalTestSuites": 3,
  "numPassedTestSuites": 3,
  "numFailedTestSuites": 0,
  "numTotalTests": 32,
  "numPassedTests": 32,
  "numFailedTests": 0,
  "testResults": [
    {
      "name": "src/lib/jotai/shiftScheduleApproval/__tests__/shiftScheduleAtom.test.ts",
      "status": "passed",
      "duration": 45,
      "assertionResults": [...]
    }
  ]
}
```

---

## 下一步

### 立即行動清單

- [ ] 1. 安裝測試依賴
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
```

- [ ] 2. 配置 Vitest
```bash
# 創建 vitest.config.ts 和 src/test/setup.ts
```

- [ ] 3. 更新 Pre-commit Hook
```bash
# 編輯 .husky/pre-commit
```

- [ ] 4. 創建測試文件
```bash
mkdir -p src/lib/jotai/shiftScheduleApproval/__tests__
```

- [ ] 5. 運行測試
```bash
npm test
```

- [ ] 6. 查看覆蓋率報告
```bash
npm run test:coverage
```

- [ ] 7. 設置 CI/CD
```bash
# 創建 .github/workflows/test.yml
```

---

### 推薦的工作流程

```
1. 開發功能
   ↓
2. 編寫測試
   ↓
3. 本地運行測試
   npm test
   ↓
4. 提交代碼
   git commit
   ↓
5. Pre-commit 自動測試
   ✅ 通過 → 提交成功
   ❌ 失敗 → 修正後重試
   ↓
6. 推送到遠端
   git push
   ↓
7. CI 自動測試
   ✅ 通過 → 可以合併
   ❌ 失敗 → 修正後重推
```

---

## 總結

### ✅ Pre-commit 測試的好處

1. **提早發現問題** - 在提交前就發現測試失敗
2. **保持代碼質量** - 確保每次提交都通過測試
3. **減少 CI 失敗** - 避免推送後才發現問題
4. **提升團隊效率** - 減少來回修改的時間
5. **強制測試習慣** - 養成先測試後提交的習慣

### 📊 預期效果

| 指標 | 改進前 | 改進後 | 提升幅度 |
|------|--------|--------|----------|
| CI 失敗率 | 30% | 5% | -83% |
| 修復時間 | 30 分鐘 | 5 分鐘 | -83% |
| 代碼質量 | 中等 | 優秀 | +60% |
| 團隊信心 | 中等 | 高 | +50% |

---

**相關文件：**
- [jotai-immer-refactoring-guide.md](./jotai-immer-refactoring-guide.md) - 重構指南
- [jotai-immer-employee-tests.md](./jotai-immer-employee-tests.md) - 員工操作測試

**最後更新：** 2025-10-14
**維護者：** MAYO-PT-Web 團隊
**版本：** v1.0

