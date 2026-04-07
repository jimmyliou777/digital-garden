# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Jimmy's Blog**, a digital garden / personal knowledge base built with [Quartz v4](https://quartz.jzhao.xyz/) (v4.5.1). Content is authored in Obsidian-flavored Markdown and published as a static site to GitHub Pages.

## Common Commands

```bash
# Dev server with hot reload (http://localhost:8080)
npx quartz build --serve

# Production build (outputs to ./public)
npx quartz build

# Type check & format check
npm run check          # tsc --noEmit && prettier --check

# Format code
npm run format         # prettier --write

# Run tests
npm run test           # tsx --test
```

## Architecture

### Two-layer structure

1. **Quartz framework** (`quartz/`) — the SSG engine (TypeScript + Preact). You rarely need to modify this unless customizing the site's rendering pipeline.
2. **Content** (`content/`) — Markdown files organized by topic (Obsidian vault). This is where blog posts and notes live.

### Key config files

| File | Purpose |
|------|---------|
| `quartz.config.ts` | Site metadata, plugin pipeline (transformers → filters → emitters), theme colors/fonts |
| `quartz.layout.ts` | Page layout composition — which components appear in left/right/beforeBody/afterBody slots。Explorer 元件設有 `mapFn` 讀取 `shortTitle` 控制側邊欄顯示名稱 |

### Plugin pipeline (`quartz/plugins/`)

Content flows through three plugin stages defined in `quartz.config.ts`:
- **Transformers** — parse and transform markdown (frontmatter, syntax highlighting, ObsidianFlavored MD, LaTeX/KaTeX, etc.)
- **Filters** — exclude content (e.g. `RemoveDrafts`)
- **Emitters** — generate output pages (content pages, folder pages, tag pages, sitemap, RSS, OG images)

### Components (`quartz/components/`)

Preact components rendered server-side. Each component is a `.tsx` file. Client-side scripts live in `quartz/components/scripts/`. Styles in `quartz/components/styles/`.

### Content conventions

- Files use Obsidian-flavored Markdown (wikilinks, callouts, embeds)
- Frontmatter with `gray-matter` (YAML)
- `ignorePatterns` in config: `["private", "templates", "Inbox", ".obsidian"]`
- Date priority: frontmatter → git → filesystem
- **不要在 Markdown 內加 `# 標題`**（H1）——Quartz 會自動從 frontmatter `title` 渲染頁面標題，手動加 H1 會導致標題重複顯示

### Frontmatter 欄位

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | ✅ | 頁面標題（用於頁面頂部、breadcrumb、SEO） |
| `description` | ✅ | 文章摘要 |
| `tags` | ✅ | 標籤陣列，如 `[AI, Claude Code]` |
| `published` | ✅ | 發布日期 `YYYY-MM-DD` |
| `draft` | ✅ | `true` 則不會被建置輸出 |
| `status` | ✅ | 筆記成熟度：`fleeting` / `literature` / `evergreen` / `published` |
| `shortTitle` | 選填 | Explorer 側邊欄顯示的短標題。未設定時自動 fallback：有 ` — ` 取前半段，超過 20 字截斷加 `...` |

### 筆記成熟度與 draft 對應

| status | draft | 意義 |
|--------|-------|------|
| `fleeting` | `true` | 未整理的靈感，存放於 `content/Inbox/` |
| `literature` | `true` | 已整理的學習筆記，存放於分類資料夾 |
| `evergreen` | `true` | 成熟觀點，尚未發布 |
| `published` | `false` | 已發布文章 |

### Vault 特殊資料夾

| 資料夾 | 用途 | Quartz 建置 |
|--------|------|-------------|
| `content/Inbox/` | 新筆記入口，零整理捕捉 | `ignorePatterns` 排除 |
| `content/private/` | AI 生成內容（wiki、digests） | `ignorePatterns` 排除 |
| `content/templates/` | Obsidian 筆記模板 | `ignorePatterns` 排除 |

### AI 生成內容回存準則

當透過 Claude Code 查詢 vault 知識庫得到有價值的分析結果時：
- **AI 生成的摘要、wiki、交叉連結分析**必須存入 `content/private/wiki/` 或 `content/private/digests/`
- **絕對不要**將 AI 生成內容混入 `content/` 的其他分類資料夾（AI 協作、前端技術、開發思維等）
- 人工撰寫的文章才放在分類資料夾中
- 原因：避免 AI 內容汙染 Obsidian Graph View、搜尋結果和 backlinks

### Mermaid 圖表

Quartz 內建 Mermaid 支援（透過 `ObsidianFlavoredMarkdown` plugin，預設啟用）。撰寫注意事項：

- 節點內換行使用 `<br>`，**不要用 `\n`**（會被渲染為字面文字）
- 中文節點文字可正常渲染
- 圖表會自動同步 light/dark theme

### Excalidraw 圖表

支援 Excalidraw 手繪風格圖表，透過 Obsidian Excalidraw plugin 的 auto-export SVG 功能整合：

- Obsidian 端：Excalidraw plugin 設定開啟「Auto-export SVG」和「Export both light and dark」
- 匯出產生 `.excalidraw.light.svg` + `.excalidraw.dark.svg`，與 `.excalidraw.md` 同層
- 文章中使用 `![[diagram.excalidraw.light.svg]]` 嵌入
- `RemoveExcalidraw` filter plugin 會過濾 `.excalidraw.md`，防止它們被當頁面處理
- Dark mode 透過 CSS `filter: invert(1) hue-rotate(180deg)` 自動反色

### Deployment

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`): build → deploy to GitHub Pages. CI uses `npm ci` (not pnpm), Node 22.

## Tech Details

- **Runtime**: Node >= 22, pnpm 10 (local dev), npm (CI)
- **Language**: TypeScript (ESM, `"type": "module"`)
- **UI**: Preact (not React) for components
- **Build**: esbuild (via Quartz CLI)
- **Styling**: SCSS (`quartz/styles/`)
