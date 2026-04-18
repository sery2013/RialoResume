# RialoResume — Reactive Resume on Rialo

> **Auto-updating on-chain portfolio powered by Rialo's native HTTP calls & reactive transactions.**

![Status](https://img.shields.io/badge/Status-MVP_Ready-8B5CF6)
![Rialo](https://img.shields.io/badge/Ecosystem-Rialo-000000?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDAwIi8+PHRleHQgeD0iOCIgeT0iMTIiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlI8L3RleHQ+PC9zdmc+)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000)

## 🚀 What is LiveFolio?
LiveFolio is a **reactive blockchain resume** that automatically pulls verified data from GitHub, Twitter, and LinkedIn directly into a smart contract. No external oracles, no cron bots. Just native Rialo HTTP calls + event-driven triggers.

Built specifically for the **Rialo Shark Tank** and to demonstrate `Real World Connectivity`, `Reactive Transactions`, and `Real World Identity`.

## ✨ Key Features (Rialo Native)
- 🔗 **Native HTTP Calls**: Smart contracts fetch external APIs in 1 line of code
- ⚡ **Reactive Transactions**: Auto-sync triggered by external events (new commit, post, etc.)
- 🔐 **Real World Identity**: Social account verification without KYC
- 🌑 **Confidential Mode**: Toggle private visibility for sensitive metrics
- 📊 **Live Dashboard**: Real-time portfolio sync with sub-second finality UI

## 🛠 Tech Stack
| Layer | Tech |
|-------|------|
| Blockchain | Rialo (RISC-V VM, `rialo-cdk` ready) |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Mock SDK | Custom RPC layer (`lib/rialo-mock.ts`) |
| Hosting | Vercel (Edge-ready, CI/CD enabled) |

## 📥 Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# 3. Open http://localhost:3000
