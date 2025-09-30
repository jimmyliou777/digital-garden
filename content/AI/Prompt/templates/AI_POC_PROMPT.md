---
title: AI PM Prompt
description: AI構建專案提示詞模板
tags: [Prompt, AI]
published: 2025-09-30
draft: false
---
## AI 代理開發提示詞：可執行規格 (Executable Specification) v2.2

## 0. 指導原則與開發哲學 (Guiding Principles & Development Philosophy)

本文件不僅是需求規格，更是實現「AI x BDD 軟體全自動化開發」的契約。在解讀與執行此文件時，請務必遵守以下核心原則：

1. **人類可讀的規格 (Human-Readable Specs):** 「功能規格」章節使用平實的自然語言撰寫，目的是讓包含 PM、設計師、業務在內的任何非技術人員都能讀懂並參與討論。你的任務是將這些人類語言轉化為機器可執行的程式碼。

2. **協作的活文件 (Collaborative Living Document):** 這份文件是所有利害關係人 (Stakeholders) 之間溝通需求的唯一真實來源 (Single Source of Truth)。它會被持續更新，你必須以這份文件的最新版本作為開發的唯一依據。

3. **安全的需求變更 (Safe Requirement Changes):** 任何對「功能規格」中 Scenario 的修改，都應被視為正式且完整的需求變更。你必須能夠僅根據 Scenario 的文字變動來調整程式碼，並確保修改不會破壞其他現有功能。

4. **AI 自動化開發的契約 (The Contract for AI Development):** 本文件是人類意圖與 AI 實作之間的橋樑。人類負責維護這份「可執行規格」，定義「做什麼 (What)」；AI (也就是你) 則負責高效且精準地實現「如何做 (How)」。

## 1. 功能規格 (Feature Specifications) - BDD 風格

**注意：本章節是需求的唯一真實來源。** 這裡描述了系統的所有外部可見行為，使用 Gherkin 語法確保任何背景的團隊成員都能理解。

### Feature: 待辦事項管理

為了讓使用者感覺操作立即生效，所有的新增與刪除操作都必須採用樂觀更新策略。

#### Scenario: 成功新增待辦事項 (樂觀更新)

* **Given** 使用者位於待辦事項列表頁面
* **When** 使用者在輸入框中輸入「學習提示詞工程」並點擊「新增」按鈕
* **Then** 「學習提示詞工程」這個事項應該 **立即** 出現在列表的末端
* **And** 這個新出現的事項應具有一個視覺上可區分的「暫存」狀態 (例如，半透明 `opacity-50`)
* **And** 一個新增事項的 API 請求會被非同步地發送到後端
* **And** 在後端 API 成功回應後，該事項的「暫存」狀態應被移除，樣式恢復正常

#### Scenario: 新增待辦事項失敗 (UI 回滾)

* **Given** 使用者已透過樂觀更新在列表中看到一個新的「暫存」事項
* **When** 後端 API 因為某種原因 (例如，網路錯誤或伺服器驗證失敗) 回應了一個錯誤
* **Then** 該樂觀新增的「暫存」事項應該自動從列表中被移除
* **And** 應在 UI 中向使用者顯示一個清晰的錯誤訊息（例如，在列表上方顯示一個錯誤提示框）

#### Scenario: 成功刪除待辦事項 (樂觀更新)

* **Given** 列表中存在一個待辦事項
* **When** 使用者點擊該事項旁的「刪除」按鈕
* **Then** 該事項應該 **立即** 從列表中消失
* **And** 一個刪除事項的 API 請求會被非同步地發送到後端

#### Scenario: 刪除待辦事項失敗 (UI 回滾)

* **Given** 使用者已透過樂觀更新從列表中刪除了一個事項
* **When** 後端 API 回應了一個刪除失敗的錯誤
* **Then** 該被刪除的事項應該重新出現在它原來的位置
* **And** 應向使用者顯示一個錯誤訊息

## 2. 工程約束與規格 (Engineering Constraints & Specifications)

### 2.1. 代理人角色 (Agent Persona)

你是一位資深的 React 前端開發專家。你的首要任務是將上述的「功能規格」一字不漏地轉化為高品質的程式碼。**這些規格是人類與你之間唯一的契約**。你的程式碼風格必須清晰、註解詳盡，並優先考慮使用者體驗和程式碼的健壯性。

### 2.2. 技術棧與開發約束 (Tech Stack & Development Constraints)

* **框架 (Framework):** React
* **伺服器狀態管理 (Server State Management):** `@tanstack/react-query` (v5+)
* **客戶端狀態管理 (Client State Management):** Jotai (僅用於管理簡單的 UI 狀態，例如錯誤訊息)
* **樣式 (Styling):** Tailwind CSS
* **API 模擬 (API Mocking):**
  * 在前端程式碼中用一個模擬的 axios 物件直接模擬訪問後端 API。
  * 這樣一來，在 React Query 中撰寫的 API 呼叫程式碼將會是 axios.get('/api/todos') 的形式，未來落地時，只需要將模擬的 axios 物件換成真實的 axios 實例，無需修改任何業務邏輯程式碼。
* **檔案結構 (File Structure):** 所有程式碼必須封裝在 **單一一個** `.jsx` 檔案中。
* **禁止事項 (Prohibitions):** 絕對不要使用 `alert()` 或 `confirm()`。

### 2.3. 程式碼架構策略：關注點分離 (Code Architecture Strategy: Separation of Concerns)

儘管所有程式碼都在一個檔案中，你仍必須遵循嚴格的**邏輯性關注點分離**原則。請依照以下順序組織你的程式碼，以確保其清晰、可維護且易於理解：

1. **API 模擬層 (`axios`):**
   * 在此區塊中定義一個模擬的 axios 實例，用於模擬後端 API 訪問。
2. **全域狀態層 (`Jotai`):**
   * 定義管理純客戶端 UI 狀態的 atom。
3. **資料與邏輯層 (使用 `React Query` 的自訂鉤子):**
   * 建立 `useTodos`, `useAddTodo`, `useDeleteTodo` 等自訂鉤子來封裝所有 `react-query` 的互動與樂觀更新邏輯。
4. **表現層 (UI 元件):**
   * 定義 `TodoItem`, `TodoList`, `AddTodoForm`, `ErrorMessage` 等純 UI 元件。
5. **應用程式容器層 (`App` 元件):**
   * 組合所有鉤子和 UI 元件，管理狀態並渲染最終佈局。

### 2.4. 視覺與風格指南 (Visual & Style Guide) - v_apollo

* **整體佈局 (Overall Layout):**
  * 應用程式應在頁面中水平居中，並使用淺灰色背景 `bg-slate-50` (`#F8F9FA`)。
  * 主容器卡片使用 `max-w-xl` 限制最大寬度，並有 `p-8` 的內邊距、`rounded-lg` 的圓角、`bg-white` 的背景和 `shadow-md` 的陰影。
* **色彩配置 (Color Palette):**
  * **主色調 (Primary):** `sky-500` (`#0ea5e9`), 用於主要按鈕和焦點元素，對應圖片中的 Light Blue (`#51B7F4`)。
  * **文字 (Text):**
    * 主要文字: `slate-800` (`#1e293b`), 對應圖片中的 Black (`#212C3E`)。
    * 次要文字: `slate-500` (`#64748b`), 對應圖片中的 Gray (`#8494A2`)。
  * **錯誤 (Error):** `red-600` (`#dc2626`), 對應圖片中的 Red (`#DE3A3A`)。
  * **邊框與背景 (Borders & Backgrounds):**
    * 邊框: `slate-200` (`#e2e8f0`), 對應圖片中的 Light Gray (`#E9ECEF`)。
    * 淺色背景: `slate-50` (`#f8fafc`), 對應圖片中的 Light Gray (`#F8F9FA`)。
* **字體排印 (Typography):**
  * **字體家族 (Font Family):** 應使用 `Noto Sans`。
  * **標題 (Heading):**
    * H1: `text-2xl font-medium` (24px, Medium)。
  * **內文 (Body):**
    * 主要內文: `text-base font-normal` (16px, Regular)。
    * 次要內文/標籤: `text-sm font-normal` (14px, Regular)。
* **元件風格 (Component Styling):**
  * **按鈕 (Button):**
    * 基礎樣式: `px-4 py-2 rounded-md text-white font-semibold bg-sky-500`。
    * 互動: `hover:bg-sky-600`。
    * 禁用狀態: `disabled:opacity-50 disabled:cursor-not-allowed`。
  * **輸入框 (Input):**
    * 基礎樣式: `w-full px-3 py-2 border border-slate-200 rounded-md`。
    * 互動: `focus:outline-none focus:ring-2 focus:ring-sky-500`。
  * **待辦事項 (Todo Item):**
    * 使用 Flexbox 佈局，`justify-between` 和 `items-center`。
    * 項目之間使用 `border-b border-slate-200` 分隔，最後一個項目無底邊框。
    * 暫存狀態: `opacity-50 transition-opacity`。
    * 刪除按鈕: `text-slate-500 hover:text-red-600`。
  * **錯誤訊息框 (Error Message Box):**
    * 基礎樣式: `p-3 rounded-md bg-red-50 border border-red-300 text-red-600`。

## 3. 輸出格式 (Output Format)

請將所有程式碼整合到一個名為 `optimistic-update-example.jsx` 的 React 元件檔案中。程式碼需要包含完整的、可運行的範例，包括模擬的 API 函數、Jotai atom、React Query client 設定以及完整的 React 元件結構。