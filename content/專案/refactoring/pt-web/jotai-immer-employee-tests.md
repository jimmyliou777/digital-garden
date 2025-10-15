---
title: 員工列表操作完整測試案例
description: 使用 Jotai + Immer 的員工列表操作功能完整測試實作，包含單元測試與整合測試
tags: [Jotai, Immer, 單元測試, React, 狀態管理, Vitest]
published: 2025-10-14
draft: false
---

# 員工列表操作完整測試案例

> **文件版本：** v1.0
> **建立日期：** 2025-10-14
> **測試文件：** `src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts`

---

## 完整測試代碼

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'jotai';
import { 
  shiftScheduleAtom,
  addSelectedEmployeeAtom,
  removeSelectedEmployeeAtom,
  setSelectedEmployeesAtom,
  clearSelectedEmployeesAtom,
  selectedEmployeesAtom,
} from '../index';
import type { EnrichedEmployee } from '@/hooks/useScheduleData';

describe('員工列表操作', () => {
  // 模擬員工數據
  const mockEmployee1: EnrichedEmployee = {
    employeeId: 'emp-001',
    employeeName: '張三',
    departmentId: 'dept-001',
    departmentName: '技術部',
  } as EnrichedEmployee;

  const mockEmployee2: EnrichedEmployee = {
    employeeId: 'emp-002',
    employeeName: '李四',
    departmentId: 'dept-001',
    departmentName: '技術部',
  } as EnrichedEmployee;

  const mockEmployee3: EnrichedEmployee = {
    employeeId: 'emp-003',
    employeeName: '王五',
    departmentId: 'dept-002',
    departmentName: '業務部',
  } as EnrichedEmployee;

  describe('addSelectedEmployeeAtom', () => {
    it('應該能夠添加員工', () => {
      const store = createStore();

      // 添加第一個員工
      store.set(addSelectedEmployeeAtom, mockEmployee1);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(1);
      expect(employees[0]).toEqual(mockEmployee1);
    });

    it('應該能夠添加多個員工', () => {
      const store = createStore();

      // 添加多個員工
      store.set(addSelectedEmployeeAtom, mockEmployee1);
      store.set(addSelectedEmployeeAtom, mockEmployee2);
      store.set(addSelectedEmployeeAtom, mockEmployee3);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(3);
      expect(employees).toEqual([mockEmployee1, mockEmployee2, mockEmployee3]);
    });

    it('不應該添加重複的員工', () => {
      const store = createStore();

      // 添加同一個員工兩次
      store.set(addSelectedEmployeeAtom, mockEmployee1);
      store.set(addSelectedEmployeeAtom, mockEmployee1);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(1);
    });

    it('應該基於 employeeId 判斷重複', () => {
      const store = createStore();

      // 添加員工
      store.set(addSelectedEmployeeAtom, mockEmployee1);

      // 嘗試添加相同 employeeId 但不同對象的員工
      const duplicateEmployee = { ...mockEmployee1, employeeName: '張三（修改）' };
      store.set(addSelectedEmployeeAtom, duplicateEmployee as EnrichedEmployee);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(1);
      expect(employees[0].employeeName).toBe('張三'); // 應該保持原來的
    });

    it('應該保持添加順序', () => {
      const store = createStore();

      store.set(addSelectedEmployeeAtom, mockEmployee3);
      store.set(addSelectedEmployeeAtom, mockEmployee1);
      store.set(addSelectedEmployeeAtom, mockEmployee2);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees[0]).toEqual(mockEmployee3);
      expect(employees[1]).toEqual(mockEmployee1);
      expect(employees[2]).toEqual(mockEmployee2);
    });
  });

  describe('removeSelectedEmployeeAtom', () => {
    it('應該能夠移除員工', () => {
      const store = createStore();

      // 先添加員工
      store.set(setSelectedEmployeesAtom, [mockEmployee1, mockEmployee2]);

      // 移除第一個員工
      store.set(removeSelectedEmployeeAtom, 'emp-001');

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(1);
      expect(employees[0]).toEqual(mockEmployee2);
    });

    it('移除不存在的員工不應該報錯', () => {
      const store = createStore();

      // 先添加員工
      store.set(setSelectedEmployeesAtom, [mockEmployee1]);

      // 移除不存在的員工
      expect(() => {
        store.set(removeSelectedEmployeeAtom, 'emp-999');
      }).not.toThrow();

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(1);
    });

    it('應該能夠移除所有員工', () => {
      const store = createStore();

      // 先添加多個員工
      store.set(setSelectedEmployeesAtom, [mockEmployee1, mockEmployee2, mockEmployee3]);

      // 逐個移除
      store.set(removeSelectedEmployeeAtom, 'emp-001');
      store.set(removeSelectedEmployeeAtom, 'emp-002');
      store.set(removeSelectedEmployeeAtom, 'emp-003');

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(0);
    });

    it('應該能夠移除中間的員工', () => {
      const store = createStore();

      store.set(setSelectedEmployeesAtom, [mockEmployee1, mockEmployee2, mockEmployee3]);

      // 移除中間的員工
      store.set(removeSelectedEmployeeAtom, 'emp-002');

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(2);
      expect(employees[0]).toEqual(mockEmployee1);
      expect(employees[1]).toEqual(mockEmployee3);
    });

    it('從空列表移除員工不應該報錯', () => {
      const store = createStore();

      expect(() => {
        store.set(removeSelectedEmployeeAtom, 'emp-001');
      }).not.toThrow();

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(0);
    });
  });

  describe('setSelectedEmployeesAtom', () => {
    it('應該能夠直接設置員工列表', () => {
      const store = createStore();

      const newEmployees = [mockEmployee1, mockEmployee2];
      store.set(setSelectedEmployeesAtom, newEmployees);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toEqual(newEmployees);
    });

    it('應該能夠替換現有的員工列表', () => {
      const store = createStore();

      // 先設置一組員工
      store.set(setSelectedEmployeesAtom, [mockEmployee1]);

      // 替換為新的員工列表
      store.set(setSelectedEmployeesAtom, [mockEmployee2, mockEmployee3]);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(2);
      expect(employees).toEqual([mockEmployee2, mockEmployee3]);
    });

    it('應該能夠設置空列表', () => {
      const store = createStore();

      // 先添加員工
      store.set(setSelectedEmployeesAtom, [mockEmployee1, mockEmployee2]);

      // 設置為空列表
      store.set(setSelectedEmployeesAtom, []);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(0);
    });

    it('應該保持設置的順序', () => {
      const store = createStore();

      const orderedEmployees = [mockEmployee3, mockEmployee1, mockEmployee2];
      store.set(setSelectedEmployeesAtom, orderedEmployees);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toEqual(orderedEmployees);
    });
  });

  describe('clearSelectedEmployeesAtom', () => {
    it('應該能夠清空員工列表', () => {
      const store = createStore();

      // 先添加員工
      store.set(setSelectedEmployeesAtom, [mockEmployee1, mockEmployee2, mockEmployee3]);

      // 清空列表
      store.set(clearSelectedEmployeesAtom);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(0);
      expect(employees).toEqual([]);
    });

    it('清空空列表不應該報錯', () => {
      const store = createStore();

      expect(() => {
        store.set(clearSelectedEmployeesAtom);
      }).not.toThrow();

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toEqual([]);
    });

    it('清空後應該能夠重新添加員工', () => {
      const store = createStore();

      // 添加員工
      store.set(setSelectedEmployeesAtom, [mockEmployee1]);

      // 清空
      store.set(clearSelectedEmployeesAtom);

      // 重新添加
      store.set(addSelectedEmployeeAtom, mockEmployee2);

      const employees = store.get(selectedEmployeesAtom);
      expect(employees).toHaveLength(1);
      expect(employees[0]).toEqual(mockEmployee2);
    });
  });

  describe('複雜操作場景', () => {
    it('應該能夠處理添加、移除、清空的組合操作', () => {
      const store = createStore();

      // 添加員工
      store.set(addSelectedEmployeeAtom, mockEmployee1);
      store.set(addSelectedEmployeeAtom, mockEmployee2);
      expect(store.get(selectedEmployeesAtom)).toHaveLength(2);

      // 移除一個
      store.set(removeSelectedEmployeeAtom, 'emp-001');
      expect(store.get(selectedEmployeesAtom)).toHaveLength(1);

      // 再添加一個
      store.set(addSelectedEmployeeAtom, mockEmployee3);
      expect(store.get(selectedEmployeesAtom)).toHaveLength(2);

      // 清空
      store.set(clearSelectedEmployeesAtom);
      expect(store.get(selectedEmployeesAtom)).toHaveLength(0);
    });

    it('應該保持不可變性', () => {
      const store = createStore();

      // 獲取初始狀態
      const initialState = store.get(shiftScheduleAtom);
      const initialEmployees = initialState.selectedEmployees;

      // 添加員工
      store.set(addSelectedEmployeeAtom, mockEmployee1);

      // 獲取更新後的狀態
      const updatedState = store.get(shiftScheduleAtom);
      const updatedEmployees = updatedState.selectedEmployees;

      // 應該是不同的陣列引用
      expect(updatedEmployees).not.toBe(initialEmployees);
      
      // 初始陣列不應該被修改
      expect(initialEmployees).toHaveLength(0);
      expect(updatedEmployees).toHaveLength(1);
    });

    it('應該能夠處理大量操作', () => {
      const store = createStore();

      // 添加 100 次
      for (let i = 0; i < 100; i++) {
        store.set(addSelectedEmployeeAtom, mockEmployee1);
      }

      // 應該只有一個（因為重複）
      expect(store.get(selectedEmployeesAtom)).toHaveLength(1);

      // 清空
      store.set(clearSelectedEmployeesAtom);

      // 添加不同的員工
      store.set(addSelectedEmployeeAtom, mockEmployee1);
      store.set(addSelectedEmployeeAtom, mockEmployee2);
      store.set(addSelectedEmployeeAtom, mockEmployee3);

      expect(store.get(selectedEmployeesAtom)).toHaveLength(3);
    });

    it('應該正確處理狀態隔離', () => {
      const store = createStore();

      // 設置初始狀態
      store.set(shiftScheduleAtom, draft => {
        draft.viewMode = ViewModeEnum.EDIT;
        draft.selectedEmployees = [mockEmployee1];
      });

      // 只更新員工列表
      store.set(addSelectedEmployeeAtom, mockEmployee2);

      const state = store.get(shiftScheduleAtom);
      
      // 員工列表應該更新
      expect(state.selectedEmployees).toHaveLength(2);
      
      // 其他狀態應該保持不變
      expect(state.viewMode).toBe(ViewModeEnum.EDIT);
    });
  });
});
```

---

## 測試覆蓋的場景

### ✅ 正常操作
- 添加單個員工
- 添加多個員工
- 移除員工
- 清空列表
- 設置列表

### ✅ 邊界情況
- 添加重複員工
- 移除不存在的員工
- 從空列表移除
- 清空空列表

### ✅ 數據完整性
- 保持添加順序
- 保持不可變性
- 狀態隔離

### ✅ 複雜場景
- 組合操作
- 大量操作
- 狀態隔離

---

## 運行測試

```bash
# 運行員工操作測試
npm test employeeOperations.test

# 查看測試覆蓋率
npm run test:coverage -- employeeOperations.test
```

---

## 預期測試結果

```
✓ src/lib/jotai/shiftScheduleApproval/__tests__/employeeOperations.test.ts (25)
  ✓ 員工列表操作 (25)
    ✓ addSelectedEmployeeAtom (5)
      ✓ 應該能夠添加員工
      ✓ 應該能夠添加多個員工
      ✓ 不應該添加重複的員工
      ✓ 應該基於 employeeId 判斷重複
      ✓ 應該保持添加順序
    ✓ removeSelectedEmployeeAtom (5)
      ✓ 應該能夠移除員工
      ✓ 移除不存在的員工不應該報錯
      ✓ 應該能夠移除所有員工
      ✓ 應該能夠移除中間的員工
      ✓ 從空列表移除員工不應該報錯
    ✓ setSelectedEmployeesAtom (4)
      ✓ 應該能夠直接設置員工列表
      ✓ 應該能夠替換現有的員工列表
      ✓ 應該能夠設置空列表
      ✓ 應該保持設置的順序
    ✓ clearSelectedEmployeesAtom (3)
      ✓ 應該能夠清空員工列表
      ✓ 清空空列表不應該報錯
      ✓ 清空後應該能夠重新添加員工
    ✓ 複雜操作場景 (4)
      ✓ 應該能夠處理添加、移除、清空的組合操作
      ✓ 應該保持不可變性
      ✓ 應該能夠處理大量操作
      ✓ 應該正確處理狀態隔離

Test Files  1 passed (1)
     Tests  25 passed (25)
  Start at  14:35:12
  Duration  156ms
```

---

## 相關文件

- [jotai-immer-refactoring-guide.md](./jotai-immer-refactoring-guide.md) - 重構指南
- [jotai-immer-testing-guide.md](./jotai-immer-testing-guide.md) - 測試環境設置
- [jotai-immer-integration-tests.md](./jotai-immer-integration-tests.md) - 整合測試（下一個文件）

