---
title: 在 React 19 中優雅地整合與隔離舊版 React 元件
description: 在 React 19 中優雅地整合與隔離舊版 React 元件
tags: [Lit, Web Components, React, 微前端]
published: 2025-06-11
draft: false
---

## 摘要

在前端專案的生命週期中，我們經常面臨一個棘手的挑戰：主應用程式的技術棧已升級至最新版本（如 React 19），但仍需依賴某些尚未升級、僅支援舊版（如 React 18）的第三方或內部元件庫。直接整合會導致版本衝突，而等待元件庫升級則可能延誤專案時程。

本文提出一個兼具**隔離性**、**相容性**與**效能**的架構方案。我們將在 React 19 專案中，利用 **Web Components** 技術動態建立一個「沙箱」環境，使其內部執行一個獨立的 React 18 執行環境，從而無縫渲染舊版元件。同時，我們將正面應對由此產生的**打包體積問題**，並透過**動態載入（Dynamic Loading）**策略將其對效能的衝擊降至最低。

目標讀者：前端架構師、資深前端工程師。

核心技術：React 19 & 18, Lit, Web Components, NPM Package Aliasing, React.lazy。

---

## 核心策略：以 Web Component 為隔離邊界

我們的核心策略是**避免直接依賴，建立隔離邊界**。我們不在 React 19 的程式碼中直接 `import` 任何 React 18 的元件，而是建立一個 Lit Web Component (`<lit-react18-wrapper>`) 作為中介層。

這個中介層的職責是：

1. **版本隔離**：其內部所有 React 相關操作，都明確指向一個獨立安裝的 React 18 版本。
2. **介面標準化**：對外（React 19 應用）暴露標準的 Web Component 介面（HTML Properties & DOM Events），隱藏所有內部實作細節。
3. **生命週期管理**：負責在自身內部掛載、更新和卸載 React 18 元件。

---

## 技術深入與實作

### Part 1: 建立版本隔離環境

傳統的 `npm install` 無法讓我們在同一個專案中並存兩個版本的 `react`。為此，我們必須使用 **NPM 套件別名（Package Aliasing）**。

1. 安裝依賴:
    
    在 React 19 專案根目錄下，執行以下指令，將 React 18 版本安裝並賦予別名。
    
    Bash
    
    ```
    # 將 react@18 安裝為 react-v18
    npm install react-v18@npm:react@18
    
    # 將 react-dom@18 安裝為 react-dom-v18
    npm install react-dom-v18@npm:react-dom@18
    ```
    
    `package.json` 將會包含主應用使用的 `react@19` 和我們指定的 `react-v18`。
    
2. 建立 Lit 封裝層:
    
    這是我們隔離策略的核心。建立一個 Lit 元件，並在其中明確地從別名套件引入 React 18。
    
    **`lit-react18-wrapper.js`**
    
    JavaScript
    
    ```javascript
    import { LitElement, html } from 'lit';
    
    // 關鍵：從別名套件中引入 React 18 實例
    import React_v18 from 'react-v18';
    import { createRoot } from 'react-dom-v18/client';
    
    // 假設這是需要被渲染的舊版元件
    const LegacyButton = ({ label, onClick }) => {
      // 這個 JSX 將由 React 18 runtime 處理
      return React_v18.createElement(
        'button',
        {
          onClick,
          style: {
            padding: '12px 20px',
            fontSize: '16px',
            backgroundColor: '#FF6347', // Tomato color
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          },
        },
        label
      );
    };
    
    export class LitReact18Wrapper extends LitElement {
      static properties = {
        label: { type: String },
      };
    
      constructor() {
        super();
        this._react18Root = null;
      }
    
      // 建立一個讓 React 18 掛載的容器
      render() {
        return html`<div id="react18-container"></div>`;
      }
    
      // 當 Lit 元件掛載後，初始化 React 18 環境
      firstUpdated() {
        const container = this.shadowRoot.querySelector('#react18-container');
        this._react18Root = createRoot(container);
        this._renderReact18Component();
      }
    
      // 當外部傳入的屬性改變時，更新內部的 React 18 元件
      updated() {
        this._renderReact18Component();
      }
    
      // 當 Lit 元件從 DOM 移除時，安全地卸載 React 18，防止記憶體洩漏
      disconnectedCallback() {
        super.disconnectedCallback();
        this._react18Root?.unmount();
      }
    
      // 將 React 的事件轉換為標準的 DOM CustomEvent
      _handleButtonClick = () => {
        this.dispatchEvent(new CustomEvent('onButtonClick', { bubbles: true, composed: true }));
      };
    
      _renderReact18Component() {
        if (!this._react18Root) return;
    
        // 使用 React.createElement 確保我們使用的是正確的 React 實例
        const component = React_v18.createElement(LegacyButton, {
          label: this.label,
          onClick: this._handleButtonClick,
        });
    
        this._react18Root.render(component);
      }
    }
    
    customElements.define('lit-react18-wrapper', LitReact18Wrapper);
    ```
    

---

## 打包體積困境與效能優化策略

上述方案完美地解決了版本相容性問題，但引入了新的挑戰：**打包體積**。我們的最終產出將包含兩套 React runtime，這對首頁載入效能是不可接受的。

**解決方案：按需載入（Code Splitting & Dynamic Import）**

我們的策略是將這個「昂貴」的 Web Component（及其整個 React 18 依賴樹）從主打包檔案中分離出去，只在使用者真正需要時才非同步載入。`React.lazy` 是實現此目標的標準工具。

1. 建立 Web Component 的載入器:
    
    為了配合 React.lazy，我們需要一個模組來觸發 Web Component 的註冊 (customElements.define)。
    
    **`lazy-loader.js`**
    
    JavaScript
    
    ```javascript
    // 此檔案的唯一作用就是執行一次 Web Component 的定義檔
    import './lit-react18-wrapper.js';
    ```
    
2. 建立一個可被延遲載入的 React 包裝器:
    
    我們使用 @lit-labs/react 的 createComponent 來為 Web Component 建立一個符合人體工學的 React 介面。
    
    **`WrappedReact18Button.jsx`**
    
    JavaScript
    
    ```
    import React from 'react';
    import { createComponent } from '@lit-labs/react';
    
    // 這個 React 是 v19
    const WrappedComponent = createComponent({
      react: React,
      tagName: 'lit-react18-wrapper',
      events: {
        onClick: 'onButtonClick',
      },
    });
    
    export default WrappedComponent;
    ```
    
3. 在主應用中動態載入:
    
    在主應用中，使用 React.lazy 和 <Suspense> 來消費這個元件。
    
    **`App.jsx` (React 19)**
    
    JavaScript
    
    ```javascript
    import React, { useState, Suspense } from 'react';
    
    // 透過 React.lazy 動態載入，打包工具會將其分離成獨立 chunk
    const LazyReact18Button = React.lazy(() => 
      // 1. 先執行 Web Component 的註冊
      import('./lazy-loader.js').then(() => 
        // 2. 再匯入 React 的包裝器元件
        import('./WrappedReact18Button.jsx')
      )
    );
    
    function App() {
      const [showLegacyComponent, setShowLegacyComponent] = useState(false);
    
      return (
        <div style={{ fontFamily: 'sans-serif', padding: '2em' }}>
          <h1>React 19 Host Application</h1>
          <button onClick={() => setShowLegacyComponent(true)}>
            Load Legacy React 18 Component
          </button>
    
          <div style={{ marginTop: '2em', padding: '1em', border: '1px dashed #ccc', minHeight: '100px' }}>
            {showLegacyComponent && (
              <Suspense fallback={<div>⌛️ Loading component with React 18...</div>}>
                <LazyReact18Button
                  label="I am a lazy-loaded v18 component"
                  onClick={() => alert('Event received by React 19!')}
                />
              </Suspense>
            )}
          </div>
        </div>
      );
    }
    ```
    

**優化結果**：

- **初始載入效能最大化**：使用者首次訪問頁面時，完全不會下載 React 18 或 Lit 相關的任何程式碼。
- **資源按需分配**：只有當 `showLegacyComponent` 狀態變為 `true` 時，瀏覽器才會發起新的網路請求，下載包含 React 18 的 `chunk.js` 檔案。
- **使用者體驗提升**：透過 `<Suspense>` 的 `fallback`，我們可以在資源載入期間提供流暢的載入狀態，避免頁面卡頓。

---

## 結論與架構建議

在面對前端專案中異構版本共存的挑戰時，單純地等待或魔改第三方庫都不是穩健的架構選擇。

本文提出的 **「NPM 別名 + Web Component 隔離層 + 動態載入」** 組合拳，提供了一個系統性的解決方案：

1. **NPM 別名** 從根本上解決了依賴版本衝突的問題。
2. **Web Component** 提供了一個堅不可摧的執行環境隔離邊界，確保了技術棧的純淨性。
3. **動態載入** 則完美地平衡了功能相容性與應用程式效能，確保我們不會因為兼容舊版而犧牲使用者體驗。

選擇一種具有**前瞻性**、**可維護性**和**高效能**的方案。此策略正是這種理念的體現，它允許團隊在不犧牲架構完整性的前提下，靈活地應對複雜的整合需求。