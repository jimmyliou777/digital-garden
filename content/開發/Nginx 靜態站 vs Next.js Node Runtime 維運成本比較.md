---
title: Nginx 靜態站 vs Next.js Node Runtime 維運成本比較
description: 詳細比較 Nginx 靜態站和 Next.js Node Runtime 在映像大小、記憶體、CPU、監控等維運成本差異
tags: [Nginx, Next.js, 維運成本, K8s]
published: 2025-06-01
draft: false
---

| 面向 | Nginx 靜態站（純 CSR SPA） | Next.js Node/Edge Runtime | 成本影響 |
| --- | --- | --- | --- |
| **映像大小** | `nginx:alpine` ≈ 9 MB | `node:20-alpine` + Next build ≈ 200 MB↑ | 映像快取與傳輸時間大幅增加 |
| **Idle 記憶體 / CPU** | 10–20 Mi / 幾 mCPU | 80–200 Mi / 50–100 mCPU | Pod request/limit 至少放大 4-10 倍 |
| **單 Pod 併發能力** | I/O-bound，可承載數百~千並發 | JS 執行-bound，並發較低 → 需更多副本 | HPA 觸發頻率 ↑ |
| **啟動時間** | < 0.5 s | 3–6 s（cold start） | 滾動更新時間 & 可用性風險 ↑ |
| **安全 / 修補** | 軟體鏈精簡，CVE 量低 | npm 依賴多，CVE 更新頻繁 | Patch 工時與風險 ↑ |
| **監控** | `stub_status` + exporter 指標簡單 | 需額外收集 GC、V8、SSE/WS 指標 | 指標數與 Alert 規則 ↑ |
| **CI/CD 耗時** | 拷貝檔案 ➜ build 完成 | `pnpm install` + `next build` 15 s–數分鐘 | Pipeline 時長 & Runner 費用 ↑ |
| **縱向資源 / 雲端費** | 極低 | 4-10× | 雲端帳單 ↑ |

---

## HPA（Horizontal Pod Autoscaler）備忘

> **HPA** 透過 CPU / Memory 或自訂指標自動增減 Deployment Pod 數量。  
> *Next.js Pod* idle 資源高、單 Pod 併發低，尖峰時更易超出門檻而擴充，進一步推高成本；*Nginx 靜態站* 幾乎不會觸發。

---

## 決策建議

* **無 SEO／SSR 需求** ➜ 保持 **Nginx 靜態**，資源最省。  
* **想要 Next.js DX、仍走靜態** ➜ `next export` 或改用 **Vite + React Router**。  
* **確定需要 SSR／Edge 個人化** ➜ 再升級 **Next.js Node/Edge Runtime**，但預留 4-10× 資源與更複雜監控。