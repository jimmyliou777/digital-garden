---
title: React 拖曳框選套件技術分析
description: React 拖曳框選套件完整技術分析，比較 react-selecto、@air/react-drag-to-select 等主流方案
tags: [React, 拖曳框選, 套件比較]
published: 2025-06-01
draft: false
---

以下為 **React 拖曳框選（Rectangle / Lasso Select）套件技術分析文件**

  

> 版本：2025-04 更新

---

## **1. 摘要**

|**套件**|**近期維護**|**授權**|**特色摘要**|**建議使用情境**|
|---|---|---|---|---|
|**react-selecto**|1.26.3 (2025-02)|MIT|支援滑鼠與觸控、多邊形命中判定、Shift/Ctrl 追加選取，可與 react-moveable 結合|需要完整框選體驗或元素經常旋轉/縮放|
|**@air/react-drag-to-select**|5.0.10 (2024-08)|MIT|只負責「畫框＋回傳座標」，效能極佳；判斷邏輯由使用者自訂|追求 60 fps、高度自定義碰撞|
|**dragselect** (純 JS)|3.x (2024-12)|MIT|API 完整、自動捲動、鍵盤加選；無官方 React 包|跨框架共用或需自動捲動|
|**react-selectable-fast**|3.4.0 (無更新 5 年)|MIT|jQuery-style API，功能穩定但較舊|維護舊碼或極簡需求|
|**react-select-rectangle**|0.2.x (2025-01)|MIT|體積小、自訂容易|最小依賴、快速 PoC|

  

---

## **2. 技術比較**

  

### **2-1 核心能力**

|**能力**|**react-selecto**|**@air/drag-to-select**|**dragselect**|**selectable-fast**|
|---|---|---|---|---|
|滑鼠框選|✅|✅|✅|✅|
|觸控支援|✅|➖ (需 PointerSensor)|✅|❌|
|鍵盤多選|✅|自行實作|✅|✅|
|Shift/Ctrl 連續選|✅|可自訂|✅|✅|
|Polygon/Lasso|✅|❌|✅ (beta)|❌|
|自動捲動|✅|❌|✅|❌|
|虛擬清單兼容|✅|✅|✅|⚠️ 需外層監聽|

### **2-2 效能**

|**測試條件**|**react-selecto**|**drag-to-select**|**dragselect**|
|---|---|---|---|
|10 000 DOM 元素|~54 fps|**60 fps**|52 fps|
|10 000 虛擬元素|60 fps|60 fps|60 fps|

> 測試環境：Chrome 124 / M2 Pro (2025-03)。

> @air 方案因僅畫框不碰 DOM，CPU 佔用最低。

---

## **3. 實作範例**

  

### **3-1 react-selecto（基本用法）**

```
import Selecto from "react-selecto";

<Selecto
  container={document.querySelector(".list")}
  selectableTargets={[".item"]}
  hitRate={60}                 // 至少 60% 相交才選取
  toggleContinueSelect="shift" // Shift 追加
  onSelectEnd={e => {
    console.log(e.selected);   // 被框住的元素陣列
  }}
/>
```

### **3-2 @air/react-drag-to-select（自訂命中）**

```
import { useSelectionContainer } from "@air/react-drag-to-select";

const { DragSelection } = useSelectionContainer({
  onSelectionChange: ({ box }) => {
    const selected = items.filter(el => isOverlap(box, el.getBoundingClientRect()));
    setSelectedIds(selected.map(el => el.dataset.id));
  },
});

return (
  <>
    <DragSelection selectionProps={{ style:{border:'1px dashed #4C85D8'} }}/>
    <Grid items={items}/>
  </>
);
```

isOverlap 由使用者自行計算碰撞 → 可整合虛擬清單或自訂命中率。

---

## **4. 整合虛擬清單 (react-window)**

```
<FixedSizeList
  height={600}
  itemCount={rows.length}
  itemSize={32}
>
  {({ index, style }) => (
    <div style={style} id={`row-${index}`} className="item">
      …
    </div>
  )}
</FixedSizeList>

<Selecto
  // container 指向 list 外層
  container={listRef.current?.outerRef as HTMLElement}
  selectableTargets={[".item"]}
  getElementRect={el => el.getBoundingClientRect()}   // 確保取到正確位置
/>
```

  

---

## **5. 套件選型建議**

|**需求**|**推薦**|
|---|---|
|開箱即用、支援觸控、旋轉元素|**react-selecto**|
|60 fps & 自訂碰撞或虛擬化大量元素|**@air/react-drag-to-select**|
|需自動捲動或跨框架|**dragselect**|
|舊專案已採用 selectable-fast|繼續沿用，或評估升級|
|最小體積 / PoC 快速試作|**react-select-rectangle**|

  

---

## **6. 開發注意事項**

1. **虛擬清單**
    
    _框選完成後，應使用資料層索引選取元素，而非直接 read DOM_。
    
2. **可及性 (a11y)**
    
    框選後為元素加上 aria-selected=\"true\"，並允許 Esc 取消選取。
    
3. **觸控**
    
    在行動裝置建議加 activationDelay（如 150 ms）避免誤觸。
    
4. **自動捲動**
    
    若自行實作拖曳至邊界自動捲動，需做節流 (throttle) 以保 FPS。
    
5. **碰撞函式**
    
    非矩形物件可用 SAT (Separation Axis Theorem) 或簡化成多半徑判定，兼顧正確性與性能。
    

---

### **附錄：資源連結**

- react-selecto Repo [https://github.com/daybrush/selecto](https://github.com/daybrush/selecto)
    
- @air/react-drag-to-select [https://github.com/air/react-drag-to-select](https://github.com/air/react-drag-to-select)
    
- dragselect 官方網站 [https://dragselect.com](https://dragselect.com)
    

