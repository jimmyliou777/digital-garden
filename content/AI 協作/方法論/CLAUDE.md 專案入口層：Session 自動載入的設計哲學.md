---
title: CLAUDE.md 專案入口層：Session 自動載入的設計哲學
description: CLAUDE.md 是 Claude Code 每次 session 自動載入的專案入口，核心設計哲學是「永遠可用的最小 context」——用索引取代百科全書，把 token 成本壓在可控範圍內同時保留完整的找路能力。
tags: [Claude Code, AI 協作, 方法論]
published: 2026-05-06
draft: false
status: evergreen
---

> [!note] 同名概念釐清
> 本文的「Memory」指 session 自動載入的 always-load 區塊；另見 [[Claude Code Prompt 分層設計原則：Rule、Memory、Skill 各該放什麼？]] 中相同詞但指經驗類軟知識的內容歸屬層。

## 是什麼

CLAUDE.md 是 Claude Code 五層架構中的 Layer 1，也是每次 session 啟動時**唯一保證自動載入**的專案指引檔。它解決的核心問題是：如何在不重複說明的前提下，讓 AI 每次對話都掌握必要的專案 context？答案不是把所有知識塞進一份文件，而是把 CLAUDE.md 設計成**索引 + 最小必要知識**——告訴 AI 有哪些規範存在、去哪裡找，而不是直接展開所有細節。

## 載入時機

CLAUDE.md 屬於「推送型」載入：session 開啟就注入，成本固定，無需任何觸發條件。這與其他層的觸發方式形成對比：

- **Rules 層**：只在你編輯匹配路徑的檔案時才注入（反應型）
- **Skills 層**：平時只載入名稱與描述（索引型），完整內容在手動觸發時才展開
- **Standards 層**：完全不主動載入，等 Skills 或 Rules 引用時才被 Read

正因為 CLAUDE.md 每次必然出現在 context 裡，它的每一行都要承受固定的 token 成本——這個特性決定了它的設計原則。

## 設計原則

**寫索引，不寫百科全書。** CLAUDE.md 應該包含：常用指令（`pnpm dev`、`pnpm test`）、架構摘要（狀態管理策略、API 錯誤分層）、命名規範、Skills & Rules 的存在提示，以及最重要的——一張 Key Documentation 表格，把各主題對應的文件路徑列出來。

詳細的 API 錯誤流程、Jira transition ID 對照表、組件設計 decision tree，這些都不屬於 CLAUDE.md。它們在需要時才被 Read，是 Layer 4/5 的工作。

這個設計的核心權衡是：**token 成本的可預測性 vs. 即時可用性**。把所有知識塞進 CLAUDE.md 確實讓 AI「什麼都知道」，但也讓護欄被稀釋——Anthropic 官方建議 CLAUDE.md 控制在 200 行以內，超過這個量，LLM 對每條指令的注意力會下降。好的 CLAUDE.md 設計目標是 ~800 tokens，同時保留完整的找路能力。

> [!warning] 常見誤區
> 在 CLAUDE.md 裡用 `@path/to/file` 引用其他文件，並不是「按需載入」——`@` import 會在 session 啟動時將引用檔案的完整內容展開注入，等同於直接貼進來。16 個 `@` import 可能讓每次 session 多消耗 15,000 tokens。

## 與其他層的關係

CLAUDE.md 是整個五層架構的入口，它的職責是**讓 AI 知道其他層的存在**。它不替代 Rules 或 Skills，而是透過索引指向它們：「遇到組件問題，rules/react-components.md 會自動載入；需要完整 TDD 流程，用 `/skill` 觸發 Skills 層。」完整的架構設計見 [[從 Prompt 到系統：用 Claude Code 打造 AI 開發閉環的五層架構設計|五層架構 framework overview]]，其他兩個原子筆記分別深入討論 [[Claude Code Skills 層：SDLC 結構化流程的按需觸發機制|Skills 層]] 與 [[Claude Code Rules 層：Path-Based 自動載入的零配置設計|Rules 層]]。

## 延伸閱讀

> [!info] 站內延伸
>
> - [[Claude Code 系統提示詞架構優化：從 Always-Load 到按需載入|系統提示詞優化實戰]] — 從 16 個 `@` import 重構到四層按需載入的完整過程，具體說明 CLAUDE.md 應如何瘦身
> - [[Claude Code Prompt 分層設計原則：Rule、Memory、Skill 各該放什麼？|Prompt 三層分層設計]] — 決定「某條知識該放 CLAUDE.md 還是 Rule 還是 Memory」的判斷邏輯
> - [[AI 寫作工作流實戰：從主題發想到自動部署|AI 寫作工作流實戰]] — CLAUDE.md 作為寫作工作流的 session 入口，如何索引整套自動化流程
> - [[AI 代理工作流實戰：從模糊需求到 Develop Done 的完整閉環|AI 代理工作流實戰]] — CLAUDE.md 作為 session 起點的閉環應用
