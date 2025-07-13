---
title: 專案指南文件範本
description: 專案指南文件範本
tags: [Prompt, AI, Integration, Template, Example]
published: 2025-07-13
draft: false
---
# Mayo PT Web - 排班系統


> **🤖 AI 協作指南**: [`AI-QUICK-REF.md`](AI-QUICK-REF.md)

基於 React 18 + TypeScript + Vite 的現代化排班系統 Web 界面。

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## 專案文檔

本專案包含兩個重要文檔，提供完整的專案資訊和開發規範：

1. **snapshot.md**：提供專案結構的快照
2. **rules.md**：定義專案的開發規範和最佳實踐

### 專案快照 (snapshot.md)

`snapshot.md` 檔案由 `snatshot.cjs` 腳本生成，提供程式碼庫的結構化概覽，具有以下優勢：

#### 開發優勢

- **清晰的專案結構**：目錄樹視覺化呈現，讓你一眼就能理解檔案組織方式。
- **函式目錄**：列出所有匯出的函式及其參數和註解，便於了解可用的API。
- **依賴透明度**：顯示所有專案依賴，幫助開發者了解技術堆疊。

#### 更新建議

為保持專案文檔的最新狀態，建議在以下情況更新snapshot：

- 新增或移除重要檔案或功能後
- 引入新的依賴後
- 進行重大重構後
- 定期更新（例如每週或每兩週）以保持文檔與代碼同步

要重新生成快照，請執行：

```bash
node snatshot.cjs
```
文檔範本: [snapshot.md](../templates/snapshot-js.md)

### 開發規範 (rules.md)

`rules.md` 檔案定義了專案的開發規範和最佳實踐，包括：

- 命名規範和代碼風格
- TypeScript使用標準
- 組件設計和實現指南
- 路由和狀態管理規則
- 第三方庫使用規範

## AI輔助開發指南

結合 `snapshot.md` 和 `rules.md`，可以大幅提升AI助手協助開發的效率和準確性。

### 兩個文檔的協同價值

- **snapshot.md**：提供專案「地圖」，幫助AI理解專案結構
- **rules.md**：提供開發「指南」，確保AI遵循專案規範和最佳實踐

### 如何有效提示AI

#### 最佳提示模板

```
我正在開發基於React+TypeScript的Mayo PT Web專案，以下是專案資訊：

【專案結構】
{snapshot.md的內容}

【開發規範】
{rules.md的內容}

我需要：{具體需求描述}
```

#### 針對不同開發場景的提示策略

1. **新功能開發**：
   ```
   請參考專案的目錄結構和開發規範，幫我實現一個新的XXX頁面，需要符合專案的命名規則和組件開發標準
   ```

2. **代碼審查**：
   ```
   根據我們專案的TypeScript規範和組件開發標準，請審查以下代碼並提供修改建議
   ```

3. **重構建議**：
   ```
   查看我們的專案結構和開發規範，請為XXX組件提供符合專案風格的重構方案
   ```

4. **解決特定問題**：
   ```
   我在實現XXX時遇到問題，請根據我們的專案規範和架構，提供最佳解決方案
   ```

5. **專案擴展**：
   ```
   我想在現有架構基礎上添加XXX功能，請根據專案結構和規範，提供實現方案和所需修改
   ```

### 提示效果最佳化建議

- **提供上下文**：說明當前所在文件和工作內容
- **明確需求**：具體說明需要AI協助的部分
- **引用相關規範**：引用rules.md中與當前任務相關的具體規範
- **參考現有實現**：指向專案中類似功能的實現作為參考

將這些文檔納入您的AI提示中，能讓AI助手提供更精準、更符合專案標準的協助，大幅提升開發效率和代碼一致性。

## 🤖 AI 上下文自動更新

### update-ai-context.js 使用指南

專案包含自動化腳本 `scripts/update-ai-context.js`，用於掃描專案變化並更新 AI 協作上下文。

#### 功能特色
- **專案結構掃描**: 自動分析目錄結構和檔案變化
- **技術模式識別**: 識別 Hook、組件、API 模式
- **統計資訊生成**: 生成專案的統計資訊和變更記錄
- **Markdown 輸出**: 生成 AI 友好的 Markdown 格式文檔

#### 使用方法

```bash
# 改進版本 (架構導向)
node scripts/update-ai-context.js
pnpm run update-ai-contex安
```
腳本範本: [update-ai-context.md](../templates/update-ai-context.md)

#### 兩個版本的差異

| 特色 | 標準版 | 改進版 (推薦) |
|------|--------|---------------|
| **資訊架構** | 統計數據導向 | 架構決策導向 |
| **內容重點** | 專案統計、技術模式 | 開發約定、協作場景 |
| **格式風格** | 📊 圖示 + 統計表格 | 清晰分層 + 實用指南 |
| **AI 友好度** | 中等 | 高 (更易理解) |
| **參考對象** | 無 | 基於 `docs/ai-context.md` |

#### 生成的檔案
- **標準版**: `docs/ai-context-auto.md` + `docs/ai-prompt-templates.md`
- **改進版**: `docs/ai-context-auto-improved.md` (單一檔案，完整內容)

#### 建議執行時機
- **新增重要功能後** - 確保 AI 了解新的程式碼模式
- **重構架構後** - 更新專案結構資訊
- **新增依賴後** - 反映技術棧變化
- **定期維護** - 建議每週執行一次

#### 自動化設置

可以將腳本加入到開發流程中：

```json
// package.json
{
  "scripts": {
    "update-ai-context": "node scripts/update-ai-context.js"
  }
}
```

或設置 Git hooks：
```bash
# .husky/post-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 檢查重要檔案變更後自動更新 AI 上下文
if git diff --name-only HEAD~1 HEAD | grep -E "(package\.json|src/)" > /dev/null; then
  echo "🤖 偵測到重要變更，更新 AI 上下文..."
  pnpm run update-ai-context
fi
```

#### 輸出範例
```bash
🤖 開始更新 AI 協作上下文...
✅ AI 上下文已更新: docs/ai-context.md
📊 專案統計:
   - 組件: 15
   - Hook: 8
   - 頁面: 6
   - API Hook: 5
   - 最近變更: 3 個檔案
✅ 提示模板已生成: docs/ai-prompt-templates.md
🎉 AI 上下文更新完成！
```

這個腳本確保 AI 協作指南始終與專案實際狀況保持同步，提升 AI 協作的準確性和效率。

---

考慮將此命令加入到你的開發工作流程中，確保團隊成員和AI助手總能獲取最新的專案概覽與規範。
