---
title: "Skill 工具箱 — 我的 Claude Code 自建 Skill 清單"
description: "自建 skill 的索引、使用場景與鏈路組合記錄"
tags: [Claude Code, Skill, 工具鏈, 知識管理]
published: 2026-04-07
draft: false
status: published
shortTitle: "Skill 工具箱"
---

隨著 Claude Code 使用愈深，逐漸累積了一些自建 Skill。這篇筆記記錄我建了哪些、怎麼用、以及常見的串接組合。

所有自建 Skill 的原始碼版控在 jimmy-skills repo，透過 symlink 掛載到 `~/.claude/skills/`。

## Skill 清單

| Skill | 用途 | 狀態 | 建立日期 |
|-------|------|------|----------|
| tech-profile | 技術棧偵測與訪談，產出 `docs/tech-stack-profile.md` | active | 2026 |
| scaffold-rules | 依據技術棧自動生成 `.claude/rules/` 和 `CLAUDE.md` 骨架 | active | 2026 |

## 鏈路組合

### 新專案初始化

適用場景：拿到一個新專案或 repo，需要建立 AI 開發規範。

1. `/tech-profile` — 掃描專案或訪談產出技術棧描述檔
2. 人工確認 `docs/tech-stack-profile.md`，補齊 `[?]` 項目
3. `/scaffold-rules` — 消費技術棧描述檔，生成規範骨架

這條鏈路的關鍵是中間的人工確認步驟——tech-profile 的偵測結果不一定完整，需要人工補齊後 scaffold-rules 才能產出準確的規範。

## 使用心得

- tech-profile 對已有 `package.json` 的前端專案偵測效果好，對純 Python 或 Go 專案需要靠訪談模式補齊
- scaffold-rules 產出的骨架是起點，實際規範需要根據團隊慣例調整
