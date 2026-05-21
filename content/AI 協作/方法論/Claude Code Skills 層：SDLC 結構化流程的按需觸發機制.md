---
title: Claude Code Skills 層：SDLC 結構化流程的按需觸發機制
description: Skills 是 Claude Code 五層架構的第三層，將軟體開發生命週期各階段封裝成按需觸發的結構化流程——只在被調用時展開，待機成本趨近於零。
tags: [Claude Code, AI 協作, 方法論, Skills]
published: 2026-05-06
draft: false
status: evergreen
---

> [!note] 同名概念釐清
> 本文的「Skill」指 Claude Code 官方 SKILL.md 機制；另見 [[gstack — 把 Claude Code 變成虛擬工程團隊的開源框架]] 中相同詞但指 gstack 的 23+8 角色化 prompt 套件。

## 是什麼

Skills 是 Claude Code 五層架構（見 [[從 Prompt 到系統：用 Claude Code 打造 AI 開發閉環的五層架構設計|五層架構 framework overview]]）中的第三層，負責封裝 SDLC（軟體開發生命週期）各階段的結構化流程。每個 Skill 對應開發週期中的一個明確階段：需求探索、功能實作、Bug 修復、測試撰寫、代碼審查、Jira 操作等。

Skill 的核心載體是 `SKILL.md`——一份結構化的 SOP 模板，定義 Skill 的名稱、描述（description）和完整的執行步驟。Claude Code 在 session 啟動時只讀取 name + description（約 100 tokens/個），完整的 SKILL.md 只在被調用時才展開讀取。

## 觸發機制

Skills 屬於「索引型」載入：session 開啟時只有名稱與描述存在 context 中，讓模型知道「有哪些能力可以用」；當使用者觸發（`/skill-name`）或模型判斷需要某個 Skill 時，完整內容才被 Read 進來。

這與[[CLAUDE.md 專案入口層：Session 自動載入的設計哲學|CLAUDE.md 層]]的「推送型」載入根本不同——CLAUDE.md 每次 session 固定消耗，Skills 是召之即來、不用則無聲。七個 Skills 的待機總成本約 700 tokens，遠低於把所有 SOP 塞進 CLAUDE.md 的做法。

> [!tip] 按需觸發的本質
> Skills 解決了一個核心矛盾：AI 需要「知道有哪些工具」，但不需要「一直記住工具的全部細節」。這是 context 管理的精髓：在對的時間知道對的事。

## 設計原則

**Skills 應該放什麼：** 完整的多步驟工作流程（有明確的 phase 順序）、需要在不同 session 重複執行的 SDLC 階段、帶狀態流轉的流程（如 RED-GREEN-REFACTOR）。

**Skills 不應該放什麼：** 硬性約束（放 [[Claude Code Rules 層：Path-Based 自動載入的零配置設計|Rules 層]]）、單次查詢知識（放 Memory）、隨 session 常駐的最小必要 context（放 CLAUDE.md）。

**與 Commands 的分工：** Commands 是手動編排多個 Skills 的 orchestration 層（`/thes-workflow` 依序呼叫 explore → test-writing → bugfix → jira-ops），Skills 則是被編排的原子單元。Commands 是導演，Skills 是演員。

## 與其他層的關係

Skills 在五層架構中處於中間位置：上承 CLAUDE.md 的索引指引，接受 Commands 的編排呼叫，下引 [[Claude Code Rules 層：Path-Based 自動載入的零配置設計|Rules 層]] 的 domain 規範（在 Skill 執行期間，Rules 依然按路徑自動注入）。Standards 層（RFC/ADR 等標準文件）則由 Skills 按需 Read，作為執行時的參照。

完整的縱向載入關係見 [[從 Prompt 到系統：用 Claude Code 打造 AI 開發閉環的五層架構設計|五層架構 framework overview]]。

## 延伸閱讀

> [!info] 站內延伸
>
> - [[gstack — 把 Claude Code 變成虛擬工程團隊的開源框架|gstack 框架]] — gstack 以 28 個 Skills 將單一 AI agent 拆分成 CEO/工程主管/QA 等角色，是 Skills 作為角色封裝的極致案例
> - [[AI 代理工作流實戰：從模糊需求到 Develop Done 的完整閉環|AI 代理工作流實戰]] — 以排班衝突功能為例，展示 `/opsx`、`/thes-workflow`、`jira-ops` 等 Skills 在閉環中實際串接的方式
> - [[Claude Code Prompt 分層設計原則：Rule、Memory、Skill 各該放什麼？|Prompt 三層分層設計]] — 從內容性質角度解析什麼時候該寫成 Skill 而非 Rule 或 Memory
> - [[Claude Code 系統提示詞架構優化：從 Always-Load 到按需載入|系統提示詞按需載入]] — 系統提示詞層級的按需載入實戰
