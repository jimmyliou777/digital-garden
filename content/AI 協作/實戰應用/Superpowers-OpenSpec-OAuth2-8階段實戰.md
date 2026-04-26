---
title: "從零到 ship：用 Superpowers + OpenSpec 走完一個 OAuth2 feature"
shortTitle: "OAuth2 8 階段實戰"
description: "Google OAuth2 從零到 ship 的 8 階段完整流程，含 6 個常見陷阱。Phase 5 規格回填是多數人會跳過、卻決定 Phase 8 archive 能否兌現價值的瓶頸"
tags:
  - AI協作
  - 工作流實戰
  - Superpowers
  - OpenSpec
  - OAuth2
published: 2026-04-25
status: fleeting
---

**TL;DR：** 一個 Google OAuth2 feature 從零到 ship，8 階段對應到 OpenSpec 的「契約軸」與 Superpowers 的「執行軸」。Phase 5（規格回填）是多數人會跳過、卻決定 Phase 8 archive 能否兌現價值的瓶頸 —— Phase 8 才是 OpenSpec 真正的回本機制，但少了 Phase 5 的回填，archive 就是失真的歷史。

## 引言

[[Superpowers-OpenSpec-兩個抽象層|前一篇方法論]] 說明了為什麼要把 [Superpowers](https://github.com/obra/superpowers) 與 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 組合用，這篇用一個具體 feature 走完整流程：在既有 Next.js 專案加入 **Google OAuth2 登入**。

8 階段切分跨越兩個工具：OpenSpec 在第 1、5、7、8 階段現身（負責「契約」），Superpowers 在第 1-4、6、7 階段提供「執行紀律」。Phase 5「規格回填」是最容易被跳過的環節 —— 它本身不直接產生長期價值，卻是 Phase 8 archive 兌現價值的必要前置條件。

## 8 階段全景

![[superpowers-openspec-8phases.excalidraw.dark.svg]]

| 階段 | 名稱         | 主要工具               | 產出                              |
| ---- | ------------ | ---------------------- | --------------------------------- |
| 1    | 需求對齊     | OpenSpec + Superpowers | proposal / specs / design / tasks |
| 2    | 計劃轉譯     | Superpowers            | 含檔案路徑的執行 plan             |
| 3    | 隔離環境     | Superpowers            | git worktree + 基線測試           |
| 4    | 紀律化實作   | Superpowers            | TDD 完成的程式碼                  |
| 5    | **規格回填** | OpenSpec               | 更新後的 delta specs              |
| 6    | Code Review  | Superpowers            | merged PR                         |
| 7    | 收尾         | OpenSpec + Superpowers | archive + 清乾淨的 worktree       |
| 8    | 未來維護     | OpenSpec               | 半年後的設計脈絡來源              |

每個階段解一個具體的失敗模式，順序不能任意調換。

## 階段 1：需求對齊

**發生什麼**：把「我要加 Google OAuth2 登入」從一句 chat 訊息，變成 4 份持久的文件。

**觸發**：`brainstorming` skill（Superpowers 內建技能，啟動對話釐清需求）→ `/opsx:propose`（OpenSpec CLI 安裝後可用，產出 4 份 change 工件）

**指令**：

```
我要加 Google OAuth2 登入。先用 brainstorming 釐清需求。
```

Brainstorming 會問：為什麼是 Google 而非通用 OAuth2？第一次登入要不要自動建 user？token 存哪？既有 session 機制要保留嗎？對話收斂後：

```bash
/opsx:propose google-oauth2-login
```

OpenSpec 產出 `openspec/changes/google-oauth2-login/{proposal,specs,design,tasks}.md`。

**為什麼這樣排序**：**需求未收斂時**不能反過來。`/opsx:propose` 沒有對話能力，需求模糊時它只會生出含糊的 proposal，後續 4 個工件都會跟著模糊。Brainstorm 的對話成本（多 15 分鐘）能省下後面 2 小時的偏航。需求成熟（例如 OAuth2 已有業界標準流程、技術選型心裡有定見）時可直接 propose，但實務上「自以為清楚」與「真的清楚」中間還有一條 brainstorm 才能逼出的隱性假設。

## 階段 2：計劃轉譯

**發生什麼**：把粗粒度的 `tasks.md` 細化成可執行的 plan 檔。

**觸發**：`writing-plans` skill

**指令**：

```
基於 openspec/changes/google-oauth2-login/tasks.md 寫執行計劃，
每個 task 2-5 分鐘可完成，含確切檔案路徑與 TDD 順序。
```

`tasks.md` 的「實作 OAuth callback handler」會被拆成 4 個 micro-task：寫 `oauth-callback.test.ts`（紅燈）→ 實作 `src/server/auth/oauth-callback.ts`（綠燈）→ 整合 `cookieHandler.ts`（refactor）→ 跑 `pnpm test src/server/auth`（驗證）。

**為什麼這樣排序**：跳過這步直接 `/opsx:apply` 看似快，但 `tasks.md` 缺了檔案路徑與 TDD 切分，AI 會自己猜，常猜錯。Plan 檔多花 5 分鐘，省下後面 30 分鐘的方向修正。

## 階段 3：隔離環境

**發生什麼**：在獨立 git worktree 中工作，避免汙染主分支。

**觸發**：`using-git-worktrees` skill

**指令**：

```bash
git worktree add ../my-app-google-oauth2 -b feat/google-oauth2
cd ../my-app-google-oauth2
pnpm test  # 確認基線 green
```

**為什麼這樣排序**：在改動前確認基線測試 green 是黃金法則 —— 後面任何測試紅燈都能歸因到「我的改動」而非「環境本就壞」。

## 階段 4：紀律化實作

**發生什麼**：對 plan 中每個 task 走 TDD 循環，獨立 task 派 subagent 平行。

**觸發**：`test-driven-development` + `subagent-driven-development` + `verification-before-completion`

**指令**：

```
依 plan 的順序執行。每個 task 走 RED → GREEN → REFACTOR → VERIFY。
獨立 task「如 frontend button 與 backend callback」派 subagent 平行處理。
```

每個 task 結束前 `verification-before-completion` 強制驗證：

```bash
pnpm test && pnpm lint && pnpm typecheck
```

驗證 output 必須親眼看到 green，不能只信 AI 的「我跑過了」。

**為什麼這樣排序**：TDD 的順序不可逆。先寫實作後補測試會讓測試寫成「描述現有實作」而非「描述應有行為」—— 表面有測試覆蓋率但抓不到 regression。在這套組合裡 TDD 又特別重要：subagent 平行實作時若缺強驗證點，OAuth callback、cookie session、token refresh 之間的 race-condition bug 會被埋更深，因為三個 agent 各自綠燈但組合起來仍有時序漏洞。

## 階段 5：規格回填（最容易跳過）

> [!warning] 多數人會跳過這一階段
> 實作完成後直接 PR、直接 merge —— `changes/<name>/specs/` 沒回頭更新，merge 後 spec 與實作脫節，archive 變成失真的歷史。

**發生什麼**：實作過程必然發現原 spec 缺漏（例如 OAuth 沒考慮 token refresh 的 race condition），回頭把學到的修正寫進 delta specs（標 `ADDED` / `MODIFIED` / `REMOVED` 的局部規格更新檔，由 `/opsx:archive` 合入主 spec）。

**觸發**：手動編輯 + `openspec validate`

**指令**：

```bash
# 編輯 openspec/changes/google-oauth2-login/specs/auth.md
# 加入新發現的 requirement，例如：
#
# ## ADDED Requirements
# ### Token refresh race condition
# WHEN multiple tabs simultaneously expire the access token
# THEN the system MUST queue refresh requests and call
# the refresh endpoint exactly once
# (主流實作：Web Locks API 取得單一 leader tab，
#  其餘 tab 透過 BroadcastChannel 等待結果)

openspec validate google-oauth2-login
```

`Web Locks API` + `BroadcastChannel` 是現代瀏覽器的 leader election 模式；舊瀏覽器 fallback 可走 `localStorage` event + 時間戳鎖，但已不建議當主案。spec 寫「結果」而非「機制」，是為了讓未來實作換實作模式時 spec 不需重寫。

**怎麼判斷「需要回填」**：實作中只要出現以下三種徵兆之一，就代表原 spec 漏了：

1. **寫到一半多開了一個檔案 / 邊界**：spec 沒提到的 module 浮現（例如「我以為 OAuth callback 一個檔搞定，結果還要拆 `oauth-state-store.ts` 防 CSRF」）。
2. **測試命名出現「edge case」或「race」字樣**：spec 通常只描述快樂路徑，這類字樣是實作中發現的隱性需求。
3. **跟 reviewer / 同事解釋設計時用了 spec 沒寫的詞**：「我們這邊是用 leader election 處理 multi-tab refresh」如果 spec 找不到 leader election，這就是漏網的 requirement。

**沒做 Phase 5 的真實損失（before/after）**：

> ❌ **沒回填**：半年後新人實作 logout，看 `archive/.../design.md` 寫「token 存 localStorage」（過時的 proposal 內容沒被 delta 修正），照寫一通，上線當週爆 XSS 事故。
>
> ✅ **有回填**：archive 的 delta 包含「Token storage」的 `MODIFIED` 章節，明確記錄「proposal 原寫 localStorage，實作改為 httpOnly cookie + SameSite，理由：XSS」。新人 5 分鐘看懂、不會走回頭路。

**把回填寫進 plan 的 task 範本**：

```markdown
- [ ] task N-1: openspec/changes/<name>/specs/ 回填 delta
  - 對照本次 PR diff，找出實作中新增 / 修正 / 刪除的 requirement
  - 在 specs/<capability>.md 加 `## ADDED` / `## MODIFIED` / `## REMOVED` 章節
  - 跑 `openspec validate <name>` 確認結構通過
  - 提交 commit「spec: backfill <name> delta」
```

這個 task 必須是 plan 的**倒數第二個**（最後一個是 PR / merge），不能跟實作 task 並列：規格回填依賴實作的最終樣貌，太早做會回填到一個會被改掉的版本。

**為什麼這樣排序**：必須在 PR review 之前完成。reviewer 看到 `proposal.md` 與實際程式碼不符會質疑「這真的是同一份提案嗎？」白白浪費他們的時間。更深一層：Phase 8（archive 復用）的所有價值都建立在 archive 內容可信的前提上，Phase 5 是這份「可信」的唯一來源。

## 階段 6：Code Review

**發生什麼**：開 PR、讓 reviewer 對照 spec 看程式碼。

**觸發**：`requesting-code-review` + `receiving-code-review`

**指令**：

```bash
git push -u origin feat/google-oauth2
gh pr create --title "feat: Google OAuth2 login" --body "$(cat <<'EOF'
Spec: openspec/changes/google-oauth2-login/proposal.md
Design: openspec/changes/google-oauth2-login/design.md
EOF
)"
```

注意：`gh pr create --body` 直接寫多行字串會被 shell 折成單行，PR description 顯示成一整段無換行。用 HEREDOC 才能保留換行排版。

PR description **直接引用** `proposal.md` 與 `design.md` —— reviewer 不需翻 chat history 就能知道商業脈絡。

收到 review 意見時不演技性同意。意見技術上有疑問就回去 codebase 驗證；真的不確定就直說「不確定，能再說明嗎？」—— 這也是 `receiving-code-review` skill 強調的紀律。

**為什麼這樣排序**：Phase 6 的核心紀律是「回應信號 ≠ 接受信號」。reviewer 提的每條意見都是 codebase 的待驗事實，不是社交場景的禮貌互動 —— 演技性同意（「好的我改」沒實際驗證）會把 review 退化為簽核流程，喪失 catch bug 的功能。`receiving-code-review` skill 強調的就是：技術質疑用 codebase 回，不確定就誠實說不確定，這比快速同意更值得 reviewer 信任。

## 階段 7：收尾

**發生什麼**：merge 後把 delta specs 合進主 spec、清掉 worktree。

**觸發**：`/opsx:archive` + `finishing-a-development-branch`

**指令**：

```bash
# Merge PR 之後
/opsx:archive google-oauth2-login
# → delta specs 合入 openspec/specs/auth.md
# → openspec/changes/google-oauth2-login/ 移到 openspec/changes/archive/2026-04-25-google-oauth2-login/

git worktree remove ../my-app-google-oauth2
git branch -d feat/google-oauth2
```

**為什麼這樣排序**：archive 必須在 PR merge 之後才執行。merge 前 archive 等於把未驗證的 delta 推進主 spec，後續若 PR 還有 review 改動會造成主 spec 失真。

## 階段 8：未來維護（OpenSpec 真正回本的地方）

**發生什麼**：半年後新人問「為什麼 token 不放 localStorage？」

**沒有 OpenSpec 的版本**：翻 git log → 找到 PR → PR description 不夠詳細 → 回去找當時的 chat history → 多半找不到。

**有 OpenSpec 的版本**：

```bash
cat openspec/changes/archive/2026-04-25-google-oauth2-login/design.md
# 看到當時的 tradeoff：
# - localStorage：JS 可讀，XSS 攻擊面大
# - httpOnly cookie：JS 讀不到，能擋 XSS 但要處理 CSRF
# - 結論：httpOnly + Secure + SameSite=Lax + CSRF token
#   （SameSite=Lax 是 2020+ 瀏覽器預設，擋掉大多數 cross-origin
#    自動送出；CSRF token 是同源表單情境的補強而非主防）
```

新功能要動既有 spec 時：

```bash
openspec list                    # 看歷史 changes
openspec show specs/auth.md      # 看現況 spec
/opsx:propose <new-change>       # 開新 change folder
```

**為什麼這個階段存在**：OpenSpec 的 `archive/` 不是裝飾，是它跟 Superpowers 最大的差別。Superpowers 的 plan file 在 merge 後就失去意義，archive 卻是這套系統最值錢的長期資產。

**有人會問：那不是 ADR 也能做到嗎？** 表面上 ADR 也是 markdown、進 git、可以被翻閱，但有兩個結構性差異：

- **與當下 spec 雙向綁定**：archive 的 delta（`ADDED` / `MODIFIED` / `REMOVED`）與 `openspec/specs/` 的主 spec 是同一套語法，可追溯「現況某條 requirement 是哪個 change 加進來的」。ADR 是獨立文件，與 spec 沒有結構連結，要靠人工 grep 拼湊脈絡。
- **可程式化查詢**：`openspec list` 列歷次 change、`openspec show specs/auth.md` 看當前 spec 加上每條 requirement 的來源 change。AI agent 半年後可以直接 `openspec` 讀出設計脈絡，不需翻散落的 markdown。

換句話說，ADR 是「把決策寫下來」，archive 是「把決策變成可查詢的圖譜」。前者倚賴人記得去看，後者讓工具自動串起來。

## 6 個常見陷阱

![[superpowers-openspec-traps.excalidraw.light.svg]]

| 陷阱                       | 症狀                              | 解法                                                                          |
| -------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| 跳過 Phase 5 規格回填      | spec 與實作脫節，archive 失去價值 | 把「更新 delta specs」寫進 plan 的最後一個 task                               |
| 用 OpenSpec 處理 typo      | change folder 噪音爆炸            | 30 分鐘工作量門檻；小改動走純 git commit                                      |
| Brainstorm 結果只活在 chat | 換 session 後脈絡消失             | 對話收斂後立刻 `/opsx:propose` 落檔                                           |
| Plan task 寫太粗           | subagent 無法平行、TDD 失焦       | 強制 2-5 分鐘任務粒度 + 確切檔案路徑                                          |
| `/opsx:apply` 跳過測試     | 進度快但品質崩                    | 用 Superpowers `executing-plans` 取代，保留 TDD 強制度                        |
| 多人協作時 spec 衝突       | 兩個 PR 改同一 spec 章節          | 用 delta spec 的 `ADDED` / `MODIFIED` / `REMOVED` 標記隔離；review 時人類仲裁 |

第 1 條（規格回填）是上述六條中**最容易破口的瓶頸** —— Phase 8 archive 復用才是 OpenSpec 真正的回本機制，但這個價值的閘門被 Phase 5 卡著。沒做這步，後面五個陷阱避開了也只是維持「不出錯」，archive 仍是失真的歷史，半年後查不到當時 tradeoff 的可信脈絡。

## CLAUDE.md Routing 範本

把以下規則寫進專案 `CLAUDE.md`，讓 AI 自動選對流程：

```markdown
## Workflow Routing

新 feature「≥30min 工作量」：

1. /opsx:propose <name> 先生規格骨架
2. brainstorming 補對話對齊
3. writing-plans 把 tasks.md 細化
4. TDD 實作 → verification → review
5. 規格回填「更新 delta specs」— 容易跳過，必做
6. /opsx:archive 收尾

Bug fix / 小改動「<30min」：
systematic-debugging + TDD
跳過 OpenSpec —— change folder overhead 不值得

Refactor：
blast radius < 1 個 module → Superpowers only
blast radius ≥ 1 個 module → OpenSpec change folder
```

關鍵不是「要不要寫 spec」，而是 **這個變更是否值得留下審計紀錄**。30 分鐘以下的改動半年後沒人會回頭看，OpenSpec 的價值回不了本。

## 相關閱讀

- [[Superpowers-OpenSpec-兩個抽象層]] — 本文的方法論基礎：為何 Superpowers 與 OpenSpec 不在同一抽象層
- [[AI 軟體工程工作流 2026：從 Spec-Driven 到 Superpowers 的實戰指南|AI 工作流 2026]] — 把本文放回更大的工作流景觀（六大方案中 Spec-Driven + TDD + Agentic 的組合）
- [[AI 代理工作流實戰：從模糊需求到 Develop Done 的完整閉環|AI 代理工作流實戰]] — 另一條閉環路徑（六步閉環），與本文 8 階段互相映照
