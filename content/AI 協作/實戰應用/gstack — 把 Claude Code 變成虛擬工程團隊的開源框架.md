---
title: gstack — 把 Claude Code 變成虛擬工程團隊的開源框架
shortTitle: gstack 虛擬工程團隊框架
description: 深入分析 Y Combinator CEO Garry Tan 開源的 gstack 框架，從 Browse System daemon 架構、SKILL.md 模板引擎到 sprint pipeline 設計，拆解它如何將 Claude Code 打造成結構化的虛擬工程團隊
tags: [AI, Claude Code, Developer Tools, Open Source, Architecture]
published: 2026-03-24
draft: false
status: published
---

**TL;DR：** gstack 是 Y Combinator CEO Garry Tan 開源的 Claude Code skill 集合（Skill 是 Claude Code 的擴充模組，透過 slash command 觸發特定工作流程），透過 28 個 slash command 將單一 AI agent 拆分成 CEO、工程主管、設計師、QA、SRE 等角色，實現結構化的 sprint 流程。技術上最有意思的是它的 **persistent Chromium daemon**（用 accessibility tree 建立 ref system 讓 AI 操作真實瀏覽器）和 **SKILL.md 模板引擎**（從 `.tmpl` 生成跨 agent 相容的結構化 prompt）。MIT 授權，30 秒安裝。

> 本文預設讀者熟悉 Claude Code 基本操作與 Playwright。如果你還沒用過 Claude Code，建議先從[官方文件](https://docs.anthropic.com/en/docs/claude-code)開始。

## 為什麼這件事值得關注

Garry Tan 不是純粹的 AI 工具開發者——他是 Y Combinator 的現任 President & CEO，曾是 Palantir 的早期工程師，也是 Posterous（後被 Twitter 收購）的共同創辦人。他的背景同時橫跨技術與產品。

根據他的說法，他在 60 天內產出了 **600,000+ 行 production code**（35% 是測試），每天 10,000-20,000 行，而且這些是在全職經營 YC 的同時完成的。需要注意的是，程式碼行數和工程品質的密度不成正比——600K 行中有 35% 是測試，且 AI 生成的程式碼在 boilerplate 密度上通常高於人工撰寫，這個數字更適合理解為「AI 可以處理的工作量規模」，而非「等同人工的產出品質」。但核心觀點清楚：**一個人加上對的工具鏈，可以達到傳統小型團隊的產出量**。

這與 Andrej Karpathy 在 2026 年初說的方向一致：「我大概從十二月開始就沒有真正打過一行程式碼了。」工具層的成熟正在重新定義「一個人能做多少事」。

## 核心理念：結構化的 Sprint 流程

gstack 不只是一堆零散的工具。它的核心設計是一條完整的 sprint pipeline：

![[gstack-sprint-pipeline.excalidraw.light.svg]]

每個 skill 的輸出會被下游 skill 讀取。例如：

1. `/office-hours` 輸出 design doc
2. `/plan-ceo-review` 讀取 design doc 做 scope review
3. `/plan-eng-review` 輸出 test plan 與架構圖
4. 開發者實作
5. `/review` 自動找 bug 並修復明顯問題
6. `/qa` 開啟真實瀏覽器跑 QA 並產生 regression test
7. `/ship` 跑測試、開 PR
8. `/retro` 做回顧

這解決了 AI coding 的一個根本問題：**沒有流程的 agent 就是混亂的來源**。十個平行的 agent 如果各做各的，結果只會更糟。gstack 的價值在於給每個 agent 明確的角色邊界和上下游關係。

背後有兩個核心哲學（定義在 `ETHOS.md`）：

- **Boil the Lake**：AI 讓「做完整」的邊際成本趨近於零。當完整實作只比捷徑多花幾分鐘，永遠選完整的。但有分寸——「lake」（模組的完整測試覆蓋）可以 boil，「ocean」（跨季度的平台重寫）不行。
- **Search Before Building**：三層知識模型——Layer 1（標準做法）、Layer 2（社群趨勢）、Layer 3（第一性原理推導）。最有價值的發現是「為什麼常規做法是錯的」，這類發現會被記錄到 `~/.gstack/analytics/eureka.jsonl`。

## 28 個 Skills 全覽

### Planning & Architecture — 動手之前先想清楚

| Skill | 角色 | 做什麼 |
|-------|------|--------|
| `/office-hours` | YC Office Hours | 六個 forcing questions 重新定義你的產品方向，挑戰你的前提假設 |
| `/plan-ceo-review` | CEO | 四種模式（Expansion / Selective Expansion / Hold Scope / Reduction）重新審視 scope |
| `/plan-eng-review` | Engineering Manager | 鎖定架構、data flow diagram、edge cases、test matrix |
| `/plan-design-review` | Senior Designer | 每個設計維度 0-10 評分，說明 10 分長什麼樣，偵測 AI slop |
| `/design-consultation` | Design Partner | 從 landscape research 開始，建立完整的 design system |

`/office-hours` 的設計很有意思——它不是直接幫你寫 code，而是先挑戰你的需求定義。在 README 的範例中，使用者說「我想做一個 daily briefing app」，agent 回應：「你描述的其實不是 briefing app，是 personal chief of staff AI。」這種重新框架的能力，比直接生成 code 更有價值。而且它有硬性限制：**不會調用任何實作相關的 skill、不寫任何 code**，輸出只有 design document。

### Development & Review — 品質把關

| Skill | 角色 | 做什麼 |
|-------|------|--------|
| `/review` | Staff Engineer | 找出通過 CI 但會在 production 爆炸的 bug，自動修明顯問題 |
| `/investigate` | Debugger | 系統性 root cause 分析，Iron Law：沒有調查就不修 |
| `/qa` | QA Lead | 開真實 Chromium 瀏覽器測試，找到 bug 後做 atomic commit + regression test |
| `/qa-only` | QA Reporter | 純報告，不動 code |
| `/cso` | Chief Security Officer | OWASP Top 10 + STRIDE threat model，8/10+ confidence gate |

`/review` 的實作細節值得一看：它跑 **two-pass checklist**（先 CRITICAL 再 INFORMATIONAL），有 scope drift detection（偵測 PR 是否偏離原始目標），還有 **Fix-First workflow**——機械性問題自動修，需要判斷的問題批次彙整成一個 `AskUserQuestion` 讓使用者決定。最後還有一個 adversarial self-review step，讓 agent 自己質疑自己的 review。

`/qa` 內建了自律機制：**WTF-likelihood heuristic**。每個風險行為會累加分數（revert: +15%、修改超過 3 個檔案: +5%），超過 20% 強制停下來問使用者，硬上限 50 個 fixes。

`/investigate` 有個嚴格規則：**連續 3 次不同方法都失敗就停下來**，列出嘗試過的方法和失敗原因，避免 agent 陷入無限重試的迴圈。

### Deployment & Monitoring — 從 PR 到 Production

| Skill | 角色 | 做什麼 |
|-------|------|--------|
| `/ship` | Release Engineer | Sync main、跑測試、audit coverage、push、開 PR |
| `/land-and-deploy` | Release Engineer | Merge PR → 等 CI → deploy → 驗證 production health |
| `/canary` | SRE | Post-deploy 監控：console errors、performance regressions |
| `/benchmark` | Performance Engineer | Baseline page load times、Core Web Vitals、resource sizes |

這四個 skill 組成完整的 deployment pipeline。從「code ready」到「verified in production」只需要幾個 command。

### Safety & Control — 防止 Agent 暴走

| Skill | 做什麼 |
|-------|--------|
| `/careful` | 在 `rm -rf`、`DROP TABLE`、`force-push` 前警告 |
| `/freeze` | 鎖定 file edit 範圍到指定目錄 |
| `/guard` | `/careful` + `/freeze` 合併版 |
| `/unfreeze` | 解除 `/freeze` 邊界 |
| `/codex` | 用 OpenAI Codex CLI 做獨立 code review（第二意見） |

Safety skills 是容易被忽略但極度重要的部分。AI agent 有能力執行破壞性命令，`/careful` 和 `/freeze` 提供了必要的護欄。`/codex` 則是跨模型驗證——用不同的 AI 來 review 同一份 code，降低單一模型盲點的風險。

### Utility — 工作流程黏合劑

| Skill | 做什麼 |
|-------|--------|
| `/browse` | 真實 Chromium 瀏覽器，~100ms per command |
| `/retro` | 團隊級週回顧，per-person breakdowns，跨專案支援 |
| `/document-release` | 自動更新專案文件，抓出過時的 README |
| `/setup-browser-cookies` | 從 Chrome/Arc/Brave/Edge 匯入 cookies 做 authenticated testing |
| `/autoplan` | 一鍵跑完 CEO → design → eng review pipeline |

## 技術架構深入：Browse System

Browse System 是 gstack 技術含量最高的部分——一個 persistent headless Chromium daemon，讓 AI agent 能用 sub-second latency 操作真實瀏覽器。

> [!tip] 更多讓 AI 操作瀏覽器的方案比較，見 [[AI E2E 測試實戰：用 Claude Code 平行代理同時操控三個瀏覽器驗證你的網站|AI E2E 測試實戰]]。

### 為什麼需要 Daemon Model

每次 command 都冷啟動 Chromium 要 3-5 秒，對 agent 的迭代速度來說完全不可接受。gstack 的解法是一個長駐的 HTTP server：

![[gstack-browse-daemon.excalidraw.light.svg]]

- **首次呼叫**：CLI 啟動 server + Chromium（~3 秒），server 寫入 state file（`.gstack/browse.json`）記錄 PID、port、auth token
- **後續呼叫**：CLI 讀 state file，送 HTTP POST，拿回純文字。**~100-200ms per command**
- **閒置關閉**：30 分鐘沒有請求自動 shutdown（可透過 `BROWSE_IDLE_TIMEOUT` 調整）

HTTP protocol 極度簡單——`GET /health` 檢查存活（不需 auth），`POST /command` 執行指令（Bearer token auth）。回傳純文字，不用 WebSocket，不用 MCP（MCP 是讓 AI 操作外部工具的標準協定），用 curl 就能 debug。

### Ref System：AI 怎麼「指向」網頁元素

這是 Browse System 的核心創新。傳統做法是注入 `data-ref` 屬性到 DOM，但這會撞上 CSP、framework hydration、Shadow DOM 等問題。gstack 走了另一條路：**用 Playwright 的 accessibility tree snapshot 建立 ref mapping**。

運作方式（two-pass algorithm）：

**Pass 1**：呼叫 `page.accessibility.snapshot()` 取得 ARIA tree，計算所有 `role + name` 組合的出現次數，決定哪些需要 `nth()` 消歧義。

**Pass 2**：走訪每個節點，依序分配 `@e1, @e2, @e3...` ref，每個 ref 對應一個 Playwright Locator：

![[gstack-ref-system.excalidraw.light.svg]]

```typescript
// 內部大致邏輯
locator = page.getByRole(role, { name }).nth(index)
refMap.set('@e1', { locator, role, name })
```

AI 看到的 snapshot 長這樣：

```
@e1 [link] "Home"
@e2 [button] "Sign In"
@e3 [textbox] "Search..."
@e4 [heading] "Dashboard"
```

然後 AI 可以直接說 `click @e2` 來點擊 "Sign In" 按鈕。不需要 CSS selector，不需要 XPath，不需要知道 DOM 結構。

**`@c` namespace**：有些元素（例如用 `<div onclick>` 做的按鈕）在 ARIA tree 裡看不到。`-C` flag 會用 `page.evaluate()` 找出 `cursor: pointer`、`onclick`、`tabindex >= 0` 但沒有 ARIA role 的元素，分配 `@c1, @c2...` ref，用 `nth-child` CSS selector 定位。

**過期偵測**：頁面導航時 ref 自動清除。SPA 內部路由切換不會觸發清除，所以每次使用 ref 前會先呼叫 `locator.count()` 檢查元素是否還存在（~5ms），比起 Playwright 的 30 秒 action timeout 快得多。

### Ring Buffer Logging

Server 維護三個 50,000 entry 的環狀緩衝區——console、network、dialog。特點：

- **O(1) push**，記憶體上限固定
- **非同步每秒 flush** 到 `.gstack/browse-{console,network,dialog}.log`
- HTTP 處理永遠不會被 disk I/O 阻塞
- `console` / `network` command 從 in-memory buffer 讀取，log 檔只用於 post-mortem debug
- Flush 失敗是 non-fatal（try/catch，不 rethrow）

### Crash Recovery 策略

gstack 選擇 **crash-and-restart 而非 self-heal**：

- Chromium 掛掉 → server `process.exit(1)`
- CLI 下次呼叫偵測到 server 已死 → 自動重啟
- 避免了重新連接半死瀏覽器的複雜度

CLI 的 `ensureServer()` 有完整的 race condition 防護：用 `O_CREAT | O_EXCL` 做 filesystem lock，防止多個 CLI 同時啟動多個 server。Lock 持有者 PID 死亡時，下一個 CLI 會清除 stale lock 並重試。

連續失敗超過 3 次時，error response 會附帶提示：「Consider using 'handoff' to let the user help」——讓 AI 知道何時該放棄自動化，把控制權交還給人類。

### 安全模型

| 層級 | 機制 |
|------|------|
| 網路隔離 | 綁定 `127.0.0.1`，非 `0.0.0.0` |
| 認證 | 每個 session 隨機 UUID token，state file mode `0o600` |
| Cookie 安全 | Keychain 解密在記憶體中完成，明文永不寫入磁碟或 log |
| Shell injection 防護 | 硬編碼瀏覽器 registry，`Bun.spawn()` 用 argument array（不做字串拼接） |
| 路徑穿越 | `isPathWithin()` 檢查 screenshot/eval 輸出路徑 |

## 技術架構深入：SKILL.md 模板引擎

每個 skill 的 prompt 不是手寫的——它是從 `.tmpl` 模板 **生成** 的。

### 生成流程

![[gstack-skill-template.excalidraw.light.svg]]

`scripts/discover-skills.ts` 掃描 repo 根目錄的子資料夾，找到所有 `SKILL.md.tmpl`。每個 skill 住在自己的頂層目錄（`review/`、`qa/`、`office-hours/`）。

生成器讀取 `.tmpl`，解析 frontmatter metadata（`name`、`description`、`benefits-from`、`preamble-tier`），然後用 resolver registry 替換所有 `{{PLACEHOLDER}}`。如果有任何 placeholder 沒被解析，**直接報錯**。

關鍵 placeholder：

| Placeholder | 來源 | 用途 |
|-------------|------|------|
| `{{PREAMBLE}}` | `resolvers/preamble.ts` | 跨 skill 共用的基礎行為（見下方） |
| `{{COMMAND_REFERENCE}}` | `resolvers/browse.ts` | 從 `commands.ts` source code 自動生成指令文件 |
| `{{SNAPSHOT_FLAGS}}` | `resolvers/browse.ts` | 從 `snapshot.ts` metadata 自動生成 flag 文件 |
| `{{BASE_BRANCH_DETECT}}` | `resolvers/utility.ts` | 動態偵測 main/master branch |
| `{{ADVERSARIAL_STEP}}` | `resolvers/review.ts` | 自我對抗驗證步驟 |

**Single source of truth**：`COMMAND_REFERENCE` 和 `SNAPSHOT_FLAGS` 是從 TypeScript source code 拉出來的，不是手動維護的文件。command 新增或修改時，下次 `gen-skill-docs` 就會反映到所有 SKILL.md。

### Preamble 分層注入

Preamble 是整個系統的 cross-cutting concern 載體，透過 `preamble-tier`（1-4）控制注入深度：

| Tier | 包含 | 範例 Skills |
|------|------|-------------|
| 1 | Bash 環境偵測 + 升級檢查 + telemetry + contributor mode | browse, benchmark |
| 2 | Tier 1 + AskUserQuestion 格式 + Completeness Principle | investigate, cso, retro |
| 3 | Tier 2 + Repo Mode（solo vs collaborative）+ Search Before Building | autoplan, office-hours |
| 4 | Tier 3 + Test failure triage | ship, review, qa |

Preamble 的 bash block 在 runtime 做的事：

```bash
# 檢查 gstack 更新
# 追蹤並行 session（~/.gstack/sessions/，清除 >2hr 的 stale files）
# 讀取設定：contributor mode、proactive suggestions、telemetry
# 偵測當前 branch 和 repo mode
# 記錄 skill 使用統計到 ~/.gstack/analytics/skill-usage.jsonl
```

Tier 2+ 注入的 `AskUserQuestion` 格式特別嚴格：每個選項都要有 **Completeness score（1-10）**，工作量要同時標示 `(human: ~X / CC: ~Y)` 雙尺度。這確保 AI 永遠傾向完整的解法，而不是偷懶的捷徑。

Tier 3+ 的 **Repo Mode** 區分 solo 與 collaborative repo——solo repo 裡 agent 主動修問題，collaborative repo 裡只報告不動手。

> [!note] 這套分層注入的概念，與 Claude Code 原生的四層載入機制有對應關係——見 [[Claude Code 系統提示詞架構優化：從 Always-Load 到按需載入|系統提示詞按需載入]]。

### Trigger Guard：防止 Skill 被誤觸發

生成器會在每個 SKILL.md 的 `description` 欄位注入 `MANUAL TRIGGER ONLY: invoke only when user types /{name}`。這是因為 Claude Code 會根據語義相似度自動觸發 skill——沒有這個 guard，使用者隨口說「review this」就可能觸發 `/review` 的完整流程。

### CI Freshness Check

```bash
# CI 流程
bun run gen:skill-docs              # 重新生成所有 Claude host 的 SKILL.md
git diff --exit-code                 # 如果生成結果和 committed 版本不同 → CI 失敗

bun run gen:skill-docs --host codex  # 重新生成 Codex host 版本
git diff --exit-code -- .agents/     # 同上
```

任何人改了 `.tmpl` 但忘了跑 `gen-skill-docs`，CI 會擋住。本地可以用 `bun run skill:check`（`--dry-run` 模式）快速驗證。

生成時還會印出每個 skill 的 **token budget 估算**（~4 chars/token），監控 prompt 膨脹——因為 SKILL.md 會被注入 agent 的 system prompt，太大會影響效能和成本。

### 多 Agent 支援

同一套 `.tmpl` 生成兩組輸出：

| Host | 輸出路徑 | 差異 |
|------|----------|------|
| Claude Code | `{skill}/SKILL.md` | 完整 frontmatter（`allowed-tools`、`hooks`、`version`） |
| Codex | `.agents/skills/gstack-{skill}/SKILL.md` | 精簡 frontmatter + OpenAI YAML + 路徑從硬編碼改為 `$GSTACK_ROOT` |

Codex 版本有 1024 字元的 description 硬限制，hook 行為因為 Codex 不支援 `hooks:` frontmatter 而被轉成 prose 形式的 "Safety Advisory" blockquote。`/codex` skill 在生成 Codex 版本時會被跳過（避免循環引用）。

## 安裝與上手

```bash
# 30 秒安裝（需要 Bun v1.0+）
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack \
  && ./setup
```

`setup` 做的事：安裝 dependencies、編譯 Bun binary、安裝 Playwright Chromium、symlink skill 目錄。也支援 `--host codex`（OpenAI Codex CLI）和 `--host kiro`（Kiro CLI）。

然後在專案的 `CLAUDE.md` 加入 gstack section，列出可用 skills。

建議的上手順序：

1. `/office-hours` — 描述你正在做的東西，讓 agent 挑戰你的需求
2. `/plan-ceo-review` — 讓 agent 重新審視 scope
3. `/review` — 對任何有 changes 的 branch 跑一次
4. `/qa https://your-staging-url.com` — 對 staging URL 跑真實瀏覽器 QA
5. 到這裡就能判斷這套工具適不適合你

## 誰適合用

- **Technical founders** — 仍然想自己 ship code 的技術型創辦人
- **Claude Code 重度使用者** — 已經有 AI coding 習慣，想要更結構化的流程
- **Tech leads / Staff engineers** — 需要 review、QA、release automation 加在每個 PR 上

## Trade-offs

直接說缺點：

- **600K lines 的宣稱需要打折看**：AI 生成的 code 行數和人工寫的行數不能直接比較，生成速度快但不代表品質等同
- **重度依賴 Claude Code**：雖然透過模板引擎支援 Codex 和 Gemini CLI，但核心體驗和測試覆蓋是為 Claude Code 設計的
- **Skill 串接是約定而非強制**：sprint pipeline 的完整性取決於使用者是否按順序執行，沒有技術層面的 enforcement
- **Prompt 膨脹風險**：每個 SKILL.md 都會注入 system prompt，preamble + command reference 加起來 token 數不小，直接影響 API 成本
- **學習成本**：28 個 skills 需要時間熟悉，初期建議只用 `/review` + `/qa` + `/ship` 這個最小可用組合

## 為什麼這件事重要

gstack 代表的趨勢是：**AI-assisted development 正在從「自動補全」進化到「流程自動化」**。

過去的 AI coding 工具解決的是「這行程式怎麼寫」。gstack 試圖解決的是「這個功能從構想到上線的整個流程怎麼跑」。它不只是 copilot，而是試圖成為一整個虛擬團隊。

從架構角度看，有幾個設計決策值得帶走：

1. **Prompt as specialist**：用結構化的 Markdown 定義 AI 的角色和行為邊界，比在對話中臨時下指令有效得多
2. **Single source of truth**：command metadata 從 TypeScript source 拉到 SKILL.md，而不是手動同步兩份文件
3. **Daemon over cold-start**：persistent server + accessibility tree ref system 讓 AI-browser 互動的延遲從秒級降到毫秒級
4. **Self-regulation mechanisms**：WTF-likelihood、3-strike rule、consecutive failure hints——AI agent 需要知道什麼時候該停下來

不論你是否採用 gstack，理解它背後的設計思維是有價值的。

## 延伸閱讀

- [gstack GitHub Repository](https://github.com/garrytan/gstack) — 原始碼與完整文件
- [ARCHITECTURE.md](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md) — Browse System 內部設計決策
- [ETHOS.md](https://github.com/garrytan/gstack/blob/main/ETHOS.md) — Boil the Lake、Search Before Building 等設計原則
- [Skill Deep Dives](https://github.com/garrytan/gstack/blob/main/docs/skills.md) — 每個 skill 的詳細哲學與範例
- [[AI 寫作工作流實戰：從主題發想到自動部署|AI 寫作工作流]] — 本文是用 AI 寫作產線產出的案例之一
