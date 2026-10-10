# PlanOva — Acadesk

> **Adaptive Student Success and Well-being Platform**  
> *"Your study plan should adapt to you."*

---

## 🚀 About PlanOva / Acadesk

PlanOva (Acadesk) is an AI-powered student productivity, adaptive study planning, and academic well-being platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

It supports students across their entire academic journey with:
- 🌸 **Modern Pastel Glassmorphic Design System**: Custom tokens, accessible contrast, and micro-interactions.
- 📋 **Comprehensive Task & Deliverable Management**: Add, edit, filter, prioritize, and track coursework deliverables.
- 🧠 **AI Task Breakdown**: Decompose large deliverables into actionable, sequenced subtasks.
- 📅 **Deterministic AI Study Planner**: Auto-generate balanced study schedules respecting daily fatigue limits, break buffers, and student availability.
- ⚡ **Adaptive Scheduling & Replanning**: Outcome tracking (completed, incomplete), side-by-side plan diff comparison, and sandboxed What-If simulation.
- 📊 **Workload Insights**: Metric aggregation, deadline pressure analysis, and daily capacity vs. study load distribution.
- 🛡️ **Academic Recovery Mode**: Empathetic bottleneck diagnosis, workload re-balancing, and student-governed schedule adjustments.

---

## 📁 Repository Structure

- `acadesk/`: Main Next.js application workspace.
  - `src/app/`: Next.js App Router pages (`/`, `/app/dashboard`, `/app/tasks`, `/app/planner`, `/app/workload`, `/app/recovery`, `/design-system`).
  - `src/components/`: Modular UI component libraries (Dashboard, Tasks, Planner, Workload, Recovery, Primitives).
  - `src/lib/`: Core deterministic engines, local persistence, and calculation services.
  - `src/types/`: Centralized TypeScript contracts.
  - `ACADESK_ROADMAP.md`: Project development roadmap across all phases.

---

## 🛠️ Quick Start

```bash
cd acadesk
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Validation

```bash
cd acadesk
npx tsc --noEmit
npm run lint
npm run build
```
