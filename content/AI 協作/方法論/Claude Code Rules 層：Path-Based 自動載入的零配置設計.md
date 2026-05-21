---
title: Claude Code Rules 層：Path-Based 自動載入的零配置設計
description: "Rules 層透過 paths: frontmatter 實現「你編輯什麼檔案，就載入什麼規範」的零配置設計——開發者不需要主動 import，對的領域知識就會在對的時候進入 AI 的 context。"
tags: [Claude Code, AI 協作, 方法論, Rules]
published: 2026-05-06
draft: false
status: evergreen
---

> [!note] 同名概念釐清
> 本文的「Rules」指 `.claude/rules/*.md` path-based 載入規範；另見 [[從工單到 PR：用 Jira × Claude Code × Git Worktree 跑一條紀律化的接單流程]] 中相同詞但偏向團隊紀律規約。

## 是什麼

Rules 層是 [[從 Prompt 到系統：用 Claude Code 打造 AI 開發閉環的五層架構設計|五層架構 framework overview]] 中的第四層，負責管理 **Domain 領域規範**。每條 rule 是一個 Markdown 檔案，存放在 `.claude/rules/` 目錄下，並透過 YAML frontmatter 的 `paths:` key 宣告觸發條件：當你正在編輯的檔案路徑匹配 `paths:` pattern 時，對應的 rule 才會自動注入 Claude 的 context。

這是一種「反應型」載入——不是 session 開始就推進來，而是等你真正踏入某個 domain 才出現。

## 觸發機制

Rules 的觸發完全由檔案路徑驅動，不需要任何手動操作：

- 編輯 `src/components/**` → 自動載入 `react-components.md`（組件設計決策樹）
- 編輯 `src/hooks/api/**` → 自動載入 `api-hooks.md`（三層錯誤處理規範）
- 編輯 `public/locales/**` → 自動載入 `i18n.md`（key 命名規範）

每個 rule 控制在 30–60 行，用最適合 domain 的表達方式呈現：有的是 decision tree、有的是 architecture diagram、有的是 checklist。**零配置**的關鍵在於：開發者不需要知道 `.claude/rules/` 裡有什麼，只要開始編輯檔案，對的規範就已經在 AI 的 context 裡。

## 設計原則

Rules 層存在的根本原因是解決「注意力稀釋」問題。早期常見的做法是把所有規範塞進 CLAUDE.md，但這造成三個問題：修 i18n key 時不需要知道 Jotai structural sharing pattern；過多規則讓 AI 無法辨別哪些才是當下最重要的；單一大文件難以維護。

Path-based 的設計把知識的**觸發範圍**精確對應到**使用範圍**，只有在你真正需要某個 domain 的知識時，那份知識才會出現。這與 always-load 的對比在 token 成本上也很明顯：7 個 domain rules 在未觸發時的待機成本為 0，觸發後每個 rule 約 100–200 tokens，遠低於把所有規範打包進 CLAUDE.md 的固定成本。

> [!NOTE] Path-based 的一個限制
> `paths:` 只能匹配**檔案路徑**，無法匹配對話意圖。「幫我查 Jira ticket」這類任務驅動的需求，正在編輯的檔案不會觸發任何 pattern，因此這類 rule 必須維持 always-load 並積極瘦身。詳見 [[Claude Code Prompt 分層設計原則：Rule、Memory、Skill 各該放什麼？|Rule/Memory/Skill 內容分類]]。

## 與其他層的關係

Rules 層夾在 [[CLAUDE.md 專案入口層：Session 自動載入的設計哲學|CLAUDE.md 層]]（always-load 的基礎 context）與 [[Claude Code Skills 層：SDLC 結構化流程的按需觸發機制|Skills 層]]（手動觸發的結構化流程）之間，形成三段式的 context 精準分配。CLAUDE.md 提供專案全域的最小必要知識，Rules 提供 domain 級別的 just-in-time 規範，Skills 提供任務級別的 SOP。三層各司其職，不重疊也不遺漏。

Rules 的內容邊界可參考 [[Claude Code Prompt 分層設計原則：Rule、Memory、Skill 各該放什麼？|Rule/Memory/Skill 內容分類]] 的「違反會出錯嗎？」判斷口訣——只有硬約束才屬於 rule，軟知識應下沉到 Memory。

> [!info] 站內延伸
>
> - [[Claude Code 系統提示詞架構優化：從 Always-Load 到按需載入|系統提示詞優化實戰]] — 記錄從 16 個 `@` import 重構到四層按需載入的過程，Rules 的 `paths:` 機制是節省 ~15,000 tokens/session 的核心手段
> - [[Claude Code Prompt 分層設計原則：Rule、Memory、Skill 各該放什麼？|Rule/Memory/Skill 內容分類]] — 從內容性質（護欄 / 經驗 / SOP）決定每條知識的歸屬，與本文的路徑載入機制互補
> - [[從 Prompt 到系統：用 Claude Code 打造 AI 開發閉環的五層架構設計|五層架構設計]] — Rules 在完整五層體系中的位置，含 token 成本總覽與各層分工
