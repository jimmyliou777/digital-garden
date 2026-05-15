---
title: gstack — 把 Claude Code 變成虛擬工程團隊的開源框架
shortTitle: gstack 虛擬工程團隊框架
description: Y Combinator CEO Garry Tan 開源的 Claude Code skill 集合，23+8 個工具配 ETHOS 三支柱哲學，比起寫了什麼，更重要的是怎麼跑 Sprint、跟 Superpowers / GSD 怎麼選
tags: [AI, Claude Code, Developer Tools, Open Source, Workflow]
published: 2026-03-24
draft: false
status: published
---

**TL;DR：** gstack 是 Garry Tan 開源的 Claude Code skill 集合（**23 個主 skill + 8 個 power tools**），把單一 AI agent 拆成 CEO、工程主管、QA、SRE 等角色。但 skill 數量不是重點，骨幹是 **ETHOS 三支柱**：Boil the Lake（完整的邊際成本→0）、Search Before Building（先查再做）、User Sovereignty（AI 推薦、人類決定）。Team mode 還能把它寫進 repo 變成團隊強制依賴。MIT 授權，30 秒安裝。

![[gstack-hero.png]]

## 1. gstack 是什麼

Garry Tan（Y Combinator CEO）在 60 天裡寫了 60 萬行 code，背後就是這套工具鏈。但別把它當「prompt 集」看——批評者直白地說它是「a bunch of markdown files telling Claude to pretend to be different people」，這個 framing 是公平的。**它的價值在哲學層與 Browse System 工程深度，而不是 markdown 本身。**

跟其他 Claude Code 框架的根本差異在於：gstack 約束的是「**決策視角**」（你現在是 CEO 還是 QA？），Superpowers 約束「開發流程」（強制 TDD 7 階段），GSD 約束「執行環境」。三者哲學正交，可以合用。

## 2. ETHOS 三支柱——比 skill 清單更重要

![[gstack-ethos.png]]

三條哲學寫在 `ETHOS.md`，是整個系統的根。最該記住的一句：

> **Boil the Lake**：AI 讓「做完整」的邊際成本趨近於零。當完整版只比捷徑多花幾分鐘時，永遠選完整的——但要區分能煮乾的「湖」（測試、edge case）與煮不乾的「海」（重寫 platform）。

這也是 gstack 的測試碼比例高達 35% 的原因。**Search Before Building** 體現在 `/office-hours` 的 forcing questions——不熟的 pattern 先查既有解。**User Sovereignty** 則是 opt-in at every step，這條跟 Superpowers 的強制流程形成鮮明對比。

## 3. 23 + 8 Skills 快覽

![[gstack-skills-overview.png]]

官方八大分類：Planning & Design、Code Review & Quality、Design & Frontend、Release & Deployment、Data & Automation、Documentation、Observability & Learning、Multi-AI、Safety & Utility。

不必逐個學。**最小可用組合只要四個**：

- `/office-hours` — YC 式六大 forcing questions，重新框架需求
- `/review` — Two-pass checklist + Fix-First workflow，找通過 CI 但會炸的 bug
- `/qa` — 開真實 Chromium 跑 QA，找到 bug 自動補 regression test
- `/ship` — Sync、跑測試、push、開 PR 一條龍

熟了以後再補 `/plan-eng-review`、`/investigate`、`/canary` 等。

## 4. 實戰場景一：Sprint Pipeline 怎麼跑

![[gstack-sprint-pipeline.png]]

一個真實 sprint 的跑法是這樣（每步驟的輸出會被下游讀取）：

```
你 → /office-hours <模糊需求>
gstack → 六個 forcing questions，逼你把「daily briefing app」重新框架成「personal chief of staff」
產出 → design doc

你 → /plan-ceo-review
gstack → 四種模式（Expansion / Selective / Hold / Reduction）重審 scope
產出 → 修正後的 scope

你 → /plan-eng-review
gstack → 鎖定架構、data flow、edge cases、test matrix
產出 → 架構圖 + test plan

你 → 寫 code（或讓 Claude 寫）

你 → /review
gstack → CRITICAL 先 INFORMATIONAL 後，scope drift detection，明顯問題自動修
產出 → review report + fix commits

你 → /qa https://staging.example.com
gstack → 開 Chromium 跑 QA。WTF-likelihood 超過 20% 強制問你，hard cap 50 fixes
產出 → bug 修復 + regression test

你 → /ship
gstack → main sync、testing、coverage audit、push、PR
產出 → PR URL
```

兩個值得記住的自律機制：

- **`/investigate` Iron Law**：「No fixes without investigation first」，且**三次 hypothesis 都失敗就強制停**，列出嘗試過的方法和失敗原因，把控制權交還給人。
- **`/qa` WTF-likelihood**：revert +15%、改超過 3 個檔案 +5%，累積分數超過 20% 暫停問人，超過 50 fixes 硬停。

> [!note] 三次失敗強制停下的設計，跟 [[AI 代理工作流實戰：從模糊需求到 Develop Done 的完整閉環|AI 代理工作流實戰]] 提到的 Stuck Protocol 是同一條哲學——AI agent 需要知道什麼時候該放棄自動化。

## 5. 實戰場景二：跟 Superpowers / GSD 怎麼選

![[gstack-framework-axes.png]]

| 框架            | 約束的維度 | 哲學風格              | 適合                                                |
| --------------- | ---------- | --------------------- | --------------------------------------------------- |
| **gstack**      | 決策視角   | Opt-in，角色化 prompt | 想保留控制權的 senior、需要結構化但不要被綁死的場景 |
| **Superpowers** | 開發流程   | 強制 TDD 7 階段       | 願意接受流程紀律換取一致性的 team                   |
| **GSD**         | 執行環境   | 穩定 runtime          | 注重 reproducibility 的 ops 場景                    |

三者可以合用。社群驗證的組合是：**Superpowers 負責 implementation loop（brainstorm → plan → TDD → review），gstack 負責 implementation 前後（CEO scope review、QA、ship、retro）**，GSD 在底層保證環境一致。

> [!tip] 另一個抽象層的比較，見 [[Superpowers-OpenSpec-OAuth2-8階段實戰|Superpowers + OpenSpec 8 階段實戰]]。

## 6. 落地實務

```bash
# 30 秒安裝（需要 Bun v1.0+）
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack \
  && ./setup
```

**Team mode** 是 gstack 最被低估的功能：

```bash
./setup --team        # 安裝 team-mode skill
gstack-team-init required   # 把 gstack 寫成 repo contract
```

執行後 gstack 會被加進 `.claude/settings.json`，commit hook 會擋住沒按 ETHOS 跑的 PR。**這是把個人工具升級成團隊紀律的具體 pattern**——比口頭 onboarding 有效得多。

**兩個落地警示**：

- **Skill prompt 內嵌廣告**：每個 SKILL.md 都注入 Garry 的自家廣告，會浪費 context window。重度使用者可能要 fork 移除。
- **LOC 數字打折看**：600K 包含 35% 測試碼、用 logical line 算法、跨 40+ repos，當行銷錨點看就好。完整討論見 [`docs/ON_THE_LOC_CONTROVERSY.md`](https://github.com/garrytan/gstack/blob/main/docs/ON_THE_LOC_CONTROVERSY.md)。

## 帶得走的設計觀念

不論你用不用 gstack，這四個觀念值得帶走：

1. **角色化 prompt 在 SDLC 階段切換中有效**——CEO 視角審 scope 跟 staff engineer 視角審 code 用的是不同 prompt，比通用 prompt 強。
2. **Self-regulation 機制是必要的**——WTF-likelihood、3-strike、Iron Law。AI agent 不能無限重試。
3. **ETHOS 比 skill 數量重要**——Boil the Lake / Search Before Building / User Sovereignty 三條原則，比 23 個 skill 更值得內化。
4. **Team mode = repo contract**——把 AI 工作流升級為團隊強制依賴，是讓「AI 紀律」真正落地的工程手段。

## 延伸閱讀

- [garrytan/gstack](https://github.com/garrytan/gstack) — 官方 repo，skill 清單與最新 release
- [ETHOS.md](https://github.com/garrytan/gstack/blob/main/ETHOS.md) — Boil the Lake 等三支柱原文
- [ARCHITECTURE.md](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md) — Browse System daemon 工程細節
- [Superpowers, GSD, and gstack: What Each Framework Constrains](https://medium.com/@tentenco/superpowers-gsd-and-gstack-what-each-claude-code-framework-actually-constrains-12a1560960ad) — 三軸定位源頭
- [HN #47418576](https://news.ycombinator.com/item?id=47418576) — 最有營養的批評視角
- [[AI 代理工作流實戰：從模糊需求到 Develop Done 的完整閉環|AI 代理工作流實戰]] — Stuck Protocol 與 Iron Law 的對照
- [[AI E2E 測試實戰：用 Claude Code 平行代理同時操控三個瀏覽器驗證你的網站|AI E2E 測試實戰]] — Browse System 對比其他瀏覽器自動化方案
