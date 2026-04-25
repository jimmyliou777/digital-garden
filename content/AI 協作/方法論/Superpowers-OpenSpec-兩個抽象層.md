---
title: "Superpowers × OpenSpec：兩個抽象層的紀律"
shortTitle: "兩個抽象層"
description: "Process-driven 與 spec-driven 工作流為何互補：抽象層差異、雙向弱點補位、三條 routing 速查"
tags:
  - AI協作
  - 工作流
  - Superpowers
  - OpenSpec
published: 2026-04-25
status: fleeting
---

**TL;DR：** Superpowers 管「怎麼做」、OpenSpec 管「做什麼」，兩者不在同一抽象層，所以互補而非競爭。新 feature ≥30 分鐘工作量再組合，小改動單用 Superpowers 即可。

## 兩個都「先想清楚再動手」，重複嗎？

接觸這兩個工具的工程師遲早會問：[Superpowers](https://github.com/obra/superpowers) 強調 brainstorm → plan → TDD，[OpenSpec](https://github.com/Fission-AI/OpenSpec) 也要先寫 proposal/specs/design/tasks，看起來都是「動手前的紀律」，為什麼要兩個都裝？

答：它們**不在同一抽象層**。把抽象層分清楚，組合與單用的時機就清楚了。

## 兩個抽象層

![[superpowers-openspec-layers.excalidraw.light.svg]]

- **OpenSpec 是「規格層 / 持久」**。`openspec/specs/` 記錄系統現況、`openspec/changes/<name>/` 是提案 delta、`openspec/changes/archive/` 留歷史。它在 codebase **之外**建立一份長期可追溯的合約。
- **Superpowers 是「執行層 / 暫態」**。一條工作流（brainstorm → plan → worktree → TDD → verify → review → finish）是一次性的紀律，merge 完就結束。
- **OpenSpec `tasks.md` ≠ Superpowers plan file**：前者是「應該做什麼」（與 spec 對齊），後者是「下一步怎麼動」（含檔案路徑、TDD 順序、subagent 派發）。後者**從前者衍生**，多了執行細節。

OpenSpec 防的是「需求只活在 chat 紀錄」，Superpowers 防的是「AI 急著寫 code」—— 兩種失敗模式不同，所以工具不同。

## 互補的弱點

| Superpowers 缺什麼 | OpenSpec 補什麼 |
|---|---|
| Plan file 是 ephemeral，merge 後沒長期脈絡 | `archive/` 永久保留 proposal / design |
| Brainstorm 結果只在對話、換 session 就丟 | `proposal.md` 持久化商業理由 |

| OpenSpec 缺什麼 | Superpowers 補什麼 |
|---|---|
| 沒強制 TDD（`/opsx:apply` 可能跳過測試） | `test-driven-development` skill |
| 不管 worktree 隔離與平行化 | `using-git-worktrees` + `dispatching-parallel-agents` |

組合的價值：OpenSpec 補 Superpowers 的「規格持久性 + 商業脈絡」，Superpowers 補 OpenSpec 的「執行紀律 + 平行化 + 驗證」。

## 三條 Routing 速查表

![[superpowers-openspec-axes.excalidraw.light.svg]]

什麼時候組合、什麼時候單用？

```text
新 feature（≥30 分鐘工作量）
  /opsx:propose <name>          # OpenSpec 落契約
  → brainstorming               # Superpowers 補對話
  → writing-plans               # 把 tasks.md 細化成執行單
  → TDD + verification + review # 紀律化實作
  → /opsx:archive               # 合 delta 進主 spec

Bug fix / 小改動（<30 分鐘）
  systematic-debugging + TDD
  跳過 OpenSpec —— change folder 的 overhead 不值得

Refactor
  blast radius < 1 個 module → Superpowers only
  blast radius ≥ 1 個 module → 開 OpenSpec change folder（為了長期可審計）
```

關鍵判斷不是「要不要寫 spec」，而是**這個變更是否值得留下審計紀錄**。30 分鐘以下的改動半年後沒人會回頭看，OpenSpec 的 archive 價值回不了本。

## 結語

不必兩個都用。但若選擇組合，要記得：

- **OpenSpec 的價值在實作後**：archive 留下的設計理由，讓半年後的同事不必翻 git log 與 chat history。
- **Superpowers 的價值在實作中**：TDD、verification、平行化決定了單次任務的品質。

組合的具體場景，[[Superpowers-OpenSpec-OAuth2-8階段實戰]] 用 OAuth2 案例走完 8 階段流程，並列出 6 個常見陷阱。
