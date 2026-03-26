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
- `ignorePatterns` in config: `["private", "templates", ".obsidian"]`
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
| `shortTitle` | 選填 | Explorer 側邊欄顯示的短標題。未設定時自動 fallback：有 ` — ` 取前半段，超過 20 字截斷加 `...` |

### Mermaid 圖表

Quartz 內建 Mermaid 支援（透過 `ObsidianFlavoredMarkdown` plugin，預設啟用）。撰寫注意事項：

- 節點內換行使用 `<br>`，**不要用 `\n`**（會被渲染為字面文字）
- 中文節點文字可正常渲染
- 圖表會自動同步 light/dark theme

### Deployment

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`): build → deploy to GitHub Pages. CI uses `npm ci` (not pnpm), Node 22.

## Tech Details

- **Runtime**: Node >= 22, pnpm 10 (local dev), npm (CI)
- **Language**: TypeScript (ESM, `"type": "module"`)
- **UI**: Preact (not React) for components
- **Build**: esbuild (via Quartz CLI)
- **Styling**: SCSS (`quartz/styles/`)
