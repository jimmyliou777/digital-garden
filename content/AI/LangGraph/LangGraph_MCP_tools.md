---
title: MCP工具與LangGraph整合指南
description: 詳細介紹如何在LangGraph框架中整合Model Context Protocol工具，擴展AI代理的能力
tags: [LangGraph, MCP, 技術指南]
published: 2025-06-01
draft: false
---

# MCP工具與LangGraph整合指南

## 1. 簡介

Model Context Protocol (MCP) 是一種標準化協議，允許AI模型與外部工具進行交互。在LangGraph框架中整合MCP工具，可以顯著擴展AI代理的能力，使其能夠執行更多特定任務，如數學計算、排班管理等操作。

## 2. MCP工具服務器配置

### 2.1 基本MCP服務器

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 創建MCP服務器
const server = new McpServer({
  name: "MathTools",
  version: "1.0.0"
});

// 添加工具：以加法運算為例
server.tool("add",
  { a: z.number(), b: z.number() },  // 注意這裡是原始物件結構，不是z.object()
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// 啟動服務器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch(console.error);
```

### 2.2 注意事項

- 在定義工具參數時，使用原始物件結構 `{ a: z.number(), b: z.number() }`
- 不要使用 `z.object({ a: z.number(), b: z.number() })`，這會導致類型錯誤
- MCP服務器會在內部自動將參數結構轉換為zod schema

## 3. LangGraph客戶端整合

### 3.1 依賴安裝

```bash
pnpm add @langchain/mcp-adapters @n8n/json-schema-to-zod zod
```

### 3.2 在tools.ts中整合MCP工具

```typescript
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { JsonSchema, jsonSchemaToZod } from "@n8n/json-schema-to-zod";
import { z } from "zod";
import { Tool } from "@langchain/core/tools";

// 配置標準工具
const searchTavily = new TavilySearchResults({
  maxResults: 3,
});

// 配置MCP客戶端
const mcpClient = new MultiServerMCPClient({
  prefixToolNameWithServerName: false,
  mcpServers: {
    math: { // 此鍵名為服務名稱
      transport: "stdio",
      command: "node",
      args: ["/path/to/your/mcp-server.js"], // MCP服務器腳本路徑
    },
  },
});

// 初始化MCP連接並載入工具
const tools = await mcpClient.getTools();

// Schema轉換處理（關鍵步驟）
for (const tool of tools) {
  if (tool.schema && typeof tool.schema === 'object' && 'type' in tool.schema) {
    try {
      // 將JSON Schema轉換為Zod Schema
      tool.schema = jsonSchemaToZod(tool.schema as unknown as JsonSchema);
    } catch (error) {
      console.warn(`無法轉換工具 ${tool.name} 的schema:`, error);
      // 轉換失敗時使用空對象Schema
      tool.schema = z.object({}).describe(tool.description || '');
    }
  }
}

// 導出所有工具
export const TOOLS = [searchTavily, ...tools] as Tool[];
```

## 4. Schema轉換問題解釋

### 4.1 為什麼需要轉換Schema？

即使在MCP服務器端使用zod定義schema，在客戶端收到的仍然是JSON Schema格式。這是因為：

1. **序列化需求**：網絡傳輸無法直接傳遞zod對象（包含函數和方法）
2. **協議標準**：MCP協議在傳輸時會將zod schema自動轉換為JSON Schema格式
3. **傳輸流程**：
   ```
   MCP服務器(zod schema) → 序列化 → 網絡傳輸 → 客戶端解析 → JSON Schema格式
   ```

### 4.2 常見錯誤

1. **類型錯誤**：嘗試直接使用客戶端接收到的schema會出現類型不匹配錯誤
2. **undefined錯誤**：未正確轉換的schema可能導致`typeName`未定義錯誤
3. **工具調用失敗**：未轉換schema的工具可能在LangChain/OpenAI function call時失敗

### 4.3 轉換解決方案

- 使用`@n8n/json-schema-to-zod`而非`json-schema-to-zod`（API不同）
- 為每個工具的schema進行顯式轉換
- 添加適當的類型斷言：`as unknown as JsonSchema`
- 提供錯誤處理，確保即使轉換失敗也能提供基本功能

## 5. 最佳實踐

### 5.1 MCP服務器端

- **參數驗證**：使用zod的完整驗證能力確保輸入參數正確
- **錯誤處理**：為工具添加適當的錯誤處理邏輯
- **描述清晰**：提供詳細的工具描述，幫助AI代理理解工具用途

```javascript
server.tool("calculate_salary",
  { 
    hours: z.number().min(0).max(744).describe("工作小時數"),
    rate: z.number().min(0).describe("每小時薪資率")
  },
  async ({ hours, rate }) => {
    try {
      const salary = hours * rate;
      return {
        content: [{ type: "text", text: `計算結果: $${salary.toFixed(2)}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `計算錯誤: ${error.message}` }],
        isError: true
      };
    }
  }
);
```

### 5.2 LangGraph客戶端

- **懶加載**：考慮按需初始化MCP客戶端，避免啟動時延遲
- **工具過濾**：只導出必要的工具，避免工具列表過長
- **監控日誌**：添加適當日誌，記錄工具使用情況和可能的錯誤
- **優雅降級**：當工具無法使用時，提供替代方案

```typescript
// 按需初始化MCP工具
let mcpTools = [];
async function initMcpTools() {
  if (mcpTools.length === 0) {
    const mcpClient = new MultiServerMCPClient({...});
    const tools = await mcpClient.getTools();
    // 轉換schema...
    mcpTools = tools;
  }
  return mcpTools;
}

// 導出工具函數
export async function getTools() {
  const mcpTools = await initMcpTools();
  return [searchTavily, ...mcpTools] as Tool[];
}
```

## 6. 示例應用

### 6.1 月度排班系統

透過傳遞當前月份參數，配合MCP工具實現智能排班：

```javascript
// MCP服務器端定義排班工具
server.tool("generate_schedule",
  { 
    month: z.number().min(1).max(12),
    staff: z.array(z.string()),
    workingDays: z.number().optional()
  },
  async ({ month, staff, workingDays = 22 }) => {
    // 排班邏輯...
    return { content: [{ type: "text", text: "排班結果..." }] };
  }
);

// 前端傳遞月份參數
stream.submit(
  { messages: [systemMessage] },
  {
    streamMode: ["values"],
    optimisticValues: (prev) => ({
      ...prev,
      messages: [...(prev.messages ?? [])]
    }),
    config: {
      configurable: {
        current_month: getCurrentMonth()
      }
    }
  },
);
```

## 7. 常見問題排解

| 問題 | 解決方案 |
|------|----------|
| 服務器啟動失敗 | 檢查路徑、權限和Node版本 |
| Schema轉換錯誤 | 確保使用`@n8n/json-schema-to-zod`，不是`json-schema-to-zod` |
| 工具不顯示在工具列表 | 檢查MCP服務器是否正確啟動，確認工具名稱 |
| 工具調用超時 | 檢查MCP服務器的運行狀態，可能需要增加超時設置 |
| 參數類型錯誤 | 確保前端傳遞的參數符合工具定義的類型 |

## 8. 參考資源

- [LangGraph文檔](https://langchain-ai.github.io/langgraphjs/)
- [MCP協議規範](https://github.com/modelpoolprotocol/mcp)
- [Zod文檔](https://github.com/colinhacks/zod)
- [@n8n/json-schema-to-zod](https://github.com/n8n-io/json-schema-to-zod)

---

文檔版本: 1.0.0  
更新日期: 2024-08-01
