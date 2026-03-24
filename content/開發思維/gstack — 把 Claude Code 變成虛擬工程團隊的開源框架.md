---
title: gstack — 把 Claude Code 變成虛擬工程團隊的開源框架
description: 深入分析 Y Combinator CEO Garry Tan 開源的 gstack 框架，如何透過 28 個 slash command 將 Claude Code 打造成結構化的虛擬工程團隊
tags: [AI, Claude Code, Developer Tools, Open Source]
published: 2026-03-24
draft: false
---

# gstack — 把 Claude Code 變成虛擬工程團隊的開源框架

**TL;DR：** gstack 是 Y Combinator CEO Garry Tan 開源的 Claude Code skill 集合，透過 28 個 slash command 將單一 AI agent 拆分成 CEO、工程主管、設計師、QA、SRE 等角色，實現結構化的 sprint 流程。MIT 授權，30 秒安裝，支援 Claude Code、Codex、Gemini CLI、Cursor。

> 本文預設讀者熟悉 Claude Code 基本操作，對 AI-assisted development 有興趣。

## 為什麼這件事值得關注

Garry Tan 不是純粹的 AI 工具開發者——他是 Y Combinator 的現任 President & CEO，曾是 Palantir 的早期工程師，也是 Posterous（後被 Twitter 收購）的共同創辦人。他的背景同時橫跨技術與產品。

根據他的說法，他在 60 天內產出了 **600,000+ 行 production code**（35% 是測試），每天 10,000-20,000 行，而且這些是在全職經營 YC 的同時完成的。數字可以討論，但核心觀點清楚：**一個人加上對的工具鏈，可以達到傳統小型團隊的產出量**。

這與 Andrej Karpathy 在 2026 年初說的方向一致：「我大概從十二月開始就沒有真正打過一行程式碼了。」工具層的成熟正在重新定義「一個人能做多少事」。

## 核心理念：結構化的 Sprint 流程

gstack 不只是一堆零散的工具。它的核心設計是一條完整的 sprint pipeline：

```
Think → Plan → Build → Review → Test → Ship → Reflect
```

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

## 28 個 Skills 全覽

### Planning & Architecture — 動手之前先想清楚

| Skill | 角色 | 做什麼 |
|-------|------|--------|
| `/office-hours` | YC Office Hours | 六個 forcing questions 重新定義你的產品方向，挑戰你的前提假設 |
| `/plan-ceo-review` | CEO | 四種模式（Expansion / Selective Expansion / Hold Scope / Reduction）重新審視 scope |
| `/plan-eng-review` | Engineering Manager | 鎖定架構、data flow diagram、edge cases、test matrix |
| `/plan-design-review` | Senior Designer | 每個設計維度 0-10 評分，說明 10 分長什麼樣，偵測 AI slop |
| `/design-consultation` | Design Partner | 從 landscape research 開始，建立完整的 design system |

`/office-hours` 的設計很有意思——它不是直接幫你寫 code，而是先挑戰你的需求定義。在 README 的範例中，使用者說「我想做一個 daily briefing app」，agent 回應：「你描述的其實不是 briefing app，是 personal chief of staff AI。」這種重新框架的能力，比直接生成 code 更有價值。

### Development & Review — 品質把關

| Skill | 角色 | 做什麼 |
|-------|------|--------|
| `/review` | Staff Engineer | 找出通過 CI 但會在 production 爆炸的 bug，自動修明顯問題 |
| `/investigate` | Debugger | 系統性 root cause 分析，Iron Law：沒有調查就不修 |
| `/qa` | QA Lead | 開真實 Chromium 瀏覽器測試，找到 bug 後做 atomic commit + regression test |
| `/qa-only` | QA Reporter | 純報告，不動 code |
| `/cso` | Chief Security Officer | OWASP Top 10 + STRIDE threat model，8/10+ confidence gate |

`/qa` 特別值得注意——它不是模擬或 mock，而是透過 Playwright 開啟**真實的 Chromium 瀏覽器**，實際點擊、截圖、驗證。找到 bug 後自動產生 atomic commit 和 regression test。

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

## 技術架構

### SKILL.md Standard

gstack 的每個 skill 都是一個 Markdown 檔案，遵循 SKILL.md 標準。這個設計有幾個好處：

- **跨 agent 相容**：不只 Claude Code，Codex、Gemini CLI、Cursor 都能讀取
- **人類可讀**：打開就是 Markdown，不需要特殊工具
- **版本控制友善**：純文字檔，git diff 清楚

### 安裝架構

```
# Global install（個人使用）
~/.claude/skills/gstack/

# Repo-local install（團隊共用）
.claude/skills/gstack/     # Claude Code
.agents/skills/gstack/     # Codex / Gemini CLI
```

Repo-local 安裝會直接 commit 進 repo（不是 submodule），所以 `git clone` 就能用。不動 PATH，沒有 background process。

### Browser Automation

`/browse` 和 `/qa` 底層用 Playwright 驅動 Chromium。Runtime 優先用 Bun（效能更好），Windows 上自動 fallback 到 Node.js（因為 Bun 在 Windows 的 Playwright pipe transport 有已知 bug）。

### Privacy Model

Telemetry 預設**關閉**，opt-in 才啟用。啟用後只送：skill name、duration、success/fail、gstack version、OS。**永遠不送**：code、file paths、repo names、branch names、prompts。

資料存在 Supabase，schema 公開在 repo 裡可以自行驗證。API key 是 public key，row-level security 限制為 insert-only。

## 安裝與上手

```bash
# 30 秒安裝
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack \
  && ./setup
```

然後在專案的 `CLAUDE.md` 加入 gstack section，列出可用 skills。

建議的上手順序：

1. `/office-hours` — 描述你正在做的東西
2. `/plan-ceo-review` — 讓 agent 挑戰你的 scope
3. `/review` — 對任何有 changes 的 branch 跑一次
4. `/qa` — 對 staging URL 跑 QA
5. 到這裡就能判斷這套工具適不適合你

## 誰適合用

- **Technical founders** — 仍然想自己 ship code 的技術型創辦人
- **Claude Code 新手** — 不知道怎麼下 prompt 時，結構化的角色比空白 prompt 有效得多
- **Tech leads / Staff engineers** — 需要 review、QA、release automation 加在每個 PR 上

## Trade-offs

直接說缺點：

- **600K lines 的宣稱需要打折看**：AI 生成的 code 行數和人工寫的行數不能直接比較，生成速度快但不代表品質等同
- **重度依賴 Claude Code**：雖然支援多個 agent，但核心體驗是為 Claude Code 設計的
- **Skill 串接是約定而非強制**：流程的完整性取決於使用者是否按順序執行
- **學習成本**：28 個 skills 需要時間熟悉，初期可能只用到其中幾個

## 為什麼這件事重要

gstack 代表的趨勢是：**AI-assisted development 正在從「自動補全」進化到「流程自動化」**。

過去的 AI coding 工具解決的是「這行程式怎麼寫」。gstack 試圖解決的是「這個功能從構想到上線的整個流程怎麼跑」。它不只是 copilot，而是試圖成為一整個虛擬團隊。

這對個人開發者和小型團隊的影響最大。如果一個人能跑完過去需要 PM + Designer + Engineer + QA + SRE 才能跑的流程，那團隊組建的邏輯就會改變。

不論你是否採用 gstack，理解它背後「用 sprint 流程約束 AI agent」的設計思維是有價值的。

## 延伸閱讀

- [gstack GitHub Repository](https://github.com/garrytan/gstack) — 原始碼與完整文件
- [Skill Deep Dives](https://github.com/garrytan/gstack/blob/main/docs/skills.md) — 每個 skill 的詳細哲學與範例
- [Builder Ethos](https://github.com/garrytan/gstack/blob/main/ETHOS.md) — Boil the Lake、Search Before Building 等設計原則
- [Architecture](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md) — 系統內部設計決策
