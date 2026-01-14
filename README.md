# Autopsy 🔍

**AI-first project management application that detects silent project failure.**

## 🎯 The Problem

Most projects don't fail dramatically — they fail silently. Tasks sit untouched for days. Status updates become theater. Progress reports look great on paper while the project slowly dies. By the time anyone notices, it's too late.

Traditional project management tools show you **what's happening**. Autopsy shows you **what's going wrong**.

## 💡 What is Autopsy?

Autopsy is an intelligent project management tool that uses AI to proactively identify risks in your projects before they become critical issues. Instead of waiting for deadlines to be missed, Autopsy continuously monitors your project's vital signs and alerts you to problems while there's still time to fix them.

## 🔬 How It Works

Autopsy analyzes task patterns and behaviors to detect:

- **🚨 Stagnation** — Tasks that haven't been touched in days, silently blocking progress
- **🎭 Fake Progress** — Status updates that look good but mask underlying problems
- **🔄 Status Flapping** — Tasks bouncing between states, indicating confusion or scope issues
- **⏰ Overdue Creep** — Deadlines slipping without acknowledgment

When risks are detected, Autopsy uses LLM-powered analysis (Llama 3.3) to generate actionable insights — not just "Task X is late" but "Here's why this matters and what you should do about it."

## 🆚 Why Not Just Use Jira/Asana/Trello?

| Traditional Tools | Autopsy |
|-------------------|---------|
| Show task status | Detect hidden problems |
| Reactive (you check for issues) | Proactive (issues find you) |
| Manual progress tracking | AI-powered pattern detection |
| Dashboard overload | Focused risk signals |
| "Everything looks fine" | "Here's what's actually happening" |

Traditional tools are great at organizing work. Autopsy is built to **protect your project from silent failure**.

## ✨ Key Features

- **AI-Powered Risk Detection** — Automatically identifies project risks using pattern analysis
- **LLM Insights** — Get AI-generated explanations and recommendations, not just alerts
- **Risk Timeline** — See how project health evolves over time
- **Priority-Aware Severity** — Critical tasks get appropriately urgent risk scores
- **Team Load Analysis** — Factors in workload when assessing risk severity

## 📁 Project Structure

```
autopsy/
├── client/     # React frontend (Vite + Tailwind CSS)
├── server/     # Express.js backend (Node.js + MongoDB)
```

## 🚀 Getting Started

```bash
git clone https://github.com/pranayyb/autopsy.git
cd autopsy
```

See individual README files for setup and technical details:
- [Client README](./client/README.md)
- [Server README](./server/README.md)

## 👤 Author

**Pranay Buradkar**

## 📄 License

ISC License
