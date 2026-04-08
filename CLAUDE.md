# CLAUDE.md

Jimmy's Blog — digital garden built with [Quartz v4](https://quartz.jzhao.xyz/) (v4.5.1)。Obsidian-flavored Markdown → GitHub Pages 靜態站。

## Common Commands

```bash
npx quartz build --serve     # Dev server (http://localhost:8080)
npx quartz build             # Production build (→ ./public)
npm run check                # tsc --noEmit && prettier --check
npm run format               # prettier --write
npm run test                 # tsx --test
```

## Content Rules

### 撰寫規範

- 使用 Obsidian-flavored Markdown（wikilinks、callouts、embeds）
- Frontmatter 用 YAML（`gray-matter` 解析）
- **不要在 Markdown 內加 `# 標題`**（H1）— Quartz 從 frontmatter `title` 渲染頁面標題，手動加會重複
- Date priority：frontmatter → git → filesystem
- `ignorePatterns`：`["private", "templates", "Inbox", ".obsidian"]`

### Frontmatter 欄位

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | ✅ | 頁面標題（頁面頂部、breadcrumb、SEO） |
| `description` | ✅ | 文章摘要 |
| `tags` | ✅ | 標籤陣列，如 `[AI, Claude Code]` |
| `published` | ✅ | 發布日期 `YYYY-MM-DD` |
| `draft` | ✅ | `true` 則不建置輸出 |
| `status` | ✅ | 筆記成熟度：`fleeting` / `literature` / `evergreen` / `published` |
| `shortTitle` | 選填 | Explorer 側邊欄短標題。未設定時 fallback：有 ` — ` 取前半段，超過 20 字截斷加 `...` |

### 筆記成熟度

四階段：`fleeting` → `literature` → `evergreen` → `published`。
詳細晉升條件與 AI 處理規則見 `.claude/rules/content-maturity.md`。

### Vault 特殊資料夾

| 資料夾 | 用途 | Quartz 建置 |
|--------|------|-------------|
| `content/Inbox/` | 新筆記入口，零整理捕捉 | 排除 |
| `content/private/` | AI 生成內容（wiki、digests） | 排除 |
| `content/templates/` | Obsidian 筆記模板 | 排除 |

### AI 生成內容回存準則

- AI 生成的摘要、wiki、交叉連結分析 → 存入 `content/private/wiki/` 或 `content/private/digests/`
- **絕對不要**混入 `content/` 的分類資料夾（AI 協作、前端技術、開發思維等）
- 人工撰寫的文章才放在分類資料夾中
- 原因：避免 AI 內容汙染 Graph View、搜尋結果和 backlinks

### 圖表

Mermaid 與 Excalidraw 撰寫規範見 `.claude/rules/diagrams.md`。

## Architecture

| File | Purpose |
|------|---------|
| `quartz.config.ts` | Site metadata、plugin pipeline（transformers → filters → emitters）、theme |
| `quartz.layout.ts` | Page layout composition。Explorer 元件設有 `mapFn` 讀取 `shortTitle` 控制側邊欄顯示名稱 |

## Deployment

Push to `main` → GitHub Actions build → deploy to GitHub Pages。CI 用 `npm ci`（非 pnpm），Node 22。
