---
title: Nginx 靜態站 AKS 部署流程
description: 使用 Azure DevOps Pipeline、ArgoCD 和 AKS 部署 Nginx 靜態站的完整流程圖
tags: [Nginx, AKS, Azure DevOps, ArgoCD]
published: 2025-06-01
draft: false
---

```mermaid
flowchart LR

A[Local Project] -- git push --> R[Azure Repo]

R -- YAML --> P[Azure Pipeline]

P -- Image --> ACR((Azure Container Registry))

P -- PR update tag --> D["Deploy Repo<br/>(k8s manifests)"]

D -- Git poll --> ArgoCD

ArgoCD -- apply --> AKS[(AKS Cluster)]

AKS -- Metrics --> Prometheus
```