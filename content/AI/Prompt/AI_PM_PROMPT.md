---
title: AI PM Prompt
description: AI構建專案提示詞模板
tags: [Prompt, AI]
published: 2025-07-09
draft: false
---
# Gemini AI 專案程式碼產出標準 Prompt
請根據下列規格與要求，產出**完全符合專案結構**的 React Component、型別定義與 mock data，並分別以 markdown code block 輸出，且每段請加上檔名註解。

## 專案技術規格
- React 19 + TypeScript（strict mode）
- React Router v7（使用 routes 配置）
- TailwindCSS 4.x
- Vite 構建（不需考慮 Next.js）
- 型別需準確（interface）
- 專案使用 alias：`~/*` 代表 `./app/*`
- 輸出的程式碼必須用 markdown code block 包住，並加上檔名註解

## 專案結構要求
- React Component 請放在 `app/routes/.tsx`
- 型別定義請放在 `app/types/.ts`
- mock data 請放在 `app/mocks/.ts`
- 路由請以 `routes.ts` 配置，path 格式為 `/`

## 產出格式範例
`filename="app/routes/feature-name.tsx"`
// 這裡是 React Component 程式碼
...

額外注意事項
- 型別請盡量明確，避免 any
- 請勿產生與 Next.js 相關語法
- 請勿省略必要的 import
- 請確保所有檔案皆可直接複製貼上至專案對應路徑即可運作
- 若有多個元件/型別/mock，請分開多個 code block 並註明檔名