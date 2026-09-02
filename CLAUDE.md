# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Jimmy's Blog — digital garden built with [Quartz v4](https://quartz.jzhao.xyz/) (v4.5.1)。Obsidian-flavored Markdown → GitHub Pages 靜態站。

## Common Commands

```bash
npx quartz build --serve     # Dev server (http://localhost:8080)
npx quartz build             # Production build (→ ./public)
npm run check                # tsc --noEmit && prettier --check
npm run format               # prettier --write
npm run test                 # tsx --test（跑 quartz/**/*.test.ts）
npx tsx --test quartz/util/path.test.ts   # 單一測試檔
npm run docs                 # 以 docs/ 為 vault 起 dev server（Quartz 官方文件）
```

**套件管理器一律用 npm**：`package.json` 的 `packageManager` 欄位（pnpm）是 upstream 殘留，本 repo 有 `package-lock.json`、CI 跑 `npm ci`。不要用 pnpm/yarn。

測試只覆蓋框架層（目前僅 `quartz/util/path.test.ts`、`fileTrie.test.ts`）；內容變更沒有測試可跑，用 `npm run check` + 本地 build 驗證。

## Architecture

這是 **upstream Quartz 的 fork**，內容與框架混在同一個 repo：

| 路徑               | 性質                                                                                                           | 動不動                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `content/`         | Obsidian vault（本 repo 的實際產出）                                                                           | 主要工作區                             |
| `quartz.config.ts` | Site metadata、plugin pipeline（transformers → filters → emitters）、theme                                     | 客製點                                 |
| `quartz.layout.ts` | Page layout composition。Explorer 的 `mapFn` 讀 `shortTitle` 控制側邊欄顯示名稱、`filterFn` 濾掉 `.excalidraw` | 客製點                                 |
| `quartz/`          | Quartz 框架 source（build pipeline、components、plugins）                                                      | **不要改**——`npx quartz update` 會覆蓋 |
| `docs/`            | upstream Quartz 官方文件，非本站內容                                                                           | 不動                                   |

Build pipeline 的關鍵設定（`quartz.config.ts`）：

- `ignorePatterns: ["private", "templates", "Inbox", ".obsidian", "raw"]`
- `defaultDateType: "published"` — 站上顯示的日期取 frontmatter `published`
- filters `RemoveDrafts()` + `RemoveExcalidraw()` — `draft: true` 與 Excalidraw 原始檔不輸出
- `CustomOgImages()` 是 build 最慢的 emitter，需要縮短 build 時間時先註解它

**已知的 upstream 殘留**（動到相關功能時要一併修）：`configuration.baseUrl` 仍是 `quartz.jzhao.xyz`，`quartz.layout.ts` 的 footer 連結仍指向 Quartz 官方 GitHub/Discord。baseUrl 錯誤會讓 RSS、sitemap、OG image 產出指向別人的站。

## Content Rules

### 撰寫規範

- 使用 Obsidian-flavored Markdown（wikilinks、callouts、embeds）
- Frontmatter 用 YAML（`gray-matter` 解析）
- **不要在 Markdown 內加 `# 標題`**（H1）— Quartz 從 frontmatter `title` 渲染頁面標題，手動加會重複
- Date priority：frontmatter → git → filesystem

### Frontmatter 欄位

| 欄位          | 必填 | 說明                                                                              |
| ------------- | ---- | --------------------------------------------------------------------------------- |
| `title`       | ✅   | 頁面標題（頁面頂部、breadcrumb、SEO）                                             |
| `description` | ✅   | 文章摘要                                                                          |
| `tags`        | ✅   | 標籤陣列，如 `[AI, Claude Code]`                                                  |
| `published`   | ✅   | 發布日期 `YYYY-MM-DD`                                                             |
| `draft`       | ✅   | `true` 則不建置輸出                                                               |
| `status`      | ✅   | 筆記成熟度：`fleeting` / `literature` / `evergreen` / `published`                 |
| `shortTitle`  | 選填 | Explorer 側邊欄短標題。未設定時 fallback：有 `<空格>—<空格>` 取前半段，超過 20 字截斷加 `...` |

### 筆記成熟度

`status` 與 `draft` 連動，只有 `published` 會上線：

| status       | draft   | 意義               | 位置             |
| ------------ | ------- | ------------------ | ---------------- |
| `fleeting`   | `true`  | 未整理的靈感       | `content/Inbox/` |
| `literature` | `true`  | 已整理的學習筆記   | 主題資料夾       |
| `evergreen`  | `true`  | 成熟觀點，尚未發布 | 主題資料夾       |
| `published`  | `false` | 已發布文章         | 主題資料夾       |

晉升是人工決定：**不要自行把筆記的 status 往上調或把 `draft` 改成 `false`**，發布與否由作者拍板。

### Vault 特殊資料夾

| 資料夾                | 用途                               | Quartz 建置          |
| --------------------- | ---------------------------------- | -------------------- |
| `content/Inbox/`      | 新筆記入口，零整理捕捉             | 排除                 |
| `content/private/`    | AI 生成內容（wiki、digests）       | 排除                 |
| `content/templates/`  | Obsidian 筆記模板                  | 排除                 |
| `content/raw/`        | 未消化的原始素材（外部文章剪貼等） | 排除                 |
| `content/Excalidraw/` | Excalidraw 原始檔與匯出 SVG        | 原始檔由 filter 排除 |

### AI 生成內容回存準則

- AI 生成的摘要、wiki、交叉連結分析 → 存入 `content/private/wiki/` 或 `content/private/digests/`
- **絕對不要**混入 `content/` 的分類資料夾（AI 協作、前端技術、開發思維等）
- 人工撰寫的文章才放在分類資料夾中
- 原因：避免 AI 內容汙染 Graph View、搜尋結果和 backlinks

### 圖檔（光柵圖 PNG/JPG/SVG）

| 規則     | 說明                                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| 位置     | **一律放 `content/images/`** 共享資料夾，不要在文章資料夾下建 `imgs/` 或 `attachments/` 子資料夾                  |
| 引用語法 | **用 Obsidian wikilink `![[01-framework-name.png]]`**，不要用標準 markdown `![alt](images/01-framework-name.png)` |
| 檔名     | `NN-{type}-{slug}.png`（例：`01-framework-subagent-isolation.png`），與 baoyu-article-illustrator 預設一致        |

原因：

- Quartz 從 Obsidian vault 出版，wikilink 是專案統一語法；標準 markdown image path 在 Quartz 解析會失敗、圖不顯示
- 在文章資料夾建 `imgs/` 子目錄會被 Quartz 當成新分類資料夾跑進 Explorer 側邊欄（`ignorePatterns` 沒列）
- 共享 `content/images/` 讓檔名 grep、Excalidraw 自動匯出、backlink 索引都能找到圖

**baoyu-article-illustrator 使用注意**：該 skill 預設輸出到 `{article-dir}/imgs/`，**生圖後必須把 PNG 搬到 `content/images/` 並刪掉 imgs 資料夾**，markdown 引用同步改為 wikilink 語法。

### 圖表（向量圖 Mermaid / Excalidraw）

- **Mermaid**：直接在文章中寫 ` ```mermaid ` fenced block，Quartz 原生渲染，無需額外設定
- **Excalidraw**：原始檔為 `content/Excalidraw/<name>.excalidraw.md`（Obsidian Excalidraw plugin 格式），並由 plugin 自動匯出 `<name>.excalidraw.light.svg` / `.dark.svg`
- 文章中**引用匯出的 SVG**（`![[name.excalidraw.light.svg]]`），不要引用 `.excalidraw.md` 原始檔——它被 `RemoveExcalidraw()` filter 濾掉，不會有輸出頁面

## Deployment

Push to `main` → GitHub Actions（`.github/workflows/deploy.yml`）→ `npm ci` + `npx quartz build` → GitHub Pages。Node 22、ubuntu-22.04。
