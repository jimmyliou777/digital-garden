---
title: 使用 Lit 開發 Web Components 並整合至 React 專案
description: 詳細介紹如何使用 Lit 庫開發 Web Components，並通過 Vite 打包後整合至 React 專案中
tags: [Lit, Web Components, React, 微前端]
published: 2025-06-01
draft: false
---

## 簡介

Web Components 是一套用於創建可重用 UI 元件的網頁標準，它可以跨框架使用，這意味著你可以在 React、Vue 或純 JavaScript 專案中使用相同的組件。本文將詳細介紹如何使用 Lit 庫開發 Web Components，並通過 Vite 打包後整合至 React 專案中。

## 技術棧

- **Lit**: 一個輕量級的 Web Components 庫
- **Vite**: 現代前端構建工具
- **React**: 用於整合示例
- **TypeScript**: 提供類型安全

## 開發步驟

### 1. 創建 Lit 元素

首先，我們需要創建一個基本的 Lit 元素：

```typescript
// src/my-element.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * 一個簡單的 Lit 元素
 *
 * @element my-element
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
    #root {
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      <div id="root"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
```

### 2. 整合 React 到 Web Component 內部

如果需要在 Web Component 內部使用 React 渲染內容：

```typescript
// src/my-element.ts 整合 React 版本
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

// 引入 React 組件
const LitApp = () => {
  return <div>這是一個在 Lit 內部的 React 組件</div>;
};

@customElement('my-element')
export class MyElement extends LitElement {
  private _root: Root | undefined;

  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
    #root {
      width: 100%;
      height: 100%;
    }
  `;

  firstUpdated() {
    this._renderReact();
  }

  private _renderReact() {
    this._root = createRoot(this.shadowRoot!.querySelector('#root')!);
    this._root.render(
      <LitApp />,
    );
  }

  render() {
    return html`
      <div id="root"></div>
    `;
  }
}
```

### 3. 創建入口文件

為了打包 Web Components，我們需要創建一個入口文件：

```typescript
// src/main-web-components.ts
// 這個文件是Web Components的打包入口點
import './my-element';

// 這裡我們可以添加更多的Web Components
// 例如：import './other-element'

export * from './my-element';
```

### 4. 配置 Vite 打包

接下來，配置 Vite 以打包為多種格式：

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // gzip壓縮
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // brotli壓縮 (更高效)
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    })
  ],
  build: {
    lib: {
      entry: './src/main-web-components.ts',
      name: 'MyWebComponents',
      formats: ['umd', 'iife'],
      fileName: (format) => `my-web-components.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2015'
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }
});
```

### 5. 設定 TypeScript 配置

為了支持裝飾器語法和類型聲明，配置 TypeScript：

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": false,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "emitDeclarationOnly": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,  
    "declarationDir": "dist/types",
    "esModuleInterop": true,
    "experimentalDecorators": true
  },
  "include": ["src"]
}
```

### 6. 配置 package.json

定義如何導出和使用這個庫：

```json
// package.json 相關配置
{
  "name": "my-web-components",
  "version": "1.0.0",
  "main": "./dist/my-web-components.umd.js",
  "module": "./dist/my-web-components.es.js",
  "types": "./dist/types/my-element.d.ts",
  "exports": {
    ".": {
      "import": "./dist/my-web-components.es.js",
      "require": "./dist/my-web-components.umd.js",
      "types": "./dist/types/my-element.d.ts"
    }
  },
  "files": [
    "dist"
  ]
}
```

## 在 React 中使用 Web Component

### 現代 React 專案中使用

在現代 React 專案中，可以使用 `@lit/react` 來創建 React 包裝器：

```typescript
// src/MyElementComponent.tsx
import React from 'react';
import {createComponent} from '@lit/react';
import {MyElement} from './my-element';

export const MyElementComponent = createComponent({
  tagName: 'my-element',
  elementClass: MyElement,
  react: React,
});

const Wrapper = () => {
  return (
    <div className="container">
      <MyElementComponent />
    </div>
  );
};

export default Wrapper;
```

### 在舊版 React (v14) 專案中使用

對於舊版 React，有兩種方法可以使用打包後的 Web Components：

1. **直接在 HTML 中引入**:

```html
<!-- 不使用 type="module" 以支持舊版瀏覽器 -->
<script src="path/to/my-web-components.iife.js"></script>
```

2. **在 Webpack 配置中引入**:

```javascript
// webpack.config.js 的相關配置
module.exports = {
  // ... 其他配置
  resolve: {
    alias: {
      'my-web-components': path.resolve(__dirname, 'path/to/my-web-components.iife.js'),
    },
  },
};
```

然後在 React 組件中使用：

```jsx
// 在舊版 React 組件中
import React from 'react';
// 僅引入副作用，不使用導出
import 'my-web-components';

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <my-element></my-element>
      </div>
    );
  }
}
```

## 打包時的常見問題

### 1. 裝飾器語法問題

在 TypeScript 中使用裝飾器需要特殊配置：

```json
// tsconfig.json 中
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

`useDefineForClassFields` 應設為 `false`，這樣裝飾器才能正確工作，特別是對於 Lit 的 property 裝飾器。

### 2. 處理環境變量

在瀏覽器中執行時，可能會遇到 `process is not defined` 錯誤，可以通過 Vite 的 `define` 選項解決：

```javascript
// vite.config.ts
export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }
});
```

### 3. 支持舊版瀏覽器

針對舊版瀏覽器，選擇合適的輸出格式和轉換設置：

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      formats: ['umd', 'iife'], // 選擇兼容性更好的格式
    },
    target: 'es2015' // 指定輸出的JS版本
  }
});
```

## 優化文件大小

為了減少打包後的文件大小，Vite 配置中已添加壓縮插件：

1. **gzip 壓縮**：生成 `.gz` 文件
2. **Brotli 壓縮**：生成 `.br` 文件，比 gzip 更高效

這些壓縮文件只有在服務器配置正確的 MIME 類型時才會被使用。

## 結論

使用 Lit 開發 Web Components 並整合到 React 專案是一種靈活且強大的方法，尤其適合需要跨框架共享組件的場景。通過合理配置 Vite 和 TypeScript，可以解決各種兼容性和打包問題，實現高效、可維護的前端開發。

無論是現代 React 應用還是舊版 React 專案，都可以通過這種方式共享和復用 UI 組件，實現真正的「寫一次，到處運行」。 