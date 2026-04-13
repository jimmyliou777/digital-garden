---
title: "Claude Code之父曝15項技巧：如何讓AI自己排程寫程式？"
shortTitle: "Boris Cherny 15 技巧"
source: "https://www.bnext.com.tw/article/90524/claude-code-boris-cherny-15-pro-tips-auto-dev-workflow"
author: 李先泰
published: 2026-04-08
created: 2026-04-08
description: "Claude Code 創造者 Boris Cherny 親揭 15 個隱藏功能，涵蓋跨裝置接力、排程自動化等，重新定義 AI 輔助開發的工作方式。"
tags: [Claude Code, AI, Developer Tools, Workflow]
status: literature
draft: true
---

一篇在 X 上累積 375 萬次瀏覽的貼文，來自一個格外有說服力的帳號： [@bcherny](https://x.com/bcherny/status/2038454336355999749) ，Claude Code 的創造者 Boris Cherny 本人。

身為「Claude Code 之父」，Cherny 近期公開他日常最依賴、卻也最常被忽視的 15 個功能。

一般使用者把 Claude Code 當成「比較聰明的補全工具」——打開終端機，貼上任務，等它跑完。

但 Cherny 的用法不同：他同時跑著幾十個 Claude 實例，在手機上寫程式，靠語音下指令，讓排程 Agent 每 30 分鐘自動送出 PR。工具沒換，但工作流徹底不同。

Cherny 分享的技巧，核心邏輯只有一個： **讓 Claude 自己繼續工作，而不是等你下指令** 。

## 15 個技巧逐一拆解

### 技巧 1：用手機寫程式

Claude Code 有官方 iOS/Android app，Cherny 說他「大量程式碼都在 iOS app 上寫」。

開啟路徑：下載 Claude app → 左側 **Code tab** 。

### 技巧 2：跨裝置無縫接力

在手機開始的 session，可以轉移到桌機終端機繼續；反之亦然。

```
# 將雲端 session 接到本機終端
claude --teleport

# 或在 session 內執行
/teleport
```

若要從手機遠端控制本機正在跑的 session：

```
/remote-control
```

Cherny 建議直接在 /config 開啟「Enable Remote Control for all sessions」，讓這個功能常態啟用。

### 技巧 3：排程自動跑、/loop 與 /schedule

這是 Cherny 評為「最強大的兩個功能」。

`/loop` 讓 Claude 按指定間隔重複執行某個 skill； `/schedule` 則可排定最長一週的任務。Cherny 自己跑著的 loop 包含：

```
# 每 5 分鐘：自動回應 code review、自動 rebase、把 PR 推進 production
/loop 5m /babysit

# 每 30 分鐘：自動產出 Slack feedback 的 PR
/loop 30m /slack-feedback

# 每 1 小時：關閉過時或不再需要的 PR
/loop 1h /pr-pruner
```

**心法** ：先把重複性工作流程寫成 skill，再用 loop 讓它自動執行。

### 技巧 4：用 Hooks 控制 Agent 生命週期

Hooks 讓你在 Agent 的關鍵節點插入自訂邏輯，實現確定性控制。

四個主要 hook 時機點：

| Hook | 觸發時機 | 應用範例 |
| --- | --- | --- |
| SessionStart | 每次啟動 Claude | 動態載入 context |
| PreToolUse | 每次執行 bash 指令前 | 記錄所有指令 log |
| PermissionRequest | 需要授權時 | 把授權請求推送到 WhatsApp |
| Stop | Claude 停止作業時 | 自動 poke 讓它繼續 |

設定方式見 [code.claude.com/docs/en/hooks](http://code.claude.com/docs/en/hooks) 。

### 技巧 5：用 Cowork Dispatch 遠端控制桌機

Dispatch 是 Claude Desktop app 的安全遠端控制介面，可以從手機或任何裝置操作本機的 MCP、瀏覽器與應用程式。

Cherny 的使用場景：不在電腦旁時，用 Dispatch 處理 Slack 訊息、Email、管理檔案。

**入口** ： [claude.com](http://claude.com/) 的 Cowork 功能。

### 技巧 6：用 Chrome 擴充功能讓 Claude 驗證前端輸出

**這是 Cherny 給所有 Claude Code 用戶的核心建議** ：給 Claude 一個驗證輸出的方法，它就會一直迭代直到結果正確。

Chrome 擴充功能讓 Claude 能直接在瀏覽器裡看到它修改後的頁面外觀，等同於給它「眼睛」——不用你截圖貼回去，它自己確認、自己修。

**安裝** ： [code.claude.com](http://code.claude.com/) 的 Chrome beta 說明。

### 技巧 7：Desktop app 自動啟動並測試 web server

Claude Desktop app 內建讓 Claude 自動跑起 web server、並在內建瀏覽器中測試的能力。不需要你手動 `npm run dev` ，它自己啟動、自己看結果。

這個功能也可以在 CLI 模式下用類似邏輯設定。

### 技巧 8：分叉 Session

對同一個任務想試兩種方向？分叉 session，不需要從頭來。

兩種方式：

```
# 方式一：在 session 內執行
/branch

# 方式二：從 CLI 指定 session ID 並分叉
claude --resume <session-id> --fork-session
```

### 技巧 9：用 /btw 在 Agent 作業時提問側邊問題

Agent 正在跑長任務時，你有個快問題但不想打斷它——用 `/btw` 。

```
/btw 這個函式的時間複雜度是多少？
```

它回答你的問題，然後繼續原本的任務，不中斷工作流。

### 技巧 10：用 Git Worktrees 同時跑幾十個 Claude

**這是 Cherny 實現「幾十個 Claude 同時運行」的底層機制。**

Worktrees 讓同一個 repository 有多個工作目錄，每個 Claude session 在自己的 worktree 裡獨立作業，互不干擾。

```
# 在新的 worktree 開啟 session
claude -w

# Claude Desktop app：勾選 "worktree" 核取方塊
```

非 git VCS 用戶：使用 WorktreeCreate hook 自訂建立邏輯。

### 技巧 11：用 /batch 展開大規模平行作業

`/batch` 是大型 codebase 遷移的利器。執行後，Claude 先跟你面談需求，再把工作分拆給 **幾十、幾百、甚至幾千個** worktree agents 同時執行。

適合：大型程式碼遷移、需要橫跨整個 repo 的平行改動。

```
/batch
```

### 技巧 12：--bare 讓 SDK 啟動加速最多 10 倍

在非互動模式下（ `claude -p` 或 TypeScript/Python SDK），預設會搜尋本機的 CLAUDE.md 、settings、MCP。對自動化腳本來說，這是不必要的開銷。

加上 `--bare` 跳過自動搜尋，啟動速度大幅提升：

```
claude -p --bare "你的任務"
```

`--bare` 跳過的載入流程正是 [[Claude Code 系統提示詞架構優化：從 Always-Load 到按需載入|系統提示詞按需載入]] 討論的四層機制——如果你的 CLAUDE.md 已經很精簡，`--bare` 的加速效果會比較有限。

### 技巧 13：--add-dir 讓 Claude 跨 repo 工作

在 A repo 開啟 session，但任務需要存取 B repo？用 `--add-dir` ：

```
# 啟動時指定
claude --add-dir ../other-repo

# 或在 session 內動態新增
/add-dir ../other-repo
```

這不只讓 Claude 「看到」另一個 repo，同時也開放對應的操作權限。

### 技巧 14：--agent 給 Claude 自訂 system prompt 與工具

這是被低估最嚴重的功能之一。先在 `.claude/agents/` 定義一個 agent，再用 `--agent` 呼叫它：

```
claude --agent=<你的 agent 名稱>
```

每個 agent 可以有自己的系統提示詞、工具集、行為邊界。適合把重複性高的角色（code reviewer、tech writer、security auditor）打包成可重用的 agent。

### 技巧 15：/voice 語音輸入

Cherny 坦言：「我大部分的程式碼都是用說的，不是用打的。」

啟用語音輸入：

```
# CLI：執行後按住空白鍵說話
/voice

# Desktop app：點擊語音按鈕
# iOS：在 iOS 設定開啟聽寫功能
```

## 最適合哪些情境？

- **長時間的 codebase 遷移** ： `/batch` + worktrees
- **需要持續監控的 CI/CD 工作流** ： `/loop` + hooks
- **跨裝置開發** （通勤、不在桌機旁）：mobile app + teleport
- **SDK 自動化腳本** ： `--bare` + `--add-dir`
- **前端 UI 開發** ：Chrome 擴充功能

## 使用前需要確認的事

這 15 個功能並非全部免費或全平台可用：

- `/loop` 、 `/schedule` 屬於進階功能，免費方案每週有執行上限，長時間自動化需要付費方案
- Cowork Dispatch 目前整合在 Claude 付費訂閱中
- Chrome 擴充功能仍標示為 beta，部分功能可能不穩定
- `/batch` 涉及大量 API 呼叫，成本需自行估算
- 語音輸入的準確度受環境噪音影響，技術術語（函式名稱、指令參數）建議仍手打確認

此外， `--bare` 跳過 CLAUDE.md 和 MCP 設定載入，用在需要特定 context 的任務時，需手動補充必要資訊，否則輸出可能缺乏脈絡。

最後要提醒的是，不要把這份清單當成「功能目錄」背誦。選一個你今天就能用到的技巧，例如你常跑長任務，試試 /loop；如果你有多個 repo 要處理，試試 --add-dir。

方法論不難，難的是從第一個技巧開始動手。

資料來源： [Boris Cherny (@bcherny) on X](https://x.com/bcherny/status/2038454336355999749)

本文初稿為AI編撰，整理．編輯/ 李先泰

## 相關筆記

- [[從 Prompt 到系統：用 Claude Code 打造 AI 開發閉環的五層架構設計]]
- [[AI 代理工作流實戰：從模糊需求到 Develop Done 的完整閉環]]
- [[AI 軟體工程工作流 2026：從 Spec-Driven 到 Superpowers 的實戰指南]]
- [[gstack — 把 Claude Code 變成虛擬工程團隊的開源框架]]
