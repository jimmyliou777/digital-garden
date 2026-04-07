---
title: OpenSpec 使用指南：Spec-Driven 開發工作流
shortTitle: OpenSpec 使用指南
description: 完整整理 OpenSpec 的核心概念、命令用法、Delta Specs 機制與多 Phase 專案實踐，適用於 Claude Code、Cursor 等 AI 開發工具的 Spec-Driven Development 工作流
tags: [OpenSpec, Developer Tools, AI Workflow, Claude Code]
published: 2026-04-01
draft: true
---

**TL;DR：** OpenSpec 是一個 Spec-Driven Development 框架，讓人與 AI 在寫程式碼前先對齊需求。透過 delta specs 支援既有專案，提供簡潔（4 步）與完整（8 步）兩套工作流。

## 核心概念

**Spec-Driven Development (SDD)** — 先對齊需求再寫程式碼。Spec 是 source of truth，隨每次 archive 演進。

五大原則：

- **Fluid not rigid** — Actions, not phases；靈活移動，不被流程卡住
- **Iterative not waterfall** — 需求可以變，spec 不是一開始就凍結
- **Easy not complex** — 最小設置成本，輕量框架
- **Built for brownfield** — 支援既有專案，不只是全新專案
- **Scalable** — 個人專案到企業團隊都適用

## 目錄結構

```
openspec/
├── specs/                    # 主規格（source of truth）
│   ├── authentication/
│   │   └── spec.md
│   └── api/
│       └── spec.md
├── changes/                  # 進行中的變更
│   ├── my-feature/
│   │   ├── proposal.md       # 為什麼做、做什麼
│   │   ├── design.md         # 怎麼做、架構決策
│   │   ├── specs/            # Delta specs（差異規格）
│   │   │   └── api/
│   │   │       └── spec.md
│   │   └── tasks.md          # 實作清單
│   └── archive/              # 已完成的變更
└── config.yaml               # 專案設定
```

### Artifact 說明

| 檔案 | 用途 |
|------|------|
| `proposal.md` | 為什麼做、做什麼、價值主張 |
| `design.md` | 技術方案、架構決策、權衡取捨 |
| `specs/` | Delta specs — 只描述與 main spec 的差異 |
| `tasks.md` | 可執行的實作清單，具體步驟 |

## 兩套工作流

### 簡潔版（Core Profile）— 快速功能開發

```
/opsx:propose → /opsx:apply → /opsx:archive
```

適用：30 分鐘到 2 小時的功能開發。

### 完整版（Expanded）— 精細控制

```
/opsx:new → /opsx:continue 或 /opsx:ff → /opsx:apply → /opsx:verify → /opsx:sync → /opsx:archive
```

適用：大型功能、多 phase 專案、需要驗證的場景。

## 命令完整說明

### 規劃階段

| 命令 | 做什麼 | 產出 |
|------|--------|------|
| `/opsx:explore` | 腦力激盪、釐清需求，不產出 artifact | 思考筆記 |
| `/opsx:propose <idea>` | 一步到位產出所有 artifact | proposal + design + specs + tasks |
| `/opsx:new` | 只建立 change scaffold | proposal.md（骨架） |
| `/opsx:continue` | 逐步建立下一個 artifact | 依序：proposal → design → specs → tasks |
| `/opsx:ff` | 快轉，一次產完剩餘 artifact | 跳過逐步確認，批次產出 |

### 實作階段

| 命令 | 做什麼 |
|------|--------|
| `/opsx:apply` | 根據 tasks.md 開始寫程式碼 |
| `/opsx:verify` | 驗證實作是否符合 spec 的所有 requirement |

### 收尾階段

| 命令 | 做什麼 |
|------|--------|
| `/opsx:sync` | 將 delta spec 合併到 main spec（不歸檔） |
| `/opsx:archive` | 歸檔 change，移到 archive/，同時合併 delta spec |
| `/opsx:bulk-archive` | 批次歸檔多個 changes |

### 輔助

| 命令 | 做什麼 |
|------|--------|
| `/opsx:onboard` | 互動教學，帶你走完整個工作流 |

> **語法差異**：Claude Code 用 `/opsx:propose`，Cursor/Windsurf 用 `/opsx-propose`。

## Delta Specs 機制

Delta spec 不是重寫整份規格，而是只描述**差異**，這是 OpenSpec 支援 brownfield 的關鍵設計：

```markdown
## ADDED Requirements      ← 新增的需求
### Requirement: 新功能
系統 SHALL 做某件事。

#### Scenario: 基本場景
- **WHEN** 使用者做 X
- **THEN** 系統做 Y

## MODIFIED Requirements   ← 修改既有需求（只寫變更部分）
### Requirement: 已有功能
#### Scenario: 新增的場景
- **WHEN** 使用者做 A
- **THEN** 系統做 B

## REMOVED Requirements    ← 刪除的需求
### Requirement: 棄用功能

## RENAMED Requirements    ← 重命名
- FROM: `### Requirement: 舊名`
- TO: `### Requirement: 新名`
```

**智慧合併原則**：Delta 代表的是意圖，不是全量替換。MODIFIED 下只需寫新增的 scenario，不需要複製既有的。

## CLI 終端指令

```bash
openspec init                    # 初始化專案
openspec list [--json]           # 列出所有 specs 和 changes
openspec show <change-name>      # 顯示 change 詳情
openspec status                  # 當前工作流狀態
openspec validate                # 檢查 artifact 結構
openspec archive <change-name>   # 歸檔（CLI 版）
```

## 多 Phase 專案實踐

當一個 change 包含多個 phase 的 tasks（如 `tasks.md`、`tasks-phase2.md`...），建議流程：

```
Phase 1:
  /opsx:apply              ← 實作 tasks.md
  /opsx:verify             ← 驗證實作
  /opsx:sync               ← 同步 delta spec 到 main spec

Phase 2:
  cp tasks-phase2.md tasks.md   ← 切換任務檔
  /opsx:apply              ← 實作 phase 2
  /opsx:verify
  /opsx:sync               ← 如有新增 delta spec

Phase 3-4: 同理

全部完成後:
  /opsx:archive            ← 歸檔整個 change
```

> `/opsx:apply` 預設讀取 `tasks.md`，所以跨 phase 最可靠的做法是替換該檔案。

## Change 生命週期圖

```
START
  ↓
propose / new       → 建立 proposal.md, delta specs, design.md, tasks.md
  ↓
explore / continue  → 迭代精煉 artifact（可隨時修改任何 artifact）
  ↓
ff（可選）          → 批次產出剩餘 artifact
  ↓
apply               → 實作程式碼
  ↓
verify（可選）      → 驗證程式碼符合 spec
  ↓
sync（可選）        → 合併 delta spec 到 main spec
  ↓
archive             → 歸檔 change，更新 source of truth
  ↓
END
```

## 安裝

```bash
# 需求：Node.js >= 20.19.0
npm install -g @fission-ai/openspec@latest

# 初始化專案
cd your-project
openspec init

# 指定工具整合
openspec init --tools claude,cursor
```

## 參考資源

- [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec)
- 最佳搭配模型：Claude Opus 4.5+、GPT 5.2+（高推理能力模型表現最佳）
