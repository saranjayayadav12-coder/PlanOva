# Acadesk — Product Roadmap

**Vision:** An AI-powered adaptive student success and well-being platform.  
**Core Promise:** *"Your study plan should adapt to you."*

---

## Phase Status Summary

| Phase | Milestone | Status | Key Deliverables |
|---|---|---|---|
| **Phase 1** | Project Foundation | Completed | Next.js 16 App Router, TypeScript, Tailwind CSS v4, Base Layouts |
| **Phase 2** | Design System & Reusable UI | Completed | Pastel design tokens, Glassmorphism, Reusable Button, Card, Input |
| **Phase 3** | Public Landing Page | Completed | Hero section, Value proposition, Interactive features, Responsive layout |
| **Phase 4** | Student Dashboard UI | Completed | High-level metrics, Upcoming sessions, Task overview, Stress/workload gauges |
| **Phase 5** | Task Management System | Completed | Task creation, editing, deletion, filtering, sorting, persistent local storage |
| **Phase 6** | AI-Powered Task Breakdown | Completed | Subtask breakdown generation, subtask toggling, dependency ordering, local state |
| **Phase 7** | AI Study Planner | Completed | Deterministic schedule generation, daily study limit, availability preferences, local persistence |
| **Phase 8** | Adaptive Scheduling & Intelligent Plan Adjustment | Completed | Session outcome tracking, adaptive replanning triggers, side-by-side comparison modal, What-If simulator, adaptation history log |
| **Phase 9** | Workload Insights & Academic Recovery Mode | Completed | Workload analytics, deadline pressure points, daily capacity distribution, deterministic recovery engine, before/after proposal review |
| **Phase 10** | Interactive Academic Calendar | Completed | Month, Week, Day calendar views, Task deadlines & Study block integration, Academic scheduling warnings, Shared state |
| **Phase 11** | Optional Well-being Check-ins & Student Support Insights | Completed | Daily check-in form, Self-reported signals, Supportive workload synthesis, Privacy & local storage controls |

---

## Phase 8: Adaptive Scheduling & Intelligent Plan Adjustment (Detailed Breakdown)

### 1. Study Session Outcome Tracking
- Extended session state to distinguish between `scheduled`, `completed`, and `incomplete` (`remainingMinutes`).
- Decoupled parent academic task progress from individual session completion: completing a single session records incremental progress without prematurely closing multi-session assignments.
- Incomplete sessions are triggered deliberately by user choice or explicit outcome entry ("Need More Time"), never automatically merely because time has elapsed.

### 2. Adaptive Replanning Triggers
- Dynamic detection of schedule recalibration opportunities:
  - Incomplete session leaving unfinished estimated work.
  - Session duration overruns.
  - Student availability or maximum daily limit adjustments.
  - Assignment deadline changes or shifts.
  - Addition of high-priority academic tasks.
- Non-intrusive prompt banner: *"Your study plan may need an update"* with supportive, non-shaming language and dismiss capability.
- Active accepted schedule remains protected and untouched until the student explicitly reviews and accepts revisions.

### 3. Adaptive Scheduling Engine
- Deterministic rescheduling engine in `study-planner-service.ts`.
- Freezes and preserves completed sessions verbatim in their original slots.
- Recalculates day capacities subtracting completed session usage.
- Reschedules incomplete work and remaining tasks prioritised by urgency and difficulty.
- Emits detailed diff tags (`unchanged`, `shifted`, `rescheduled`, `added`) and identifies unscheduled/at-risk tasks when constraints cannot be satisfied.

### 4. Side-by-Side Plan Comparison
- Side-by-side desktop layout and stacked mobile layout comparing the Current Accepted Plan with the Proposed Revised Plan.
- Visual diff tags for every session with metric counters (unchanged, shifted, added/rescheduled sessions, total study hours delta).
- Student retains full control with explicit actions: **Accept Revised Plan**, **Reject Changes**, or **Return to Current Plan**.

### 5. What-If Simulator
- Sandboxed simulation engine operating strictly on deep clones of tasks and availability preferences.
- Enables students to experiment with:
  - Reduced study capacity for upcoming days.
  - Simulated new assignments.
  - Moving existing sessions.
  - Simulated task overruns.
- Computes schedule feasibility scores (High, Moderate, Low), peak daily load, and actionable impact summaries without modifying live records.

### 6. Adaptation History & Audit Log
- Audit log persisted in `acadesk.planner_history.v1`.
- Records plan creation, plan acceptance, session completion, incomplete sessions, and revised plan adoptions.
- Fully non-shaming, empathetic messaging designed to support student well-being.

---

## Phase 9: Workload Insights & Academic Recovery Mode (Detailed Breakdown)

### 1. Workload Insights (`/app/workload`)
- **Header & Navigation**: Title *"Workload Insights"* with subtitle, linked seamlessly to Academic Recovery Mode when bottlenecks arise.
- **5 Summary Metrics**: Active Deliverables, Overdue Tasks, Due Next 7 Days, Completed Tasks, and Scheduled Study Hours.
- **Deadline Pressure Points**: Identifies overdue assignments, deadlines occurring today, approaching deadlines within 3 days, and clustered deadline dates with 2+ concurrent deliverables.
- **Daily Workload Distribution**: Accessible CSS-based bar visualizations comparing planned study duration vs available daily study capacity across the 7-day planning window.
- **Completion Rates & Momentum**: Evaluates active assignment completion percentage and study session execution without fabricating historical claims.
- **Deterministic Actionable Insights**: 5 supportive insight categories (Deadline pressure, Overloaded day, Planning gap, Recovery progress, Workload opportunity) with direct navigation buttons.

### 2. Academic Recovery Mode (`/app/recovery`)
- **Empathetic Diagnostic Engine**: Diagnoses academic recovery opportunities from overdue tasks, clustered deadlines, overloaded days, and incomplete study blocks with supportive, non-alarming language.
- **Deterministic Recovery Scheduler**: Generates an Academic Recovery proposal that re-balances study blocks evenly across available days within configured caps while protecting completed milestones.
- **Original vs Proposed Plan Comparison**: Side-by-side comparative metrics (Study hours before/after, Overloaded days before/after, Moved sessions, Unscheduled work, Well-being trade-offs).
- **Student Approval Control**: Requires explicit student confirmation (**Accept Recovery Plan**, **Reject Proposal**, or **Cancel & Return**). Updating writes to `acadesk.planner_plans.v1` and appends an event to `acadesk.planner_history.v1`.

---

## Phase 10: Interactive Academic Calendar (Detailed Breakdown)

### 1. Interactive Academic Calendar (`/app/calendar`)
- **Multi-View Engine**: Full support for Month View (7-column grid with proper leap-year and weekday alignment), Week View (with separate all-day deadlines and timed study blocks), and Day View (focused daily schedule with stat gauges).
- **Zero Duplicate Store Integration**: Synthesizes calendar events dynamically from shared `TaskProvider` and accepted `acadesk.planner_plan.v1` sessions. Tasks without deadlines never receive fabricated calendar dates.
- **Quick Task Creation with Prepopulated Deadlines**: Allows creating deliverables directly from any selected calendar date with immediate updates across Calendar, Tasks, Workload Insights, and Dashboard.
- **Task & Deadline Editing**: Seamlessly updates task deadlines and status from the calendar with full persistence and reactive synchronization across all views.
- **Academic Scheduling Warnings**: Deterministic diagnostics for deadline clustering (multiple assignments due on the same day), overloaded days (planned minutes exceeding daily cap), planning gaps (approaching deliverables without study sessions), and schedule conflicts (overlapping study blocks).
- **Event Detail Inspector**: Modal inspection of task descriptions, subtask breakdown progress, priority levels, study session times, and reflections with direct completion toggles.

---

## Phase 11: Optional Well-being Check-ins & Student Support Insights (Detailed Breakdown)

### 1. Student Well-being Center (`/app/wellbeing`)
- **Daily Check-in Form**: Accessible 4-metric evaluation (Stress, Energy, Sleep quality, and Workload Manageability on 1–5 scales) plus an optional personal reflection note.
- **Duplicate Prevention Policy**: Enforces one check-in per calendar day, permitting students to review and update responses at any time without data duplication.
- **Supportive Insights Engine**: Transparent, deterministic rules generating empathetic guidance for high stress, low energy, poor sleep, or unmanageable workloads.
- **Workload Integration & Synthesis**: Reconciles self-reported signals with actual academic commitments (e.g. flagging days where low energy collides with overloaded planned study blocks, or high stress coincides with upcoming deadline clusters).
- **Student Privacy & Data Governance**: 100% browser-local storage (`acadesk.wellbeing_checkins.v1`), zero external network transmission, and zero LLM API calls.
- **Comprehensive Control**: Students can delete individual check-ins or clear their entire history with explicit confirmation.


