---
title:  MCP (interactive-feedback-mcp) 增強您的 AI 輔助開發流程
description: 透過互動式回饋 MCP (interactive-feedback-mcp) 增強您的 AI 輔助開發流程
tags: [Cursor, MCP, 技術指南]
published: 2025-06-25
draft: false
---
# 透過互動式回饋 MCP (interactive-feedback-mcp) 增強您的 AI 輔助開發流程

在現今的軟體開發領域，AI 輔助工具（如 Cursor）已成為許多開發者不可或缺的夥伴。然而，AI 的自主性有時也可能導致一連串不必要的工具呼叫，浪費了寶貴的時間與資源。為了解決這個問題，開發者 Fábio Ferreira (@fabiomlferreira) 建立了一個名為 **interactive-feedback-mcp** 的開源專案，旨在將「人類在環」(human-in-the-loop) 的概念導入 AI 輔助開發流程中。

這篇文章將帶您深入了解這個專案，探索它的核心功能，並指導您如何將它整合到自己的開發環境中。

## 什麼是 interactive-feedback-mcp？

**interactive-feedback-mcp** 是一個巧妙的工具，它讓開發者能夠在 AI 執行指令的過程中，即時查看輸出並提供回饋。想像一下，當您要求 AI 協助完成一項任務時，它不再是埋頭苦幹，而是在關鍵步驟停下來，向您展示目前的進度，並徵詢您的下一步意見。

這種互動模式不僅提升了開發的透明度，更重要的是，它能有效引導 AI 的行為，避免其進行不必要的猜測和嘗試。根據專案說明，在某些情況下，這個工具甚至能將原本多達 25 次的工具呼叫，整合成一個具備使用者回饋的請求，大幅提升了效率。

## 核心功能

* **人類在環的工作流程**：將開發者拉回決策圈，讓 AI 的每一步行動都更貼近您的真實需求。
* **廣泛的相容性**：除了廣受歡迎的 Cursor，此工具也支援 Cline 和 Windsurf 等開發環境。
* **節省資源**：透過減少不必要的工具呼叫，有效降低運算資源的消耗。
* **專案級別的配置**：伺服器會使用 Qt 的 `QSettings` 為每個專案儲存獨立的配置，包含要運行的指令、是否自動執行、UI 偏好設定等。

## 如何開始使用？

想要親身體驗 **interactive-feedback-mcp** 的強大功能嗎？請遵循以下步驟進行安裝與設定。

### 安裝需求

* Python 3.11 或更新版本
* `uv` 套件管理器

### 安裝步驟

1.  **複製儲存庫**：
    ```bash
    git clone [https://github.com/noopstudios/interactive-feedback-mcp.git](https://github.com/noopstudios/interactive-feedback-mcp.git)
    ```

2.  **進入專案目錄**：
    ```bash
    cd interactive-feedback-mcp
    ```

3.  **安裝相依套件**：
    ```bash
    uv sync
    ```

4.  **啟動伺服器**：
    ```bash
    uv run server.py
    ```

### 在 Cursor 中設定

啟動伺服器後，您需要在 Cursor 中將其指向正在運行的伺服器。具體的設定方式，請參考 Cursor 的官方文件。
```json
 "interactive-feedback-mcp": {
      "command": "uv",
      "args": [
        "--directory",
        "/Users/jimmyliou/Documents/my-projects/MCP_tools/interactive-feedback-mcp",
        "run",
        "server.py"
      ],
      "timeout": 600,
      "autoApprove": ["interactive_feedback"]
    }
```
### 開發模式

如果您是開發者，想要進一步客製化或了解其運作原理，可以透過以下指令啟動具備 Web 界面的開發模式：

```bash
uv run fastmcp dev server.py
```

## 結論

**interactive-feedback-mcp** 為 AI 輔助開發帶來了一種更聰明、更有效率的互動模式。它不僅解決了 AI 工具盲目執行任務的痛點，透過與使用者調用MCP透過即時上下文對話修正當前需求。

---

- **專案連結**: [https://github.com/noopstudios/interactive-feedback-mcp](https://github.com/noopstudios/interactive-feedback-mcp)