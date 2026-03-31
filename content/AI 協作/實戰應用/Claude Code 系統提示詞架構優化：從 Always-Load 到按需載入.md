---
title: Claude Code 系統提示詞架構優化：從 Always-Load 到按需載入
description: 實戰分享如何將 CLAUDE.md 的 16 個 @ import 改為四層按需載入架構，每 session 節省約 15,000 tokens
tags:
  - claude-code
  - prompt-engineering
  - ai-development
  - developer-tools
shortTitle: 系統提示詞按需載入
published: 2026-03-27
draft: false
---

## 前言：一個 @ 符號的代價

在 Claude Code 中，`CLAUDE.md` 是每次對話啟動時自動載入的專案指引檔。許多開發者（包括我自己）會在其中使用 `@path/to/file` 語法引用其他文件，直覺認為這是「按需載入」——Claude 需要時才去讀。

**事實恰好相反。**

`@` import 會在 session 啟動時將引用檔案的**完整內容**展開注入 context window，等同於把整份文件貼進 CLAUDE.md。我的專案原本有 16 處 `@` 引用，指向 12 個文件，包含超長的 BDD spec（54KB）和錯誤處理指南（35KB）。每次開啟新對話，即使只是修一個 typo，也會消耗約 15,000 tokens 載入這些文件。

這篇文章記錄我如何將提示詞架構從「全部推送」重構為「四層按需載入」，以及背後的設計原則。

---

## 四層載入機制

Claude Code 提供四種不同的 context 載入機制，各有不同的觸發時機和 token 成本：

```
Session 啟動
  │
  ├─ Layer 1: CLAUDE.md（always loaded, ~800 tokens）
  │    專案入口：commands、architecture、conventions
  │
  ├─ Layer 2: .claude/rules/（path-triggered）
  │    編輯特定目錄時自動載入對應規則
  │    例：編輯 src/components/** → 載入 react-components.md
  │
  ├─ Layer 3: .claude/skills/（metadata only, ~100 tokens/skill）
  │    只載入 name + description
  │    完整內容在調用時才展開
  │
  └─ Layer 4: 純路徑文字（on-demand Read）
       Claude 判斷需要時主動用 Read 工具讀取
       啟動成本：0
```

### 成本對照表

| 機制 | 載入時機 | 每 session 成本 |
|------|---------|----------------|
| `@path` in CLAUDE.md | 啟動時展開 | 全額（檔案大小） |
| `.claude/rules/` + `paths:` | 編輯匹配檔案時 | 按需（~100-200 tokens/rule） |
| `.claude/skills/` | 啟動時只載 metadata | ~100 tokens/skill |
| 純路徑文字（無 `@`） | Claude 主動 Read | 0（啟動時） |

**關鍵洞察**：`@` import 和沒有 `paths:` frontmatter 的 rules 都是 always loaded。只有帶 `paths:` 的 rules、skills metadata、和純路徑文字才是真正的按需載入。

---

## 實戰案例：PT-Web 的架構重構

### 專案背景

這是一個中型 React + TypeScript 企業應用，使用 Jotai 做狀態管理、TanStack Query 做 server state、Tailwind CSS 做樣式。專案有完善的文件體系，包含錯誤處理指南、i18n 文件、BDD 測試規格等。

### Before：16 個 @ import

原本的 CLAUDE.md Key Documentation table 長這樣：

```markdown
## Key Documentation

| Topic                               | File                                    |
| ----------------------------------- | --------------------------------------- |
| Jotai patterns & structural sharing | @src/lib/jotai/README.md                |
| Error handling flow                 | @docs/standards/error-handling-guide.md |
| DayTimeline drag/stretch BDD        | @docs/daytimeline-workslots-bdd.feature.md |
| ...（共 12 個 @ 引用）              |                                         |
```

每次啟動 session，這 12 個檔案的**完整內容**都會出現在 system-reminder 中。其中 BDD spec 有 54KB、error handling guide 有 35KB，即使你只是要問一個 CSS 問題也會全部載入。

### After：0 個 @ import + 四層按需架構

```markdown
## Key Documentation

IMPORTANT: Read the relevant file below before starting related work.

| Topic                               | File                                          |
| ----------------------------------- | --------------------------------------------- |
| Jotai patterns & structural sharing | src/lib/jotai/README.md                       |
| Error handling flow                 | docs/standards/error-handling-guide.md         |
| DayTimeline drag/stretch BDD        | docs/daytimeline-workslots-bdd.feature.md      |
| ...                                 |                                               |
```

差異只有兩點：
1. 移除所有 `@` 前綴
2. 加入 `IMPORTANT` 提示引導 Claude 主動讀取

但真正的架構變化在背後——搭配 8 個 path-based rules 和 6 個封裝開發流程的 skills（如 code review、testing 等），形成完整的按需載入體系。

### Rules 如何替代 @ import

以 `react-components.md` rule 為例：

```yaml
---
paths:
  - "src/components/**"
  - "src/pages/**"
---

# React 元件規範

## 組件選擇決策樹

1. 內部 UI library 有合適組件？ → 直接使用
2. 可組合現有組件實現？ → 組合使用
3. 都不行 → 建立新組件（src/components/）

完整決策樹見 `docs/standards/decision-trees.md`。
```

當 Claude 編輯 `src/components/` 下的檔案時，這個 rule 會**自動載入**，提供精簡的規範摘要，並指向完整文件。Claude 需要深入了解時，會主動 Read 那份文件。

**這就是 Push-Discovery、Pull-Detail 模式**：rule 推送「發現」，Claude 按需拉取「細節」。

### Token 節省估算

| 指標 | Before | After |
|------|--------|-------|
| 每 session 自動載入文件數 | 12 個完整檔案 | 0 個 |
| 啟動 context 消耗 | ~15,000+ tokens | ~800 tokens |
| 每月節省（假設 100 sessions） | — | ~1.2M tokens |

---

## 最佳實踐

### 官方建議

Anthropic 的 Claude Code Best Practices 文件明確指出：

> **Target under 200 lines per CLAUDE.md file.** For each line, ask: "Would removing this cause Claude to make mistakes?" If not, cut it.

> **Bloated CLAUDE.md files cause Claude to ignore your actual instructions.**

根據社群實測經驗，當 system prompt 中的指令數超過 150-200 條時，LLM 的遵循率會明顯下降。考量 Claude Code 本身的 system prompt 已佔用相當篇幅，留給 CLAUDE.md + rules + skills 的有效空間其實有限。

### 社群共識

從 GitHub issues、社群文章、實際案例中歸納：

1. **Root CLAUDE.md 控制在 60-100 行**，上限 200 行
2. **永遠不要讓 LLM 做 linter 的工作**——格式規範交給 ESLint/Prettier，一行 `pnpm lint:fix` 取代 200 行格式規則
3. **`@` import 只用於真正每次都需要的極少數檔案**（大多數情況下是 0 個）
4. **已被 rules 覆蓋的文件不需要 @ import**——雙重載入只是浪費
5. **用 IMPORTANT 標記關鍵指令**——但不要濫用，否則等於沒標記

### 載入機制決策樹

```
這條知識每個 session 都需要？
├─ 是 → 放在 root CLAUDE.md（保持精簡）
│
├─ 只在特定檔案類型需要？
│   → .claude/rules/ + paths frontmatter
│
├─ 只在特定任務/工作流需要？
│   → .claude/skills/
│
└─ 只在深入研究時需要？
    → 純路徑文字，Claude 按需 Read
```

---

## 總結：從 Push 到 Pull

這次優化的核心轉變是**從「推送所有 context」到「推送發現機制、按需拉取細節」**：

- **CLAUDE.md** 是精簡的入口索引，不是百科全書
- **Rules** 提供 just-in-time 的領域指引，在正確的時機自動載入
- **Skills** 封裝完整的工作流程，只在調用時展開
- **文件路徑** 是指標，不是內嵌——Claude 夠聰明，知道什麼時候該去讀

### Tradeoff：按需載入不是銀彈

這套架構有一個前提假設：Claude 會在正確的時機主動讀取文件。實務上大多數情況表現良好，但偶爾 Claude 會跳過該讀的文件直接開始工作，導致產出不符合規範。應對方式：

- 在 CLAUDE.md 的路徑表格加上 `IMPORTANT: Read the relevant file below before starting related work` 提示
- 對於關鍵規範（如 error handling），優先使用 path-based rules 而非純路徑文字，確保自動載入
- 如果某份文件被跳過的頻率過高，考慮將其摘要提升到 rules 層級

---

這個模式可以直接套用到任何使用 Claude Code 的專案。關鍵不是寫更多指令，而是在正確的層級放置正確的資訊，讓 AI agent 像開發者一樣——需要時查文件，而不是把所有文件背在身上。