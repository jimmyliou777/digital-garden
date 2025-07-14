## 專案目錄結構

```text
├── .husky
│   ├── _
│   │   ├── applypatch-msg
│   │   ├── commit-msg
│   │   ├── h
│   │   ├── husky.sh
│   │   ├── post-applypatch
│   │   ├── post-checkout
│   │   ├── post-commit
│   │   ├── post-merge
│   │   ├── post-rewrite
│   │   ├── pre-applypatch
│   │   ├── pre-auto-gc
│   │   ├── pre-commit
│   │   ├── pre-merge-commit
│   │   ├── pre-push
│   │   ├── pre-rebase
│   │   └── prepare-commit-msg
│   └── pre-commit
├── .npmrc
├── .prettierignore
├── .prettierrc
├── .vscode
│   └── settings.json
├── README
│   ├── i18n.md
│   ├── lint-config.md
│   ├── style-guide.md
│   └── tailwind-css-intellisense.md
├── README.md
├── axios-test-example.ts
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── public
│   ├── locales
│   │   ├── en-US
│   │   │   └── common.json
│   │   └── zh-TW
│   │       └── common.json
│   ├── mockServiceWorker.js
│   └── vite.svg
├── scripts
├── snapshot.md
├── snatshot.cjs
├── src
│   ├── App.tsx
│   ├── MSW-SETUP-README.md
│   ├── api
│   │   └── client.ts
│   ├── assets
│   │   ├── logo-xe@3x.png
│   │   ├── male@2x.png
│   │   └── react.svg
│   ├── components
│   │   ├── demo
│   │   │   └── demoForm
│   │   │       └── index.tsx
│   │   ├── layout
│   │   │   ├── index.tsx
│   │   │   └── sidebar
│   │   │       ├── app-sidebar.tsx
│   │   │       ├── index.tsx
│   │   │       ├── logo.tsx
│   │   │       ├── nav-main.tsx
│   │   │       ├── site-header.tsx
│   │   │       └── user-menu
│   │   │           ├── index.tsx
│   │   │           ├── language-dropdown.tsx
│   │   │           ├── linkup.tsx
│   │   │           └── user-dropdown.tsx
│   │   └── schedule
│   │       ├── atoms
│   │       │   ├── employeeAtoms.ts
│   │       │   ├── timelineAtoms.ts
│   │       │   └── timelineItemsAtom.ts
│   │       ├── components
│   │       │   ├── ShiftScheduler.tsx
│   │       │   ├── ShiftSchedulerV2.tsx
│   │       │   ├── StoreFilter.tsx
│   │       │   ├── TimelineComponents.tsx
│   │       │   ├── TimelineContent.tsx
│   │       │   ├── TimelineControls.tsx
│   │       │   ├── TimelineData.ts
│   │       │   ├── TimelineDemo.tsx
│   │       │   └── ViewSwitcher.tsx
│   │       ├── constants
│   │       │   └── timelineConstants.ts
│   │       ├── timeline.css
│   │       └── types.ts
│   ├── hooks
│   │   └── api
│   │       ├── useDashboard.ts
│   │       ├── useEmployees.ts
│   │       ├── useShifts.ts
│   │       └── useStores.ts
│   ├── i18n.ts
│   ├── lib
│   │   └── jotai
│   │       └── demo
│   │           └── index.tsx
│   ├── main.tsx
│   ├── mocks
│   │   ├── browser.ts
│   │   ├── config
│   │   │   └── faker.ts
│   │   ├── data
│   │   │   ├── employees.ts
│   │   │   ├── index.ts
│   │   │   ├── shifts.ts
│   │   │   └── stores.ts
│   │   ├── handlers.ts
│   │   ├── node.ts
│   │   └── types.ts
│   ├── pages
│   │   ├── BasicDemoPage.tsx
│   │   ├── DemoFormPage.tsx
│   │   ├── MSWDemoPage.tsx
│   │   ├── ShiftSchedulerPage.tsx
│   │   └── TimelineDemoPage.tsx
│   ├── providers
│   │   └── QueryProvider.tsx
│   ├── routes
│   │   ├── DemoFormRoute.tsx
│   │   ├── basicDemoRoute.tsx
│   │   ├── index.tsx
│   │   ├── mswDemoRoute.tsx
│   │   ├── shiftSchedulerRoute.tsx
│   │   └── timelineDemoRoute.tsx
│   ├── styles.css
│   ├── types
│   │   └── enums
│   │       └── common
│   │           └── index.tsx
│   └── utils
│       └── config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vite-env.d.ts
├── vite.config.ts
└── vite.config.wc.ts
```

## 函式清單

### axios-test-example.ts
- **runAllTests()**

### src/api/client.ts
- **createAbortController()** - 導出取消請求的工具函數 (使用現代 AbortController)

### src/components/schedule/atoms/employeeAtoms.ts
- **selectedEmployeesAtom(atom(get )** - 选中员工原子
- **toggleEmployeeSelectionAtom(atom(null, (get, set, employeeId: string)** - 更新员工选择状态
- **toggleAllEmployeesAtom(atom(null, (get, set, selectAll: boolean)** - 全选/取消全选

### src/components/schedule/atoms/timelineAtoms.ts
- **weekActionsAtom(atom(null, (get, set, action: 'prev' | 'next' | 'current')** - 週操作原子

### src/components/schedule/atoms/timelineItemsAtom.ts
- **availableStoresAtom(atom<string[]>(()**
- **updateSelectedEmployeeAtom(atom(null, (_get, set, newSelectedIds: string[])**
- **updateSelectedStoresAtom(atom(null, (_get, set, selectedStores: string[])**
- **filteredTimelineItemsAtom(atom<TimelineItem[]>(get )**
- **setGroupsAtom(atom(null, (_get, set, groups: TimelineGroup[])**

### src/hooks/api/useDashboard.ts
- **useDashboardStats()** - 獲取統計資料的 hook

### src/hooks/api/useEmployees.ts
- **useEmployee(id: string)** - 獲取單個員工詳情的 hook
- **useCreateEmployee()** - 創建員工的 mutation hook
- **useUpdateEmployee()** - 更新員工的 mutation hook
- **useDeleteEmployee()** - 刪除員工的 mutation hook

### src/hooks/api/useShifts.ts
- **useShifts(params?: ShiftQueryParams)** - 獲取排班列表的 hook
- **useShift(id: string)** - 獲取單個排班詳情的 hook

### src/hooks/api/useStores.ts
- **useStores(params?: { page?: number; limit?: number; isActive?: boolean })** - 獲取門店列表的 hook
- **useStore(id: string)** - 獲取單個門店詳情的 hook

### src/i18n.ts
- **changeLanguage(lng: LanguagesEnum)**

### src/mocks/browser.ts
- **startMSW()** - 啟動 MSW
- **stopMSW()** - 停止 MSW

### src/mocks/node.ts
- **setupMSWForTesting()** - 測試環境配置

## 依賴清單

## mayo-pt-web

### devDependencies
```json
{
  "@eslint/js": "^9.22.0",
  "@faker-js/faker": "^9.8.0",
  "@types/axios": "^0.14.4",
  "@types/node": "^24.0.7",
  "@types/react": "^18.2.55",
  "@types/react-big-calendar": "^1.8.9",
  "@types/react-calendar-timeline": "^0.28.6",
  "@types/react-dom": "^18.2.19",
  "@types/react-i18next": "^8.1.0",
  "@types/react-window": "^1.8.8",
  "@vitejs/plugin-react-swc": "^3.8.0",
  "eslint": "^9.22.0",
  "eslint-config-prettier": "^10.1.5",
  "eslint-plugin-jsx-a11y": "^6.10.2",
  "eslint-plugin-prettier": "^5.5.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.19",
  "eslint-plugin-simple-import-sort": "^12.1.1",
  "globals": "^16.0.0",
  "husky": "^9.1.7",
  "lint-staged": "^16.1.2",
  "msw": "^2.10.2",
  "prettier": "3.6.0",
  "prettier-plugin-tailwindcss": "^0.6.13",
  "typescript": "~5.7.2",
  "typescript-eslint": "^8.26.1",
  "vite": "^6.3.1"
}
```

### dependencies
```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "@hookform/resolvers": "^5.1.1",
  "@mayo/mayo-ui-beta": "^2.1.13",
  "@tailwindcss/vite": "^4.1.4",
  "@tanstack/react-query": "^5.81.2",
  "@tanstack/react-query-devtools": "^5.81.2",
  "axios": "^1.10.0",
  "classnames": "^2.5.1",
  "dayjs": "^1.11.10",
  "i18next": "^25.2.1",
  "i18next-browser-languagedetector": "^8.2.0",
  "i18next-http-backend": "^3.0.2",
  "jotai": "^2.6.4",
  "jotai-immer": "^0.2.0",
  "lit": "^3.3.0",
  "lucide-react": "^0.525.0",
  "react": "^18.2.0",
  "react-big-calendar": "^1.10.3",
  "react-calendar-timeline": "0.30.0-beta.3",
  "react-cookie": "^8.0.1",
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1",
  "react-dom": "^18.2.0",
  "react-hook-form": "^7.59.0",
  "react-i18next": "^15.5.3",
  "react-router-dom": "^6.22.3",
  "react-window": "^1.8.11",
  "tailwindcss": "^4.1.4",
  "zod": "^3.25.67"
}
```

