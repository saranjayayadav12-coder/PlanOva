/**
 * lib/calendar-service.ts
 *
 * Core domain service for the Acadesk Interactive Academic Calendar.
 * Synthesizes shared tasks and accepted study plans into calendar events,
 * provides calendar grid calculations (month, week, day) with accurate leap-year
 * and timezone handling, and evaluates academic scheduling warnings.
 */

import { Task } from "@/types/task";
import {
  StudyPlan,
  AvailabilityPreferences,
  PlannedSession,
  DayOfWeek,
} from "@/types/planner";
import {
  CalendarEvent,
  CalendarFilterState,
  DayCalendarInfo,
  AcademicWarning,
} from "@/types/calendar";
import {
  formatDateISO,
  parseDateISO,
  addDays,
} from "./study-planner-service";

export const DEFAULT_CALENDAR_ANCHOR = "2026-10-11";

const DAY_INDEX_TO_NAME: Record<number, DayOfWeek> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

/**
 * Derive all calendar events from shared tasks and accepted planner sessions.
 * Never invents deadlines for tasks without a deadline.
 * Never creates duplicate tasks.
 */
export function deriveCalendarEvents(
  tasks: Task[],
  acceptedPlan: StudyPlan | null,
  todayStr: string = DEFAULT_CALENDAR_ANCHOR
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // 1. Task Deadlines
  for (const task of tasks) {
    // Only tasks with valid deadlines appear on the calendar
    if (!task.deadline || !task.deadline.trim()) {
      continue;
    }

    const isCompleted = task.status === "completed";
    const isOverdue = !isCompleted && task.deadline < todayStr;

    events.push({
      id: `deadline-${task.id}`,
      type: "task_deadline",
      title: task.title,
      subject: task.subject,
      date: task.deadline,
      isAllDay: true,
      priority: task.priority,
      status: task.status,
      isCompleted,
      isOverdue,
      task,
    });
  }

  // 2. Study Sessions from Accepted Plan only
  if (acceptedPlan && Array.isArray(acceptedPlan.sessions)) {
    for (const session of acceptedPlan.sessions) {
      if (!session.date || !session.date.trim()) {
        continue;
      }

      const isCompleted = session.status === "completed";

      events.push({
        id: `session-${session.id}-${session.date}-${session.startTime || ""}`,
        type: "study_session",
        title: session.title,
        subject: session.subject,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        durationMinutes: session.durationMinutes,
        isAllDay: false,
        priority: session.priority,
        status: session.status,
        isCompleted,
        isOverdue: false,
        session,
        parentTaskTitle: session.parentTaskTitle,
        isSubtask: session.isSubtask,
      });
    }
  }

  return events;
}

/**
 * Apply filters to calendar events
 */
export function filterCalendarEvents(
  events: CalendarEvent[],
  filters: CalendarFilterState
): CalendarEvent[] {
  return events.filter((event) => {
    // Filter by Event Type
    if (filters.eventType !== "all" && event.type !== filters.eventType) {
      return false;
    }

    // Filter by Priority
    if (filters.priority !== "all" && event.priority !== filters.priority) {
      return false;
    }

    // Filter by Subject
    if (
      filters.subject !== "all" &&
      event.subject.toLowerCase() !== filters.subject.toLowerCase()
    ) {
      return false;
    }

    // Filter by Status
    if (filters.status === "active" && event.isCompleted) {
      return false;
    }
    if (filters.status === "completed" && !event.isCompleted) {
      return false;
    }
    if (filters.status === "overdue" && !event.isOverdue) {
      return false;
    }

    // Filter by Search Query
    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = event.title.toLowerCase().includes(q);
      const matchSubject = event.subject.toLowerCase().includes(q);
      const matchParent = event.parentTaskTitle?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchSubject && !matchParent) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Extract unique subjects present across tasks and accepted study sessions
 */
export function extractCalendarSubjects(
  tasks: Task[],
  acceptedPlan: StudyPlan | null
): string[] {
  const subjects = new Set<string>();

  for (const t of tasks) {
    if (t.subject && t.subject.trim()) {
      subjects.add(t.subject.trim());
    }
  }

  if (acceptedPlan && Array.isArray(acceptedPlan.sessions)) {
    for (const s of acceptedPlan.sessions) {
      if (s.subject && s.subject.trim()) {
        subjects.add(s.subject.trim());
      }
    }
  }

  return Array.from(subjects).sort();
}

/**
 * Get weekday index where Monday = 0, Tuesday = 1, ... Sunday = 6
 */
export function getMondayFirstDayOfWeek(date: Date): number {
  const day = date.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  return day === 0 ? 6 : day - 1;
}

/**
 * Builds the month calendar grid (35 or 42 day cells) for year and month (1-indexed: 1 = Jan, 10 = Oct).
 * Weekday alignment starts on Monday.
 * Accurately handles leap years and timezone-free ISO date calculations.
 */
export function getMonthCalendarGrid(
  year: number,
  month: number, // 1 - 12
  events: CalendarEvent[],
  selectedDateStr: string,
  todayStr: string = DEFAULT_CALENDAR_ANCHOR
): DayCalendarInfo[] {
  // First day of current month
  const firstDayOfMonth = new Date(year, month - 1, 1);
  // Total days in current month (day 0 of next month returns last day of current month)
  const totalDaysInMonth = new Date(year, month, 0).getDate();

  // Day of week of the 1st (Monday = 0 ... Sunday = 6)
  const startDayOffset = getMondayFirstDayOfWeek(firstDayOfMonth);

  // Group events by YYYY-MM-DD
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const list = eventsByDate.get(event.date) || [];
    list.push(event);
    eventsByDate.set(event.date, list);
  }

  const grid: DayCalendarInfo[] = [];

  // Days before the 1st from the previous month
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const prevDate = prevMonthLastDate - i;
    const prevMonthDateObj = new Date(year, month - 2, prevDate);
    const dateStr = formatDateISO(prevMonthDateObj);
    const dayEvents = eventsByDate.get(dateStr) || [];

    grid.push({
      date: dateStr,
      dayOfMonth: prevDate,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr,
      events: dayEvents,
      deadlinesCount: dayEvents.filter((e) => e.type === "task_deadline").length,
      sessionsCount: dayEvents.filter((e) => e.type === "study_session").length,
      hasOverdue: dayEvents.some((e) => e.isOverdue),
    });
  }

  // Days of current month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const curDateObj = new Date(year, month - 1, day);
    const dateStr = formatDateISO(curDateObj);
    const dayEvents = eventsByDate.get(dateStr) || [];

    grid.push({
      date: dateStr,
      dayOfMonth: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr,
      events: dayEvents,
      deadlinesCount: dayEvents.filter((e) => e.type === "task_deadline").length,
      sessionsCount: dayEvents.filter((e) => e.type === "study_session").length,
      hasOverdue: dayEvents.some((e) => e.isOverdue),
    });
  }

  // Trailing days from next month to complete the row (multiples of 7: 35 or 42)
  const remainingCells = (7 - (grid.length % 7)) % 7;
  // If only 28 or 35 days, we want 35 or 42 so the grid height is consistent
  const targetTotal = grid.length + remainingCells < 35 ? 35 : grid.length + remainingCells;
  const trailingNeeded = targetTotal - grid.length;

  for (let nextDay = 1; nextDay <= trailingNeeded; nextDay++) {
    const nextDateObj = new Date(year, month, nextDay);
    const dateStr = formatDateISO(nextDateObj);
    const dayEvents = eventsByDate.get(dateStr) || [];

    grid.push({
      date: dateStr,
      dayOfMonth: nextDay,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr,
      events: dayEvents,
      deadlinesCount: dayEvents.filter((e) => e.type === "task_deadline").length,
      sessionsCount: dayEvents.filter((e) => e.type === "study_session").length,
      hasOverdue: dayEvents.some((e) => e.isOverdue),
    });
  }

  return grid;
}

/**
 * Returns the 7 days of the week (Monday through Sunday) containing the given anchor date
 */
export function getWeekDays(
  anchorDateStr: string,
  events: CalendarEvent[],
  selectedDateStr: string,
  todayStr: string = DEFAULT_CALENDAR_ANCHOR
): DayCalendarInfo[] {
  const anchor = parseDateISO(anchorDateStr);
  const offset = getMondayFirstDayOfWeek(anchor);
  const monday = addDays(anchor, -offset);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const list = eventsByDate.get(event.date) || [];
    list.push(event);
    eventsByDate.set(event.date, list);
  }

  const week: DayCalendarInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const dateObj = addDays(monday, i);
    const dateStr = formatDateISO(dateObj);
    const dayEvents = eventsByDate.get(dateStr) || [];

    week.push({
      date: dateStr,
      dayOfMonth: dateObj.getDate(),
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr,
      events: dayEvents,
      deadlinesCount: dayEvents.filter((e) => e.type === "task_deadline").length,
      sessionsCount: dayEvents.filter((e) => e.type === "study_session").length,
      hasOverdue: dayEvents.some((e) => e.isOverdue),
    });
  }

  return week;
}

/**
 * Build DayCalendarInfo for a single date
 */
export function getDayCalendarInfo(
  dateStr: string,
  events: CalendarEvent[],
  todayStr: string = DEFAULT_CALENDAR_ANCHOR
): DayCalendarInfo {
  const dateObj = parseDateISO(dateStr);
  const dayEvents = events.filter((e) => e.date === dateStr);

  return {
    date: dateStr,
    dayOfMonth: dateObj.getDate(),
    isCurrentMonth: true,
    isToday: dateStr === todayStr,
    isSelected: true,
    events: dayEvents,
    deadlinesCount: dayEvents.filter((e) => e.type === "task_deadline").length,
    sessionsCount: dayEvents.filter((e) => e.type === "study_session").length,
    hasOverdue: dayEvents.some((e) => e.isOverdue),
  };
}

/**
 * Title formatting helpers
 */
export function formatMonthTitle(year: number, month: number): string {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatWeekTitle(weekDays: DayCalendarInfo[]): string {
  if (weekDays.length < 7) return "";
  const first = parseDateISO(weekDays[0].date);
  const last = parseDateISO(weekDays[6].date);

  const firstMonth = first.toLocaleDateString("en-US", { month: "short" });
  const lastMonth = last.toLocaleDateString("en-US", { month: "short" });
  const firstYear = first.getFullYear();
  const lastYear = last.getFullYear();

  if (firstYear === lastYear) {
    if (firstMonth === lastMonth) {
      return `${firstMonth} ${first.getDate()} – ${last.getDate()}, ${firstYear}`;
    }
    return `${firstMonth} ${first.getDate()} – ${lastMonth} ${last.getDate()}, ${firstYear}`;
  }

  return `${firstMonth} ${first.getDate()}, ${firstYear} – ${lastMonth} ${last.getDate()}, ${lastYear}`;
}

export function formatDayTitle(dateStr: string): string {
  const date = parseDateISO(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Helper to convert HH:MM to minutes from midnight
 */
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Computes deterministic, actionable academic scheduling warnings from shared state.
 */
export function computeCalendarWarnings(
  tasks: Task[],
  acceptedPlan: StudyPlan | null,
  availability: AvailabilityPreferences,
  todayStr: string = DEFAULT_CALENDAR_ANCHOR
): AcademicWarning[] {
  const warnings: AcademicWarning[] = [];

  const activeTasks = tasks.filter((t) => t.status !== "completed" && Boolean(t.deadline));

  // 1. DEADLINE CLUSTERING: Dates containing multiple active task deadlines
  const deadlinesByDate: Record<string, Task[]> = {};
  for (const task of activeTasks) {
    if (task.deadline >= todayStr) {
      if (!deadlinesByDate[task.deadline]) deadlinesByDate[task.deadline] = [];
      deadlinesByDate[task.deadline].push(task);
    }
  }

  for (const [date, clustered] of Object.entries(deadlinesByDate)) {
    if (clustered.length >= 2) {
      const dObj = parseDateISO(date);
      const formattedDate = dObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      warnings.push({
        id: `warn-cluster-${date}`,
        type: "deadline_clustering",
        severity: clustered.length >= 3 ? "high" : "medium",
        title: `${clustered.length} Deliverables Due on ${formattedDate}`,
        message: `You have ${clustered.length} assignments due on the same day (${clustered.map((t) => `"${t.title}"`).join(", ")}). Consider spacing out your preparation.`,
        date,
        actionLink: "/app/workload",
        actionLabel: "View Workload",
      });
    }
  }

  // 2. OVERLOADED DAYS: Planned study time exceeds student daily study capacity
  if (acceptedPlan && Array.isArray(acceptedPlan.sessions)) {
    const plannedByDate: Record<string, number> = {};
    for (const s of acceptedPlan.sessions) {
      if (s.date && s.status !== "completed") {
        plannedByDate[s.date] = (plannedByDate[s.date] || 0) + s.durationMinutes;
      }
    }

    for (const [date, plannedMinutes] of Object.entries(plannedByDate)) {
      const dateObj = parseDateISO(date);
      const dayOfWeek = DAY_INDEX_TO_NAME[dateObj.getDay()];
      const dayConfig = availability.days[dayOfWeek];
      const maxAllowed =
        dayConfig && dayConfig.enabled
          ? Math.min(dayConfig.maxDailyMinutes, availability.maxDailyStudyMinutes)
          : 0;

      if (maxAllowed > 0 && plannedMinutes > maxAllowed) {
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        warnings.push({
          id: `warn-overload-${date}`,
          type: "overloaded_day",
          severity: "high",
          title: `Overloaded Study Schedule on ${formattedDate}`,
          message: `Planned study time (${plannedMinutes}m) exceeds your daily capacity limit of ${maxAllowed}m. You can recalibrate via Academic Recovery.`,
          date,
          actionLink: "/app/recovery",
          actionLabel: "Review Recovery Plan",
        });
      }
    }
  }

  // 3. PLANNING GAPS: Upcoming assignments with zero study sessions before deadline
  const in7DaysStr = formatDateISO(addDays(parseDateISO(todayStr), 7));
  const upcomingActiveTasks = activeTasks.filter(
    (t) => t.deadline >= todayStr && t.deadline <= in7DaysStr
  );

  if (acceptedPlan && Array.isArray(acceptedPlan.sessions)) {
    for (const task of upcomingActiveTasks) {
      const taskSessions = acceptedPlan.sessions.filter(
        (s) => s.taskId === task.id && s.date <= task.deadline
      );
      if (taskSessions.length === 0) {
        const dObj = parseDateISO(task.deadline);
        const formattedDate = dObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        warnings.push({
          id: `warn-gap-${task.id}`,
          type: "planning_gap",
          severity: task.priority === "high" ? "high" : "medium",
          title: `No Study Sessions for "${task.title}"`,
          message: `Due on ${formattedDate} (${task.subject}), but no study sessions are currently scheduled for this assignment.`,
          date: task.deadline,
          relatedTaskId: task.id,
          actionLink: "/app/planner",
          actionLabel: "Open Planner",
        });
      }
    }
  }

  // 4. SCHEDULE CONFLICTS: Overlapping study sessions on the same day
  if (acceptedPlan && Array.isArray(acceptedPlan.sessions)) {
    const sessionsByDate: Record<string, PlannedSession[]> = {};
    for (const s of acceptedPlan.sessions) {
      if (s.date && s.startTime && s.endTime && s.status !== "completed") {
        if (!sessionsByDate[s.date]) sessionsByDate[s.date] = [];
        sessionsByDate[s.date].push(s);
      }
    }

    for (const [date, daySessions] of Object.entries(sessionsByDate)) {
      if (daySessions.length >= 2) {
        // Sort by start time
        daySessions.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

        for (let i = 0; i < daySessions.length - 1; i++) {
          const s1 = daySessions[i];
          const s2 = daySessions[i + 1];

          const s1End = timeToMinutes(s1.endTime);
          const s2Start = timeToMinutes(s2.startTime);

          if (s1End > s2Start) {
            const dObj = parseDateISO(date);
            const formattedDate = dObj.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            warnings.push({
              id: `warn-conflict-${s1.id}-${s2.id}`,
              type: "schedule_conflict",
              severity: "high",
              title: `Session Overlap on ${formattedDate}`,
              message: `"${s1.title}" (${s1.startTime}–${s1.endTime}) overlaps with "${s2.title}" (${s2.startTime}–${s2.endTime}).`,
              date,
              actionLink: "/app/planner",
              actionLabel: "Adjust in Planner",
            });
          }
        }
      }
    }
  }

  return warnings;
}
