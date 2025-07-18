# 如何建立 Obsidian Excalidraw

## EXCALIDRAW 圖表生成 PROMPT

### 輸出要求

#### 1. 檔案格式  
嚴格按照下列結構輸出（不得修改任意字元）：

```markdown
---
excalidraw-plugin: parsed
tags: [excalidraw]
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==
You can decompress Drawing data with the command palette:
‘Decompress current Excalidraw file’.
For more info check in plugin settings under ‘Saving’

# Excalidraw Data

## Text Elements
%%
## Drawing
```json
[在這裡放入JSON資料]
```
%%
```

#### 2. JSON 內容要求

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.13.0",
  "elements": [...],
  "appState": { ... },
  "files": {}
}
```

- 所有文字元素使用 `fontFamily: 5`（excalifont 手寫字體）
- 文字中的 **雙引號** 一律替換為『』
- 文字中的 **圓括號** 一律替換為「」
- **禁用 fontWeight 屬性**：Excalidraw 不支援 `fontWeight`，會導致解析錯誤
- 確保 JSON 格式正確且包含所有 Excalidraw 必要欄位
- 所有元素必須包含完整的基礎屬性（見下方詳細說明）

### 3. 設計原則

- **層次清晰**：用顏色／形狀區分類別或層級  
- **版面合理**：元素間距適當，整體排版易讀  
- **顏色搭配**：採和諧配色或品牌色系  
- **圖形元素**：矩形、圓形、箭頭、連線依需求使用  
- **字級建議**：依重要性 16–28 px

---

## Excalidraw 圖表類型整理指南

> 選擇圖表類型前，請先明確「資訊結構」與「讀者需求」。

### 1. 流程圖（Flowchart）
- **使用情境**：步驟說明、工作流程、任務順序
- **作法**：以箭頭連接節點，強調流向
- **案例**：自動化流程、註冊流程、服務管線

### 2. 思維導圖（Mind Map）
- **使用情境**：概念發散、主題分類、靈感捕捉
- **作法**：中心主題向外放射分支
- **案例**：知識框架、提示詞分類、寫作大綱

### 3. 層級圖（Hierarchy Tree）
- **使用情境**：組織結構、內容分級、系統拆解
- **作法**：自上而下（或左→右）表示父子層級
- **案例**：企業架構、WBS、課程章節

### 4. 關係圖（Relationship Diagram）
- **使用情境**：要素之間的影響／依賴／互動
- **作法**：連線（必要時箭頭）呈現關係方向
- **案例**：資料流、模組協作、角色權限

### 5. 自由結構圖（Freeform Layout）
- **使用情境**：零散資訊、初步蒐集、腦力激盪
- **作法**：無固定結構，自由放置元素並以註解或箭頭補充
- **案例**：讀書筆記、文章摘要、創意草稿

### 6. 對比圖（Comparison Diagram）
- **使用情境**：多方案比較、差異說明、決策輔助
- **作法**：左右分欄、上下對照或表格化
- **案例**：工具比較、功能差異、課程方案

### 7. 時間線圖（Timeline）
- **使用情境**：事件發展、專案進度、技術演化
- **作法**：以時間軸排列節點，標註日期／階段
- **案例**：AI 歷程、專案里程碑、版本發佈

### 8. 矩陣圖（Matrix Map）
- **使用情境**：雙維度分類、優先級排序、定位分析
- **作法**：建立 X/Y 座標平面後置放項目
- **案例**：緊急／重要四象限、產品定位、內容價值圖

### 9. 情境腳本圖（Scenario Script）
- **使用情境**：角色行動與系統回應、使用者旅程
- **作法**：以「角色 → 操作 → 系統 / AI 回應」順序呈現
- **案例**：AI 工具互動腳本、客服情境、流程模擬

### 10. 圖文混排筆記（Visual Notes）
- **使用情境**：教學說明、重點整理、概念圖解
- **作法**：結合插圖、箭頭、文字標註，強化記憶
- **案例**：技術概要、課程重點、設計原則圖解

---

## 其他要求與細節

### A. Text Elements 區段
- 在範本中 `## Text Elements` 留空，並以 `%%` 包裹
- 插件會依 JSON 自動渲染文字，通常不需手動列出

### B. 技術細節
- `elements`：所有圖形／文字／連線元素
- 每個元素需唯一 `id`
- 座標原點位於畫布左上角 `(0,0)`
- 建議畫布視域：寬 1200、高 800 起跳（依需求調整）
- `appState`：畫布縮放、目前工具、背景設定
- 必須含 `files: {}` 欄位（即使空物件）

### C. 元素屬性示例

#### 文字元素（完整格式）
```json
{
  "id": "unique-id",
  "type": "text",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 50,
  "fontSize": 20,
  "fontFamily": 5,
  "text": "顯示文字",
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "hachure",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "roundness": null,
  "seed": 123456789,
  "version": 1,
  "versionNonce": 123456789,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1,
  "link": null,
  "locked": false,
  "textAlign": "left",
  "verticalAlign": "middle",
  "containerId": null,
  "originalText": "顯示文字",
  "lineHeight": 1.25
}
```

#### 矩形元素（完整格式）
```json
{
  "id": "rect-id",
  "type": "rectangle",
  "x": 100,
  "y": 100,
  "width": 160,
  "height": 60,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#d3f9d8",
  "fillStyle": "hachure",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "roundness": {
    "type": 3
  },
  "seed": 111,
  "version": 1,
  "versionNonce": 111,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1,
  "link": null,
  "locked": false
}
```

---

## 實作流程建議

1. **定義圖表目的**：流程、架構、比較？  
2. **草擬節點**：逐條列出要呈現的資訊點  
3. **選擇圖表類型**（見前節）  
4. **草圖排版**：先簡畫框與連線  
5. **生成 JSON**：可由 AI 依節點輸出 Excalidraw 結構  
6. **貼入範本 Markdown** → 儲存 → 切換到 Excalidraw View 查看  
7. **調整樣式**：字體、顏色、對齊  
8. **二次導出**（PNG / SVG / PDF）或內嵌於筆記

---

## 常見錯誤排查

| 問題 | 可能原因 | 解法 |
|------|----------|------|
| 打不開圖 | Frontmatter 格式錯誤 | 檢查 `excalidraw-plugin: parsed` |
| 無元素 | JSON 空陣列或語法錯誤 | 驗證 JSON（線上 validator） |
| 亂碼字體 | `fontFamily` 未設 5 | 全域搜尋替換 |
| 文字顯示雙引號 | 未替換為『』 | 批次替換後重載 |
| originalText is not iterable | 使用了 `fontWeight` 或缺少必要屬性 | 移除 `fontWeight`，補齊完整屬性 |
| 元素顯示異常 | 缺少基礎屬性 | 參考完整元素格式範例 |

---

## 快速複製用 PROMPT（給 AI 生成 Excalidraw）

> 將下列提示貼給 AI，並附上你的節點內容，AI 會回傳可直接貼入 Obsidian 的 Excalidraw Markdown。

```markdown
請依下列規範輸出 **完整可用的 Obsidian Excalidraw Markdown** 檔案：
- 使用本文檔案格式範本（含 Frontmatter、Text Elements、Drawing JSON）
- JSON 中所有文字使用 fontFamily: 5
- 雙引號改為『』，圓括號改為「」
- **禁止使用 fontWeight 屬性**（會導致解析錯誤）
- 所有元素必須包含完整的基礎屬性（參考範例格式）
- 元素依我提供的節點建立圖表
【節點資料】:
```

---

## 範例：簡易流程圖 JSON 片段（示意）

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "local",
  "elements": [
    {
      "id": "node-start",
      "type": "rectangle",
      "x": 100,
      "y": 100,
      "width": 160,
      "height": 60,
      "backgroundColor": "#d3f9d8",
      "strokeColor": "#1e1e1e",
      "seed": 111,
      "version": 1
    },
    {
      "id": "text-start",
      "type": "text",
      "x": 120,
      "y": 118,
      "width": 120,
      "height": 24,
      "fontSize": 20,
      "fontFamily": 5,
      "text": "開始流程",
      "strokeColor": "#1e1e1e",
      "backgroundColor": "transparent",
      "seed": 112,
      "version": 1
    }
  ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "zoom": { "value": 1 }
  },
  "files": {}
}
```
