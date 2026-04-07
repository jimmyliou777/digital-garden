---
title: 別再寫「你是專家」— 研究告訴我們 Prompt 角色設定的真相
shortTitle: Prompt 角色設定的真相
description: USC 研究發現「你是專家」類 prompt 角色設定會降低程式碼與數學任務的準確率。交叉驗證多篇研究，整理出開發者該如何調整 prompt 策略
tags: [AI, Prompt Engineering, LLM, Developer Tools]
published: 2026-03-25
draft: false
status: published
---

**TL;DR：** 南加州大學研究發現，在 prompt 開頭加「你是專家級程式設計師」這類角色設定，會降低 LLM 在程式碼與數學任務上的準確率（MMLU 從 71.6% 降到 68.0%）。多篇研究交叉驗證了同樣結論：**泛用的角色修飾對準確性任務無效甚至有害，具體的任務約束才是有效的 prompt 策略。**

> 本文預設讀者有使用 ChatGPT / Claude 等 AI 工具的經驗，了解 prompt engineering 的基本概念。

## 研究說了什麼

南加州大學（USC）研究團隊發表的論文《Expert Personas Enhance LLM Alignment but Hurt Accuracy》指出一個違反直覺的發現：**角色設定的效果取決於任務類型**，而且方向可能相反。

研究將任務分成兩類：

| 任務類型 | 範例 | 角色設定效果 |
|---------|------|------------|
| **對齊依賴型**（Alignment-dependent） | 寫作、角色扮演、安全性規範 | 提升表現 |
| **預訓練依賴型**（Pretrain-dependent） | 程式碼生成、數學運算、事實問答 | **降低準確率** |

在 MMLU 基準測試中，設定專家人格的模型準確率僅 **68.0%**，低於沒有角色設定的基礎模型 **71.6%**。差距不大，但方向明確——角色設定不只是沒用，而是有害。

## 其他研究怎麼看

這不是孤例。多項獨立研究得出了類似結論：

**PromptHub 大規模實驗**：測試了 4 個模型家族、2,410 個事實問題，結果發現簡單的角色提示「沒有改善性能，有時還會造成負面影響」。

**Learn Prompting 的 MMLU 測試**：在 2,000 題 MMLU 問題上，各種角色的表現「相當一致」。最諷刺的是，設定為「低能」的角色在某些情境下甚至優於設定為「天才」的角色。這直接挑戰了「角色越厲害、輸出越好」的假設。

**GPT-4 上的差距極小**：Jekyll & Hyde 測試框架發現，在 GPT-4 上，有角色設定和沒有角色設定的差距「非常小」。模型越新越強，角色提示的邊際效益就越低。

**ExpertPrompting 框架的例外**：唯一顯示角色提示有效的研究，用的不是「你是專家」這種泛用描述，而是自動生成的**詳細、具體的角色描述**。換句話說，有效的不是「你是資深工程師」，而是對任務需求的精確描述。

整合來看，研究共識是：

> 泛用的「你是專家」→ 對準確性任務無效甚至有害
> 具體的任務約束和上下文 → 有效
> 模型越新 → 角色提示效益越低

## 技術原因：為什麼會這樣

USC 研究團隊提出的解釋是**運算資源競爭**。

當你在 prompt 開頭加上角色設定，模型會啟動「指令遵循模式」（instruction-following mode）——它會花更多運算資源去對齊你設定的角色行為模式。問題在於，這些資源原本可以用在「事實檢索」上，也就是從預訓練資料中精確提取正確答案。

簡單說：模型在忙著「扮演專家」，反而沒空「當專家」。

針對這個問題，USC 團隊開發了 **PRISM** 技術，利用門控 LoRA（Gated LoRA）機制，讓模型在需要人格特質時才啟動適配器，其餘時間保持基礎模型的精準度。這是模型層面的解法，目前還在研究階段。

對使用者來說，解法更直接——調整你的 prompt 策略。

## 那我的 Prompt 該怎麼寫？

### 分場景策略

| 場景 | 建議 | 原因 |
|------|------|------|
| 寫程式碼 | 直接描述需求和約束 | 角色設定會降低程式碼準確率 |
| 數學 / 邏輯推理 | 直接給問題，不加角色 | 預訓練知識不需要角色激活 |
| 創意寫作 / 文案 | 可以加角色設定 | 對齊型任務確實受益於角色 |
| 安全性 / 規範遵循 | 加具體規則和角色 | 對齊需求明確時有效 |
| Code review | 給具體的檢查標準 | 比「你是資深 reviewer」有效 |

### 無效 vs 有效做法

```
// 無效：泛用角色修飾
"你是一位世界級的 TypeScript 專家，擁有 20 年經驗..."

// 有效：具體的行為約束
"使用 TypeScript strict mode，不使用 any。
 優先使用 Server Components，非必要不加 'use client'。
 錯誤必須被處理或顯式忽略並加上註解。"
```

差異很清楚：前者在告訴模型「你是誰」，後者在告訴模型「怎麼做」。研究證實後者才有效。

### 實際案例：CLAUDE.md 的寫法

以 Claude Code 的 `CLAUDE.md` 為例，這是兩種風格的對比：

**Persona-driven（研究顯示低效）：**

```markdown
# Identity
你是一位資深全端工程師，精通 React、TypeScript 和系統設計。
你有 15 年的軟體開發經驗，擅長寫出高品質、可維護的程式碼。
```

**Constraint-driven（研究顯示有效）：**

```markdown
# Code Principles
- TypeScript strict mode — 絕對不用 any、@ts-ignore
- Component composition over inheritance
- Server Components first — 非必要不加 'use client'
- Fix minimally — 修 bug 時不順手重構，除非被明確要求
```

前者花了 token 描述一個人設，後者把同樣的 token 用在具體的行為規範上。模型不需要被告知「你很厲害」才能寫好程式——它需要的是清楚的約束和上下文。

## 結論

「你是專家」這類 prompt 角色設定的流行，可能源自一個直覺錯誤：我們把與人類溝通的經驗套用到 LLM 上。告訴一個人「你是專家」可能激發他的自信和認真態度，但 LLM 沒有自信心——它有的是運算資源的分配機制，而角色設定恰好會干擾這個機制。

核心 takeaway：

1. **程式碼和數學任務**：跳過角色修飾，直接給約束和需求
2. **創意和對齊任務**：角色設定仍然有用
3. **模型越新**：角色提示的效益越低，具體指令的價值越高
4. **如果要用角色**：用詳細、具體的任務描述，不是泛用的「你是專家」

下次寫 prompt 時，把「你是一位資深工程師」換成「使用 TypeScript strict mode，不使用 any」——研究告訴我們，後者才是真正有效的做法。

## Further Reading

- [TechNews — 寫提示詞別再加「你是專家」，研究建議直接發送指令](https://technews.tw/2026/03/24/dont-add-youre-an-expert-to-your-prompts-anymore/)
- [PromptHub — Role-Prompting: Does Adding Personas Really Make a Difference?](https://www.prompthub.us/blog/role-prompting-does-adding-personas-to-your-prompts-really-make-a-difference)
- [Learn Prompting — Role Prompting](https://learnprompting.org/docs/advanced/zero_shot/role_prompting)
- [Lakera — The Ultimate Guide to Prompt Engineering in 2026](https://www.lakera.ai/blog/prompt-engineering-guide)
- [1,500+ Research Papers on Prompt Engineering — What Actually Works](https://aakashgupta.medium.com/i-spent-a-month-reading-1-500-research-papers-on-prompt-engineering-7236e7a80595)
