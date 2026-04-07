---
title: "AI 軟體工程工作流 2026：從 Spec-Driven 到 Superpowers 的實戰指南"
description: "深入解析 2025-2026 年六大主流 AI 軟體工程工作流方案，涵蓋 Spec-Driven Development、TDD + Agentic Coding、Multi-Agent Teams、Background Agents、Plan-Act-Reflect 及 CI/AI，並以 Superpowers Framework 為例展示完整實踐流程。"
tags:
  - ai
  - software-engineering
  - tdd
  - agentic-coding
  - superpowers
  - claude-code
  - workflow
published: 2026-03-27
draft: false
status: published
shortTitle: AI 軟體工程工作流 2026
---

**TL;DR:** 2025-2026 年 AI 軟體工程工作流已從「autocomplete」進化到「autonomous agent」。本文整理六大主流方案，深入 TDD + Agentic Coding 的實踐方式，並以 Superpowers Framework（100K+ stars）為例，展示完整的 14 個 skill 如何組合成可落地的開發流程。80% 的日常開發只需要一條黃金路徑：`brainstorming → writing-plans → subagent-driven-development → finishing`。

> 本文假設讀者熟悉 TypeScript、React/Next.js 和基本的 TDD 概念。如果你還沒接觸過 AI coding agent，建議先試用 Claude Code 或 Cursor 體驗基本互動。

## 為什麼需要 AI 工作流？

2023 年開發者要的是更好的 autocomplete。2024 年是多檔案編輯。到了 2025 年，開發者開始把整個工作流委派給 AI agent。

但「直接叫 AI 寫程式」和「用結構化工作流讓 AI 產出 production-ready code」之間有巨大落差。沒有工作流的 AI coding，就像沒有 code review 的團隊開發——看起來很快，但技術債會吃掉你。

**關鍵數據（2025-2026）：**
- 85% 開發者定期使用 AI 工具（JetBrains 2025 State of Developer Ecosystem）
- 超過 40% 的新寫程式碼由 AI 生成，但仍需經人類 review 確保品質
- AI agent 在結構化任務上的自主能力持續提升，METR Time Horizons 研究追蹤 50% 成功率對應的任務時長已達數小時級別
- 開發速度提升 26-55%（依任務類型與開發者經驗差異極大，部分研究顯示複雜任務效果有限）

## 六大主流方案總覽

| # | 方案 | 核心理念 | 適用場景 |
|---|------|---------|---------|
| 1 | Spec-Driven Development | 先寫規格再讓 AI 實作 | 新功能、系統重構 |
| 2 | TDD + Agentic Coding | 測試即規格，AI 在 red-green-refactor 中實作 | API、核心邏輯 |
| 3 | Multi-Agent Teams | 不同 agent 分工並行 | 大型 codebase、monorepo |
| 4 | Background / Headless Agents | Agent 背景自主執行 | dependency 更新、安全修補 |
| 5 | Plan-Act-Reflect Loop | 規劃 → 實作 → 反思三階段 | 日常通用模式 |
| 6 | AI-Native CI/CD (CI/AI) | AI 嵌入交付管線 | 自動 review、self-healing PRs |

這些方案不互斥。實務上是組合使用的。

---

## 方案一：Spec-Driven Development (SDD)

先寫規格，再讓 AI 實作。規格成為程式的第一公民。

**工作流：**
1. **Specify** — 撰寫高層次需求描述，AI 協助細化成詳細規格
2. **Plan** — 確定技術架構、stack 選擇、約束條件
3. **Tasks** — Agent 將規格拆解為可 review 的小任務
4. **Implement** — AI agent 依規格逐步產出程式碼

**工具支援：**
- [GitHub Spec Kit](https://github.com/github/spec-kit)（82K+ stars）— 支援 20+ AI 平台
- Kiro（by AWS）— 3 階段 spec-to-production 工作流
- Claude Code Plan Mode — 先分析再實作

**優勢：** 產出品質高、可追溯、減少反覆修改
**限制：** 前期投入時間較長，不適合極小修改

---

## 方案二：TDD + Agentic Coding（重點深入）

測試即規格。先寫測試，AI agent 在 red-green-refactor 迴圈中自動實作。

### 為什麼 TDD 是 AI Agent 最佳搭檔？

AI agent 預設行為是「先寫實作再補測試」。TDD 翻轉這個模式——測試成為 agent 的合約，定義行為邊界，讓 AI 從「猜測你要什麼」變成「精確實作你定義的行為」。

### 三階段工作流

**Phase 1: RED — 寫失敗測試**

```
prompt: "我們用 TDD 開發。先為 [功能] 寫 FAILING 測試。
程式碼還不存在，測試必須失敗。不要寫任何實作。
只寫測試檔，跑測試，給我看失敗輸出。"
```

測試要因為「function 不存在」而失敗，不是因為語法錯誤。確認失敗後 commit。

**Phase 2: GREEN — 最小實作**

```
prompt: "現在實作最少的程式碼讓所有測試通過。
只寫測試要求的，不多做任何事。"
```

Agent 自動跑測試、修正、重跑，直到全綠。

**Phase 3: REFACTOR — 改善品質**

```
prompt: "重構實作，提升可讀性和維護性。
所有測試必須保持綠燈——它們是你的安全網。"
```

### CLAUDE.md TDD 設定範本

```markdown
## TDD Rules (MANDATORY)
- **Always write failing tests BEFORE implementation**
- Use Arrange-Act-Assert (AAA) pattern
- One assertion per test
- Test names describe behavior: `should_return_empty_array_when_no_items`
- Do NOT write implementation before tests
- Do NOT combine "write tests + implementation" in one prompt

## Testing Framework
- Framework: Vitest
- Test directory: `src/__tests__/`
- Test file naming: `*.test.ts`
- Run: `pnpm test`
- Coverage minimum: 95% lines, 90% branches
```

### 常見陷阱與解法

| 陷阱 | 原因 | 解法 |
|------|------|------|
| AI 跳過 RED phase | 預設行為是 impl-first | prompt 明確寫「FAILING test」「不要寫實作」 |
| Over-mocking | AI mock 一切讓測試假通過 | 用 integration test + 真實 DB（in-memory） |
| 測試名稱太模糊 | `should work` 無法引導 AI | 用 `should_[行為]_when_[條件]` 格式 |
| AI 卡在修 bug 迴圈 | 嘗試 3 次同方向都失敗 | 中斷 → git revert → 換方法 |
| Context window 爆滿 | 累積太多 test + impl | 每階段 commit，用 subagent 隔離 context |
| 測試只驗 mock 不驗行為 | `expect(mock).toHaveBeenCalled()` | 改驗實際輸出：`expect(result.name).toBe('Alice')` |

### 測試框架搭配建議（React/Next.js/TypeScript）

| 層級                  | 框架                       | AI Agent 效果              |
| ------------------- | ------------------------ | ------------------------ |
| Unit（邏輯/utils）      | Vitest                   | 極佳 — 快速回饋迴圈              |
| Component（UI 行為）    | Testing Library + Vitest | 好 — 用 `getByRole` 測使用者行為 |
| Integration（API/DB） | Vitest + 真實 DB           | 極佳 — 防止 over-mocking     |
| E2E（完整流程）           | Playwright               | 好 — 寫 scenario 清晰的 E2E   |

---

## 方案三至六：快速概覽

### Multi-Agent Teams

不同 agent 扮演不同角色，並行處理任務。

| 模式 | 說明 | 適用情境 |
|------|------|----------|
| Sequential Pipeline | Agent A → B → C 流水線 | 明確的階段性工作流 |
| Orchestrator + Subagents | 主 agent 調度多個專門 agent | 多領域任務 |
| Generator + Critic | 產生 → 審查迴圈 | Code review、內容驗證 |
| Parallel Workers | 多個 agent 同時處理不同任務 | 大規模重構、monorepo |

工具支援包括 Claude Code Agent Teams（Opus 4.6）、Cursor 2.0（最多 8 個 agent 並行）、JetBrains Central、CrewAI / LangGraph / MetaGPT。

### Background / Headless Agents

Agent 在背景自主執行：透過 GitHub Issue 指派任務 → Agent clone repo 並實作 → 自動開 PR 等待 review。

代表工具：GitHub Copilot Coding Agent、Claude Code headless mode、Devin（Goldman Sachs 已部署）、VS Code Background Agents。

### Plan-Act-Reflect Loop

每個任務經歷「規劃 → 實作 → 反思」三階段。搭配最佳實踐：每次只餵一個 function / bug / feature，白名單限制可修改的檔案，人類在每個 sub-task 後 review。

### AI-Native CI/CD (CI/AI)

從 CI/CD 進化為 CI/AI：Self-healing PRs（CI 失敗後 agent 自動修復）、AI Code Review（GitHub Copilot Code Review 已累計超過 6,000 萬次 reviews）、自動化測試生成、部署風險評估。

---

## 跨方案共通：Agent 設定檔

| 工具 | 設定檔 |
|------|--------|
| Claude Code | `CLAUDE.md` + `.claude/rules/` |
| Cursor | `.cursorrules` 或 `.cursor/rules/` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurf/rules` |
| 跨工具通用 | `AGENTS.md`（新興標準） |

---

## Superpowers Framework：14 個 Skill 的完整實踐

### 什麼是 Superpowers？

[Superpowers](https://github.com/obra/superpowers)（100K+ stars）是由 Jesse Vincent (obra) 開發的開源 agentic skills 框架與軟體開發方法論。它是一組可安裝的 plugin/skills，教 Claude Code 遵循結構化的開發流程。

- 不是 Claude Code 內建功能
- 不是簡單的 prompt template
- 是一套**強制執行的工作流系統**，TDD 是核心且不可跳過

### 安裝（30 秒）

```bash
# Claude Code 2.0.13+
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
# 重啟 Claude Code
```

### 全部 14 個 Skills

| # | Skill 名稱 | 類型 | 觸發方式 | 說明 |
|---|-----------|------|---------|------|
| 1 | **using-superpowers** | Meta | 自動（基礎層） | 框架核心：找到適用 skill 後強制執行 |
| 2 | **brainstorming** | Process | 手動/自動 | Socratic 問答釐清需求 → 產出 design spec |
| 3 | **using-git-worktrees** | Utility | 手動 | 建立隔離開發分支，保護 main branch |
| 4 | **writing-plans** | Process | 自動（brainstorm 核准後） | 拆解為 2-5 分鐘 micro-tasks |
| 5 | **executing-plans** | Process | 手動（二擇一） | 同一 context 內逐步執行 plan |
| 6 | **subagent-driven-development** | Process | 手動（二擇一） | 每個 task 啟動新 agent + 雙階段 review |
| 7 | **test-driven-development** | Pattern | 自動（執行期間） | 強制 RED → GREEN → REFACTOR |
| 8 | **systematic-debugging** | Process | 手動（遇 bug 時） | 4 階段根因分析，3 次失敗後質疑架構 |
| 9 | **dispatching-parallel-agents** | Utility | 手動 | 多個獨立問題並行處理 |
| 10 | **requesting-code-review** | Collaboration | 手動/自動 | 派 reviewer subagent，按嚴重度分類回饋 |
| 11 | **receiving-code-review** | Collaboration | 手動 | 處理 review 回饋，可合理 push back |
| 12 | **verification-before-completion** | Discipline | 自動（永遠啟用） | 任何聲明都需要 fresh 證據 |
| 13 | **finishing-a-development-branch** | Process | 自動（執行完後） | merge / PR / 保留 / 放棄 四選一 |
| 14 | **writing-skills** | Meta | 手動 | 建立自訂 skill（TDD 方式寫文件） |

### 完整 Feature 開發流程

```
用戶："我要建一個 user authentication 系統"
│
▼ ① using-superpowers（自動）
│   檢查有無適用 skill → 發現需要 brainstorming
│
▼ ② brainstorming（自動觸發）
│   1. 掃描現有 codebase
│   2. 逐一問：JWT or Session? 2FA? Social login?
│   3. 提出 2-3 種方案 + trade-offs
│   4. 產出 design doc
│   5. 自我審查 spec（找矛盾、placeholder）
│   ⛔ 等待用戶核准（不核准不往下）
│
▼ ③ using-git-worktrees（手動或自動）
│   建立 worktree → 隔離分支
│   偵測專案類型 → 安裝 deps → 跑測試確認基線
│
▼ ④ writing-plans（brainstorm 核准後自動觸發）
│   1. 驗證 scope（一個內聚系統）
│   2. 設計檔案結構
│   3. 拆解 micro-tasks（每個 2-5 min）
│   4. 產出 plan document
│   ⛔ 讓用戶選擇執行方式：
│      A) subagent-driven-development（品質優先）
│      B) executing-plans（速度優先）
│
▼ ⑤ 執行（以 subagent-driven-development 為例）
│
│   ┌── Task N ────────────────────────────────┐
│   │ Fresh Agent 啟動（全新 context）            │
│   │                                            │
│   │ ⑥ test-driven-development（自動觸發）      │
│   │    RED:   寫 failing test                  │
│   │    GREEN: 寫最小實作讓 test pass           │
│   │    REFACTOR: 改善品質，保持綠燈             │
│   │                                            │
│   │ ⑦ requesting-code-review（自動觸發）       │
│   │    Stage 1: Spec 合規性                    │
│   │    Stage 2: 程式碼品質                      │
│   │                                            │
│   │ ⑧ verification-before-completion（自動）   │
│   │    跑測試 → 讀完整輸出 → 確認 pass         │
│   └────────────────────────────────────────────┘
│   ... 每個 task 重複（每個都是全新 agent）
│
▼ ⑨ finishing-a-development-branch（自動觸發）
    1. 跑全部測試 → 確認 pass
    2. 提供四選項：Merge / PR / Keep / Discard
    3. 清理 worktree
```

### TDD 強制機制

Superpowers 不是建議你寫測試，而是讓你無法跳過：

1. Agent 準備寫 feature code
2. Skill 檢查：「是否有 failing test？」
3. 有 → 允許進入實作（GREEN phase）
4. 沒有 → **自動刪除已寫的程式碼** → 強制回到 RED phase

結果：自動達到 85-95% 測試覆蓋率。

### 兩條執行路徑比較

| 維度 | subagent-driven-development | executing-plans |
|------|---------------------------|-----------------|
| Context | 每 task 全新 agent | 同一 context 連續執行 |
| 品質 | 較高（無 context drift） | 較快但可能 drift |
| 自主時長 | 2-4+ 小時 | 10-15 分鐘就需人類介入 |
| Code Review | 雙階段（spec + quality） | 依賴 verification skill |
| 適合 | 大功能、多 task、品質優先 | 小改動、快速迭代 |

---

## 最推薦的 Skill 組合方式

### 黃金組合：日常新功能開發（80% 的任務）

```
brainstorming → writing-plans → subagent-driven-development → finishing
```

TDD、code review、verification 會自動觸發，你不用手動啟動。

適用：新 feature、新 page、新 API endpoint、新 component library。

### 快速組合：小功能 / 明確需求

```
writing-plans → executing-plans → finishing
```

需求已經很清楚（設計稿確定、ticket 已寫好 AC），不需要 brainstorm。用 executing-plans 而非 subagent，因為任務小，同 context 更快。

### Bug Fix 組合

```
systematic-debugging → TDD → verification → finishing
```

4 階段找根因 → 先寫重現 bug 的 failing test → 修復 → 確認沒破壞其他東西。

### 大規模重構組合

```
brainstorming → writing-plans → dispatching-parallel-agents → finishing
```

把獨立的 task 群組分給不同 agent 同時跑，各自 TDD，最後整合測試。

### 組合選擇決策樹

```
需求是否明確？
├── 不明確 → brainstorming 開始
│   └── 需求確認後 → writing-plans
│       └── Task 數量？
│           ├── 1-2 個 → executing-plans（快速）
│           ├── 3-5 個 → subagent-driven-development（品質）
│           └── 6+ 個且可並行 → dispatching-parallel-agents
│
├── 明確（有設計稿/AC）→ writing-plans 開始
│   └── 同上 Task 數量判斷
│
└── 是 bug fix → systematic-debugging 開始
    └── 找到根因 → TDD（寫重現測試 → 修復）
```

---

## 實際場景演練：Next.js 通知系統

以下以「在 Next.js App Router 加一個用戶通知系統」為例，完整走一次 Superpowers 流程。

### Step 1：Brainstorming

Claude 不會直接寫程式，而是開始問你：

```
1. 通知的資料來源？（SSE / Polling / 僅載入時 fetch）
2. 通知的 scope？（header bell icon / 獨立頁面 / 兩者都要）
3. 後端已有 notification API 嗎？
4. 需要支援哪些通知類型？
```

你回答後，Claude 提出設計方案，包含：
- 架構（NotificationProvider + useNotifications hook + NotificationBell component）
- Server vs Client Component 劃分
- API 端點設計
- 完整檔案結構

你核准後，產出 spec 檔。

### Step 2：Writing Plans

Claude 產出 plan，拆成 6 個 micro-tasks：

1. `useNotifications` hook + tests（5 min）
2. `NotificationProvider` + tests（3 min）
3. `NotificationItem` + `NotificationList` + tests（5 min）
4. `NotificationBell` (dropdown) + tests（5 min）
5. `/notifications` page + tests（5 min）
6. Integration test（3 min）

### Step 3：Subagent-Driven Development

以 Task 1 為例——`useNotifications` hook：

**RED Phase：** Agent 先寫 5 個 failing tests：

```typescript
// src/__tests__/useNotifications.test.ts
describe('useNotifications', () => {
  test('should fetch notifications on mount', async () => {
    // ...setup TanStack Query wrapper + mock fetch
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.notifications).toHaveLength(2);
    });
  });

  test('should compute unreadCount correctly', async () => {
    // ...
    expect(result.current.unreadCount).toBe(1);
  });

  test('should mark notification as read', async () => {
    // ...
    expect(fetch).toHaveBeenCalledWith('/api/notifications/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
  });

  test('should mark all as read', async () => { /* ... */ });
  test('should clear all notifications', async () => { /* ... */ });
});
```

```
$ pnpm test useNotifications
Tests: 5 failed, 0 passed  ← RED ✓（module 不存在）
```

**GREEN Phase：** Agent 寫最小實作：

```typescript
// src/hooks/useNotifications.ts
export function useNotifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 30_000,
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  // ...markAsRead, markAllAsRead, clearAll mutations

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearAll };
}
```

```
$ pnpm test useNotifications
Tests: 5 passed  ← GREEN ✓
```

**Code Review（自動觸發）：**

```
Stage 1 — Spec 合規性：✓ 全部符合 spec
Stage 2 — 程式碼品質：✓ TypeScript strict、TanStack Query patterns 正確
→ 無 Critical issue，通過
```

Task 2-6 同樣流程，每個都是新 agent。

### 最終結果

```
✓ 全部測試通過：52/52 tests (新增 25 個)
✓ 測試覆蓋率：92% lines, 88% branches
✓ TypeScript 編譯無錯誤
→ Push + Create PR
```

---

## 實際場景演練：Bug Fix

場景：`NotificationBell` 在 API 回傳空陣列時顯示 NaN。

**Systematic Debugging：**

```
Phase 1 — 根因調查：
追蹤資料流 → useNotifications.ts → notifications.filter(n => !n.read).length
→ 當 API error 時 TanStack Query 的 data 是 undefined，不是 []
→ undefined.filter 爆炸 → NaN
```

**TDD — 寫重現測試：**

```typescript
test('should return unreadCount 0 when API returns error', async () => {
  (fetch as any).mockRejectedValueOnce(new Error('API Error'));
  const { result } = renderHook(() => useNotifications(), {
    wrapper: createWrapper(),
  });
  await waitFor(() => {
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications).toEqual([]);
  });
});
```

RED ✓ → 修復（加 `placeholderData: []`）→ GREEN ✓ → PR。

---

## 實際場景演練：大規模重構

場景：把 12 個 REST API endpoint 遷移到 tRPC。

**Brainstorming** 確認遷移策略（Strangler fig）→ **Writing Plans** 分 3 群組 → **Dispatching Parallel Agents** 三組同時 TDD：

```
Agent A → Auth endpoints（login, register, me, logout）
Agent B → Notification endpoints
Agent C → Content endpoints（posts, comments）
```

各自 TDD，最後整合測試。89/89 tests 通過 → PR。

---

## Trade-offs 與限制

| 限制 | 何時影響 |
|------|---------|
| Overhead for exploration | 快速 prototype 時結構化流程太重 |
| 2-5 min task 粒度 | 不是所有任務都能拆這麼細 |
| TDD 強制不可關閉 | Legacy codebase 難以 test-first |
| Token 成本 | Subagent 模式每個 task 消耗一次 context |
| 學習曲線 | 團隊需要理解 14 個 skill 的分工 |

**Superpowers 不適合：** 5-10 分鐘的小 bug fix、探索性 prototype、拋棄式程式碼、既有無測試的 legacy codebase。

**Superpowers 適合：** Production code、多週專案、複雜功能、需要長期維護的程式碼。

---

## 結論

2026 年的 AI 軟體工程工作流，核心思路是三個字：**結構化**。

不管你選哪個方案，共通原則是：
1. **先規劃再動手** — brainstorming / spec / plan 不可省略
2. **測試即合約** — TDD 讓 AI 有明確的成功標準
3. **分而治之** — 拆成 micro-tasks，用 subagent 隔離 context
4. **自動品質把關** — code review + verification 嵌入流程

如果只記一條路徑，記這個：

```
brainstorming → writing-plans → subagent-driven-development → finishing
```

80% 的日常開發，這條黃金路徑就夠了。

## Further Reading

- [Superpowers GitHub](https://github.com/obra/superpowers) — 主 repo（100K+ stars）
- [Agentic Coding Handbook - TDD](https://tweag.github.io/agentic-coding-handbook/WORKFLOW_TDD/) — TDD 工作流參考
- [Addy Osmani's LLM Coding Workflow 2026](https://addyosmani.com/blog/ai-coding-workflow/) — 個人工作流分享
- [Latent Space: AI Agents meet TDD](https://www.latent.space/p/anita-tdd) — Podcast 深入討論
- [Superpowers Explained](https://blog.devgenius.io/superpowers-explained-the-claude-plugin-that-enforces-tdd-subagents-and-planning-c7fe698c3b82) — 框架解析（Medium 付費文章）
