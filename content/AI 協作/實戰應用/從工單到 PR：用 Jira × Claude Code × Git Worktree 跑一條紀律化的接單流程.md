---
title: "從工單到 PR：用 Jira × Claude Code × Git Worktree 跑一條紀律化的接單流程"
description: 把一張 Jira 工單從接單到 PR 的工作流，拆成接單與釐清、隔離開桌、紀律落地、交回收尾四個心態切換點。介紹「工單即上下文 (Ticket as Context)」這個讓 Claude 不再飛太遠的設計原則。
tags:
  - AI 協作
  - Claude Code
  - Jira
  - Git Worktree
  - 工作流
  - TDD
published: 2026-05-20
draft: false
status: evergreen
shortTitle: 從工單到 PR 接單實戰
---

## 問題識別

在熟悉了 Claude Code 的 TDD 紀律、也理解 Git Worktree 能隔離環境之後，多數
工程師會卡在同一個問題：

> 「明天早上一打開電腦，Jira 上躺著三張 ticket，我到底該怎麼下第一個指令，
> 才不會寫到一半發現方向錯了？」

問題不在工具本身，而在**接單那一刻**。Jira 的 description 通常寫得粗、AC
不夠細、reproduce 步驟散落在 comment 裡；如果直接把 ticket 標題丟給 Claude，
它會用一個模糊的方向跑很久，最後產出一份「看起來對、實際不對」的 PR。問題
也不在最後合併那一刻：你以為改完了，但 ticket 沒同步更新、AC 沒回填、commit
訊息沒掛上 ticket key，下一個人接手時又得從頭考古。

這篇文章把這條「從工單到 PR」的工作流寫成一套接單到收尾的流程——讓三個工具
各司其職、每個階段都有明確的心態切換點。

## 三個工具的角色拆分

把這套流程運轉起來，需要三個角色，缺一不可：

- **Jira 像派工人 (Dispatcher)**，負責把模糊需求轉成有 ID、有 AC、有狀態的
  工單，並在過程中保持單一事實來源。
- **Claude Code 像資深工程師 (Senior Engineer)**，負責把 AC 拆成測試、把
  測試實作通過，並在過程中遵守 TDD 紀律。
- **Git Worktree 像獨立工作桌 (Workbench)**，負責把這張單的所有改動隔離在
  一個乾淨的目錄裡，不會跟你 main 上正在做的事情互相污染。

讀完這三句，腦中應該已經有一個劇本：派工人發單，工程師在獨立的工作桌上做，
做完交回。三者的分工是**互補不重疊**的——派工人不寫程式，工程師不管狀態，
工作桌不參與內容。職責清楚，過程才不會糊掉。

關鍵概念詞先在這裡丟出來，後面會反覆出現：

- **工單即上下文 (Ticket as Context)**：Jira ticket 不只是任務追蹤，它是
  整段 prompt 的脊椎。你給 Claude 的每一個指令，最終都應該回扣到這張單的
  AC 與描述。

![[01-framework-three-tool-roles.png]]

## 四個心態切換點

![[02-flowchart-four-stages.png]]

把整段流程切成四個階段，不是按時間切，是按**心態切**——你會發現每進一個
階段，思考模式都不太一樣。

### 階段一：接單與釐清 (Receive & Clarify)

**意圖**：把工單從「工單系統裡的條目」變成「自己腦中清晰的需求」。

第一件事不是動程式，是**先把 ticket 讀懂**。透過 Atlassian MCP 把 ticket
完整內容拉到對話裡（標題、description、AC、所有 comment、所有 attachment
連結），讓 Claude 把它整理成一份結構化的需求清單，並**主動標出三件事**：

1. AC 有沒有不夠具體的地方（「能正常運作」這種就要追問）
2. description 與 AC 有沒有矛盾
3. 有沒有缺少 reproduce 步驟、輸入範例、邊界條件

這時候如果有疑問，**回到 Jira 加 comment 問人**，不要自己腦補。把問題的
答案也補回 ticket 描述，不要只留在對話裡——因為對話會清空，ticket 不會。

完成這個階段，你應該能用一句話跟同事說：「這張單就是要解決 X，AC 是 Y 跟
Z，邊界條件是 W。」說不出來，就還沒完成這個階段。

**轉場**：需求清楚了，就該離開 main 分支，找個乾淨的地方開工。

### 階段二：隔離開桌 (Isolate)

**意圖**：建立一個與 main 完全隔離、且綁定到這張工單的工作空間。

`git worktree add` 一個新目錄，分支名稱直接帶上 ticket key（例如
`feature/PROJ-4547-search-filter`）。這一步看起來只是 git 操作，但它的價值
在於：**未來任何人看到這個目錄或這個分支，立刻知道它對應哪張單**。這是
「工單即上下文」原則的物理體現——連目錄名都在指回 ticket。

進入新 worktree 後，把 ticket 的結構化需求清單（階段一產出）放進這個目錄
的某個位置——可以是 `.claude/ticket-context.md`，可以是某個 scratchpad
資料夾。重點是：**這個目錄裡的所有 AI 對話，都能隨時 reference 到這份
需求**。Claude 不會飛太遠，因為脊椎一直在。

**轉場**：環境乾淨、需求在手，現在可以開始用 TDD 紀律寫程式了。

### 階段三：紀律落地 (Implement with Discipline)

**意圖**：把 AC 一條條變成測試、再把測試一條條變成程式碼。

順序很重要：**先寫測試，再寫實作**。Claude Code 開啟 TDD 紀律後，每進一個
sub-task 就走一遍紅 → 綠 → 重構。如果你發現 Claude 想跳過測試直接寫實作，
打斷它，要求回到測試。這不是潔癖，是讓 AC 與程式碼之間建立**可追溯的對應
關係**——每條 AC 都該對應到至少一個測試。

過程中保持兩個小習慣：

- **每個 commit 訊息掛 ticket key**：`feat(PROJ-4547): add status filter
to search bar`。這讓未來 `git log | grep PROJ-4547` 能撈出這張單的所有
  改動。
- **每次心態切換時 `/clear`**：寫完一個 AC、要進下一個 AC 之前清掉對話。
  讓 Claude 重新讀 `ticket-context.md` 再開始，避免上下文越積越雜。

**轉場**：所有 AC 都有測試、所有測試都過了，準備把工作交回派工人。

### 階段四：交回收尾 (Hand Back & Close)

**意圖**：把分散的產出物（程式、測試、commits、Jira 狀態）**重新聚回到
ticket**，讓它變成單一事實來源。

四件事，順序不能亂：

1. **回填 ticket**：把實作過程中真正的決策（為什麼選 A 不選 B、實際支援的
   邊界）寫進 ticket 的 comment 或描述，**不是只放在 PR description**。
   PR 會消失（合併後沒人看），ticket 不會。
2. **開 PR**：title 帶上 ticket key 與 AC 簡述，description 連結回 ticket，
   並列出每條 AC 對應到哪些測試與檔案。
3. **transition 工單**：用 Atlassian MCP 把 ticket 狀態推到「等待 review」
   或「等待測試」，附上 PR 連結。
4. **回到 main，移除 worktree**：`git worktree remove ../PROJ-4547`，這張
   單的物理痕跡就此清掉，只留下 Jira 與 git history 兩條可追溯的脈絡。

如果 reviewer 要求改，**回到階段一重新讀一次 ticket**——說不定 reviewer
的意見其實是因為 ticket 補了新的 AC。不要直接在 PR 上對著 reviewer 的話
改，那會讓你慢慢離開「工單即上下文」原則。

## 什麼時候不必走全套

這條流程在「半天到三天」的中型功能或中型修復上效益最大——AC 多到值得拆
階段、改動範圍大到值得開 worktree、會留下需要後人回溯的決策。三類情況
不必走全套：

- **改一個 typo / 補一個 log**：直接在 main 分支改、commit、開 PR，
  階段二三可以省略。
- **緊急 hotfix**：時間壓力下先救火，事後再回填 ticket 紀錄。
- **探索性 spike**：還在試方向時用 throwaway branch，不必開 worktree。

流程是工具，不是儀式。判斷的依據是「半年後有沒有人需要回來看這張單的
決策？」——需要就走全套，不需要就跳過階段。

## 三層次收穫

![[03-framework-three-level-outcome.png]]

跑完這條流程，你不僅交出了一張單該交的東西，還會發現另外兩件事悄悄發生了。

| 層次         | 你得到了什麼                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------- |
| **直接產出** | 一張關閉的 ticket + 一份可合併的 PR + 一套通過的測試                                         |
| **副產品**   | AC 與測試之間可追溯的對應、commit 訊息可被 grep 回 ticket、ticket 內紀錄了實作過程的真實決策 |
| **元層次**   | 一條可重複的接單紀律——下次再開三張單，你不再焦慮先動哪個，因為每張單都會走一樣的四個心態切換 |

第一張單跑完，你會覺得「跟以前差不多，只是慢一點」。第五張單跑完，你會
發現有人問起三個月前那張 ticket 時，你能十秒內把當時的決策找回來——而你
**根本沒去回想**，是流程在替你記住。

回到開頭的問題——「明天早上打開電腦，三張 ticket 該怎麼下第一個指令」——
現在答案很短：第一個指令是 Atlassian MCP，把第一張 ticket 拉進對話，進入
階段一。剩下的，**流程會帶著你走**。

> [!note] 相關閱讀
>
> - [[AI 代理工作流實戰：從模糊需求到 Develop Done 的完整閉環]] — 對照閉環變體
> - [[從 Prompt 到系統：用 Claude Code 打造 AI 開發閉環的五層架構設計]] — 角色分工的方法論底層
> - [[Superpowers-OpenSpec-OAuth2-8階段實戰]] — 8 階段紀律化實作
> - [[Claude Code之父曝15項技巧：如何讓AI自己排程寫程式？]] — 技巧 10 Worktrees
> - [[AI 軟體工程工作流 2026：從 Spec-Driven 到 Superpowers 的實戰指南]] — 接單場景上位方法論
