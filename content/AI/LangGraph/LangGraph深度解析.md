---
title: LangGraph 深度解析
description: LangGraph vs. LangChain：深度解析與運作原理
tags: [LangGraph, AI, 技術入門]
published: 2025-07-08
draft: false
---

# LangGraph vs. LangChain：深度解析與運作原理

本文檔旨在全面解析 LangChain 與其擴展函式庫 LangGraph 的核心差異，並深入探討 LangGraph 的技術架構，以及其背後 AI 代理（Agent）的決策機制。

---

## 第一部分：LangGraph vs. LangChain 的核心差異

兩者最根本的差異在於其運作流程的結構：LangChain 採用線性的「鏈式」結構，而 LangGraph 則採用更靈活、可循環的「圖形」結構。

* **LangChain (鏈)**：其核心是「鏈」（Chain），本質為一個有向無環圖（DAG）。它將各個組件（LLM、工具等）串聯起來，形成一個單向的執行流程，非常適合目標明確、流程固定的任務。

* **LangGraph (圖)**：它將工作流程建構成一個由「節點」（Nodes）和「邊」（Edges）組成的圖。這種結構允許流程包含**循環**和**條件分支**，這對於建構需要多輪思考、自我修正的複雜代理至關重要。

### 關鍵差異對比表

| 特性 | LangChain | LangGraph |
| :--- | :--- | :--- |
| **核心結構** | **有向無環圖 (DAG)**，線性的「鏈」 | **可循環圖 (Cyclic Graph)**，由節點和邊構成的動態圖譜 |
| **流程控制** | **單向、循序**，難以實現循環和複雜的分支 | **多向、可循環**，透過條件式邊實現複雜的邏輯判斷與流程控制 |
| **狀態管理** | **隱性、線性傳遞**，主要透過記憶體（Memory）元件在鏈中傳遞 | **顯性、中心化**，擁有一個明確的「狀態」（State）物件，圖中任何節點都可以讀取和更新 |
| **代理 (Agent) 實作** | 提供高階抽象，但對於複雜代理的客製化程度較低 | **專為複雜代理而生**，可以精細地控制代理的每一步決策，更適合「思考-行動」循環的場景 |
| **可控性與除錯** | 較為抽象，有時難以窺見內部運作細節 | **透明度高**，開發者能清晰地定義和追蹤每一個節點的執行和狀態的變化 |
| **適用場景** | 流程固定的應用（如串聯式問答、文本摘要） | 需要複雜邏輯、循環和狀態管理的應用（如多工具協作代理、人機協作流程） |

### 我該如何選擇？

* **選擇 LangChain**：如果您的應用是**流程相對固定、從頭到尾一氣呵成**的任務。

* **選擇 LangGraph**：如果您的應用需要**動態決策、多步驟推理、且可能需要反覆嘗試或修正**，特別是在建構複雜代理（Agentic）系統時。

---

## 第二部分：LangGraph 技術架構與原理

我們透過一個「會自己上網查資料的 AI 助理」範例，來拆解 LangGraph 的技術架構。其核心由四大原理構成：

1.  **狀態 (State)**：一個中心化的 Python 字典 (`TypedDict`)，作為整個工作流程的「記憶體」。它在節點之間傳遞，每個節點都可以讀取或修改它，實現了持久化和共享的上下文。

2.  **節點 (Nodes) & 工具 (Tools)**：圖中的基本執行單元。節點可以是一個函式（如呼叫 LLM 的 `call_model` 節點），也可以是一個預先建置好的類別（如執行工具的 `ToolNode`）。工具則是代理可以使用的外部能力（如網路搜尋）。

3.  **邊 (Edges) & 條件式路由**：連接節點的線，定義了執行的流程。LangGraph 的精髓在於「條件式邊」，它是一個函式，可以根據當前「狀態」的內容，動態地決定下一步該走向哪個節點，這是實現「動態決策」的關鍵。

4.  **組裝圖 (Graph)**：最後，透過 `StateGraph` 物件，將定義好的狀態、節點和邊組裝成一個完整的、可執行的應用程式。這個過程包括設定入口點、新增節點、以及定義普通邊和條件式邊，從而清晰地建構出「思考 -> 行動 -> 觀察 -> 再次思考」的循環邏輯。

### 程式碼範例

```python
import operator
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

# 1. 定義狀態 (State)
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]

# 2. 定義工具 (Tools) 和模型
search_tool = DuckDuckGoSearchRun()
tools = [search_tool]
tool_node = ToolNode(tools)
model = ChatOpenAI(temperature=0, model="gpt-4o").bind_tools(tools)

# 代理節點 (思考者)
def call_model(state: AgentState):
    response = model.invoke(state['messages'])
    return {"messages": [response]}

# 3. 定義條件式邊 (Edge)
def should_continue(state: AgentState) -> str:
    if state['messages'][-1].tool_calls:
        return "action"  # 走向工具節點
    else:
        return END       # 結束流程

# 4. 組裝圖 (Graph)
workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("action", tool_node)
workflow.set_entry_point("agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {"action": "action", END: END},
)
workflow.add_edge("action", "agent") # 形成循環
app = workflow.compile()

# 執行
inputs = {"messages": [HumanMessage(content="LangGraph 和 LangChain 的作者是同一個人嗎？")]}
for output in app.stream(inputs):
    for key, value in output.items():
        print(f"節點 '{key}' 的輸出: {value}")
```

---

## 第三部分：AI 如何決定調用工具？

AI 的決策並非來自於圖（Graph）本身，而是**在圖的某個「節點」內部，由大型語言模型（LLM）的內在能力所驅動的**。圖的角色是**根據 AI 做出的決策，來指揮下一步的流程**。

### 階段一：模型內部的決策 (Tool Calling)

這一切的核心是一種被稱為 **"Tool Calling"** 或 **"Function Calling"** 的技術。

1.  **建立「合約」**：當我們執行 `.bind_tools(tools)` 時，LangChain 會將 Python 工具轉換成一份詳細的 JSON Schema 格式的「工具說明書」，並連同使用者的問題一起傳送給 LLM。這份說明書詳細描述了每個工具的名稱、功能（`description`）和所需參數。

2.  **進行「思考」**：LLM 在接收到請求後，會分析使用者意圖，並與它收到的所有工具的 `description` 進行比對。如果發現某個工具的功能與解決當前問題高度相關，它就會判斷「應該使用這個工具」。

3.  **生成「指令」**：做出決策後，LLM 不會生成普通的文字回答，而是會生成一個**特定格式的、包含 `tool_calls` 屬性的 `AIMessage` 物件**。這個物件就是一個結構化的「行動指令」，明確指出了要呼叫哪個工具，以及傳遞什麼參數。

    以下是 `agent` 節點可能產出的 `AIMessage` 物件的示意結構：

    ```python
    # 這是在 call_model 函式中，由 model.invoke() 回傳的物件
    from langchain_core.messages import AIMessage

    # 假設這是模型回傳的 response
    response = AIMessage(
      content="",  # 當呼叫工具時，這裡通常是空的
      tool_calls=[
        {
          'name': 'duckduckgo_search',
          'args': {
            'query': 'LangGraph LangChain author'  # 模型自己決定了最適合的搜尋關鍵字
          },
          'id': 'call_abc123...' # 一個唯一的呼叫 ID
        }
      ]
    )
    ```

### 階段二：LangGraph 的流程控制

現在，AI 已經做出了決策（即生成了上面的 `AIMessage`）。接下來就輪到 LangGraph 登場，它的角色像一個交通警察。

1.  **檢查決策**：在 `agent` 節點執行完畢後，流程走到我們的**條件式邊** `should_continue` 函式。

2.  **指揮交通**：這個函式的作用非常單純：它只是**檢查** `agent` 節點產出的最新訊息中，**是否存在 `tool_calls` 屬性**。

    ```python
    # 這是我們的條件式邊 (Edge) 函式
    def should_continue(state: AgentState) -> str:
        # 取得狀態中最新的那條訊息
        last_message = state['messages'][-1]

        # 檢查這條訊息是否有 .tool_calls 屬性且不為空
        if last_message.tool_calls:
            # 如果存在，代表 AI 決定使用工具，函式便回傳 "action"
            # LangGraph 根據這個回傳值，將流程導向名為 "action" 的工具節點
            return "action"
        else:
            # 如果不存在，代表 AI 認為可以直接回答，函式便回傳 END
            # LangGraph 隨即結束整個流程
            return END
    ```

總結來說，這是一個權責分明的優雅協作：

* **LLM (在節點內) 負責思考**：決定**做什麼 (What)** — 是直接回答還是呼叫工具。

* **LangGraph (邊與圖) 負責控制**：根據 LLM 的決策，決定流程**去哪裡 (Where)**。

這種將「思考決策」與「流程控制」清晰分離的架構，正是 LangGraph 能夠建構出複雜、可靠且易於除錯的 AI 代理的關鍵所在。
