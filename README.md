# Jimmy's Blog

以 [Quartz v4](https://quartz.jzhao.xyz/) + [Obsidian](https://obsidian.md/) 打造的數位花園。內容在 Obsidian 中撰寫，透過 Quartz 建置為靜態站點，部署到 GitHub Pages。

這不只是一個部落格，而是一套第二大腦知識管理系統 — 從靈感捕捉到公開發布，有完整的流程與自動化機制。

## 知識管理流程

```
捕捉 → 整理 → 連結 → 發布
```

| 階段 | 做什麼 | 怎麼做 |
|------|--------|--------|
| **捕捉** | 零摩擦記錄想法 | 丟進 `Inbox/`，不用管格式 |
| **整理** | 補 frontmatter、分類歸檔 | 從 Inbox 移到對應主題資料夾 |
| **連結** | 建立知識網路 | 用 `[[wikilink]]` 串連相關筆記 |
| **發布** | 上線公開 | 設 `status: published` + `draft: false`，push 後自動部署 |

## 筆記成熟度

每篇筆記都有 `status` 標記其成熟階段，與 `draft` 欄位連動控制是否發布：

| Status | Draft | 意義 | 存放位置 |
|--------|-------|------|----------|
| `fleeting` | `true` | 未整理的靈感 | `content/Inbox/` |
| `literature` | `true` | 已整理的學習筆記 | 主題資料夾 |
| `evergreen` | `true` | 成熟觀點，尚未發布 | 主題資料夾 |
| `published` | `false` | 已發布文章 | 主題資料夾 |

只有 `published` 狀態的筆記會被 Quartz 建置輸出。

## 內容架構

```
content/
  AI 協作/          # AI 協作方法論與實戰應用
  前端技術/          # 前端開發筆記
  開發思維/          # 軟體開發方法論與工具鏈
  Inbox/            # 新筆記入口（不發布）
  private/          # AI 生成內容（不發布）
    wiki/           #   知識庫摘要
    digests/        #   交叉分析
  templates/        # Obsidian 筆記模板（不發布）
```

**AI 內容隔離**：Claude Code 產出的摘要、wiki、分析一律存入 `private/`，不混入主題資料夾，避免汙染 Graph View 與搜尋結果。

## Vault 健康自動化

每次開啟 Claude Code 對話時，SessionStart hook 會自動執行健康檢查並報告：

- **Inbox 未處理** — 有多少筆記還在 Inbox，幾則超過 7 天未處理
- **孤立筆記** — 沒有任何 `[[wikilink]]` 的文章，可能需要補連結
- **停滯筆記** — `status: literature` 超過 30 天未更動，提醒推進或歸檔

範例輸出：`📬 Inbox: 3 則未處理（1 則超過 7 天）` `🔗 健康：10 篇無 wikilink`

## 快速開始

```bash
# 開發伺服器（http://localhost:8080）
npx quartz build --serve

# 正式建置
npx quartz build

# 型別檢查 + 格式檢查
npm run check
```

技術架構、plugin pipeline、frontmatter 規格等開發細節請參閱 [`CLAUDE.md`](./CLAUDE.md)。
