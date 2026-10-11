"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardShell } from "@/components/dashboard";
import { useTasks } from "@/contexts/task-context";
import { Task, TaskFormData } from "@/types/task";
import {
  StudyPlan,
  AvailabilityPreferences,
  PlannedSession,
  SessionStatus,
} from "@/types/planner";
import {
  CalendarViewMode,
  CalendarEvent,
  CalendarFilterState,
  DayCalendarInfo,
} from "@/types/calendar";
import {
  loadAvailabilityFromStorage,
  loadPlansFromStorage,
  savePlansToStorage,
  recordHistoryEvent,
  DEFAULT_AVAILABILITY,
} from "@/lib/planner-storage";
import {
  formatDateISO,
  parseDateISO,
  addDays,
} from "@/lib/study-planner-service";
import {
  DEFAULT_CALENDAR_ANCHOR,
  deriveCalendarEvents,
  filterCalendarEvents,
  extractCalendarSubjects,
  getMonthCalendarGrid,
  getWeekDays,
  getDayCalendarInfo,
  formatMonthTitle,
  formatWeekTitle,
  formatDayTitle,
  computeCalendarWarnings,
} from "@/lib/calendar-service";
import {
  CalendarHeader,
  CalendarFiltersBar,
  CalendarWarningsBanner,
  MonthView,
  WeekView,
  DayView,
  SelectedDayDetails,
  EventDetailModal,
} from "@/components/calendar";
import { TaskFormModal } from "@/components/tasks";

const DEFAULT_FILTERS: CalendarFilterState = {
  eventType: "all",
  priority: "all",
  subject: "all",
  status: "all",
  search: "",
};

export default function CalendarPage() {
  const { tasks, breakdowns, addTask, updateTask, toggleTaskCompletion } = useTasks();

  // ── Date & Time Tracking ──
  const [todayStr, setTodayStr] = useState<string>(DEFAULT_CALENDAR_ANCHOR);
  const [selectedDate, setSelectedDate] = useState<string>(DEFAULT_CALENDAR_ANCHOR);
  const [anchorYear, setAnchorYear] = useState<number>(2026);
  const [anchorMonth, setAnchorMonth] = useState<number>(10); // 1-indexed (10 = October)

  // ── View Mode & Filters ──
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [filters, setFilters] = useState<CalendarFilterState>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showWarnings, setShowWarnings] = useState<boolean>(true);

  // ── Planner State ──
  const [acceptedPlan, setAcceptedPlan] = useState<StudyPlan | null>(null);
  const [availability, setAvailability] = useState<AvailabilityPreferences>(DEFAULT_AVAILABILITY);

  // ── Modals State ──
  const [isTaskFormOpen, setIsTaskFormOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFormDefaultDeadline, setTaskFormDefaultDeadline] = useState<string>(DEFAULT_CALENDAR_ANCHOR);
  const [selectedEventForModal, setSelectedEventForModal] = useState<CalendarEvent | null>(null);

  // Load live date and planner data safely on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      const currentIso = formatDateISO(now);
      setTodayStr(currentIso);
      setSelectedDate(currentIso);
      setAnchorYear(now.getFullYear());
      setAnchorMonth(now.getMonth() + 1);

      const avail = loadAvailabilityFromStorage();
      const storedPlans = loadPlansFromStorage();
      setAvailability(avail);
      setAcceptedPlan(storedPlans.acceptedPlan);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize accepted plan if changed in another tab or planner
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "acadesk.planner_plan.v1" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === "object") {
            setAcceptedPlan(parsed.acceptedPlan || null);
          }
        } catch {
          // ignore parsing error
        }
      }
      if (e.key === "acadesk.planner_availability.v1" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === "object") {
            setAvailability(parsed);
          }
        } catch {
          // ignore parsing error
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ── Derive Raw Calendar Events ──
  const rawEvents = useMemo(
    () => deriveCalendarEvents(tasks, acceptedPlan, todayStr),
    [tasks, acceptedPlan, todayStr]
  );

  // ── Extract Available Subjects for Filter ──
  const availableSubjects = useMemo(
    () => extractCalendarSubjects(tasks, acceptedPlan),
    [tasks, acceptedPlan]
  );

  // ── Filtered Calendar Events ──
  const filteredEvents = useMemo(
    () => filterCalendarEvents(rawEvents, filters),
    [rawEvents, filters]
  );

  // ── Active Filters Count ──
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.eventType !== "all") count++;
    if (filters.priority !== "all") count++;
    if (filters.subject !== "all") count++;
    if (filters.status !== "all") count++;
    if (filters.search.trim().length > 0) count++;
    return count;
  }, [filters]);

  const isFiltered = activeFilterCount > 0;

  // ── Academic Scheduling Warnings ──
  const warnings = useMemo(
    () => computeCalendarWarnings(tasks, acceptedPlan, availability, todayStr),
    [tasks, acceptedPlan, availability, todayStr]
  );

  // ── Month Grid Calculation ──
  const monthGridDays = useMemo(
    () =>
      getMonthCalendarGrid(
        anchorYear,
        anchorMonth,
        filteredEvents,
        selectedDate,
        todayStr
      ),
    [anchorYear, anchorMonth, filteredEvents, selectedDate, todayStr]
  );

  // ── Week Days Calculation ──
  const weekDays = useMemo(
    () => getWeekDays(selectedDate, filteredEvents, selectedDate, todayStr),
    [selectedDate, filteredEvents, todayStr]
  );

  // ── Day Info Calculation ──
  const selectedDayInfo: DayCalendarInfo = useMemo(() => {
    return getDayCalendarInfo(selectedDate, filteredEvents, todayStr);
  }, [selectedDate, filteredEvents, todayStr]);

  // ── Period Title ──
  const periodTitle = useMemo(() => {
    switch (viewMode) {
      case "month":
        return formatMonthTitle(anchorYear, anchorMonth);
      case "week":
        return formatWeekTitle(weekDays);
      case "day":
        return formatDayTitle(selectedDate);
    }
  }, [viewMode, anchorYear, anchorMonth, weekDays, selectedDate]);

  // ── Period Navigation Handlers ──
  const handlePrevPeriod = useCallback(() => {
    if (viewMode === "month") {
      if (anchorMonth === 1) {
        setAnchorYear((prev) => prev - 1);
        setAnchorMonth(12);
      } else {
        setAnchorMonth((prev) => prev - 1);
      }
    } else if (viewMode === "week") {
      const prevWeekDate = formatDateISO(addDays(parseDateISO(selectedDate), -7));
      setSelectedDate(prevWeekDate);
      const parsed = parseDateISO(prevWeekDate);
      setAnchorYear(parsed.getFullYear());
      setAnchorMonth(parsed.getMonth() + 1);
    } else {
      const prevDay = formatDateISO(addDays(parseDateISO(selectedDate), -1));
      setSelectedDate(prevDay);
      const parsed = parseDateISO(prevDay);
      setAnchorYear(parsed.getFullYear());
      setAnchorMonth(parsed.getMonth() + 1);
    }
  }, [viewMode, anchorMonth, selectedDate]);

  const handleNextPeriod = useCallback(() => {
    if (viewMode === "month") {
      if (anchorMonth === 12) {
        setAnchorYear((prev) => prev + 1);
        setAnchorMonth(1);
      } else {
        setAnchorMonth((prev) => prev + 1);
      }
    } else if (viewMode === "week") {
      const nextWeekDate = formatDateISO(addDays(parseDateISO(selectedDate), 7));
      setSelectedDate(nextWeekDate);
      const parsed = parseDateISO(nextWeekDate);
      setAnchorYear(parsed.getFullYear());
      setAnchorMonth(parsed.getMonth() + 1);
    } else {
      const nextDay = formatDateISO(addDays(parseDateISO(selectedDate), 1));
      setSelectedDate(nextDay);
      const parsed = parseDateISO(nextDay);
      setAnchorYear(parsed.getFullYear());
      setAnchorMonth(parsed.getMonth() + 1);
    }
  }, [viewMode, anchorMonth, selectedDate]);

  const handleToday = useCallback(() => {
    const now = new Date();
    const currentIso = formatDateISO(now);
    setSelectedDate(currentIso);
    setAnchorYear(now.getFullYear());
    setAnchorMonth(now.getMonth() + 1);
  }, []);

  // ── Date Selection ──
  const handleSelectDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
    const parsed = parseDateISO(dateStr);
    // Align month if selecting an adjacent month day
    setAnchorYear(parsed.getFullYear());
    setAnchorMonth(parsed.getMonth() + 1);
  }, []);

  // ── Task Creation & Editing ──
  const handleOpenAddTask = useCallback(
    (defaultDate?: string) => {
      setEditingTask(null);
      setTaskFormDefaultDeadline(defaultDate || selectedDate);
      setIsTaskFormOpen(true);
    },
    [selectedDate]
  );

  const handleOpenEditTask = useCallback((event: CalendarEvent) => {
    if (event.task) {
      setEditingTask(event.task);
      setTaskFormDefaultDeadline(event.task.deadline);
      setIsTaskFormOpen(true);
    }
  }, []);

  const handleTaskFormSubmit = useCallback(
    (formData: TaskFormData) => {
      if (editingTask) {
        updateTask(editingTask.id, formData);
      } else {
        addTask(formData);
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
    },
    [editingTask, updateTask, addTask]
  );

  // ── Task Completion Toggle ──
  const handleToggleTaskComplete = useCallback(
    (taskId: string) => {
      toggleTaskCompletion(taskId);
    },
    [toggleTaskCompletion]
  );

  // ── Session Completion Toggle in Accepted Plan ──
  const handleToggleSessionComplete = useCallback(
    (sessionId: string) => {
      if (!acceptedPlan) return;

      const updatedSessions = acceptedPlan.sessions.map((s) => {
        if (s.id !== sessionId) return s;
        const nextStatus: SessionStatus =
          s.status === "completed" ? "scheduled" : "completed";
        return {
          ...s,
          status: nextStatus,
          outcomeRecordedAt:
            nextStatus === "completed" ? new Date().toISOString() : undefined,
        };
      });

      const updatedPlan: StudyPlan = {
        ...acceptedPlan,
        sessions: updatedSessions,
        updatedAt: new Date().toISOString(),
      };

      setAcceptedPlan(updatedPlan);
      const stored = loadPlansFromStorage();
      savePlansToStorage({ ...stored, acceptedPlan: updatedPlan });

      const target = acceptedPlan.sessions.find((s) => s.id === sessionId);
      if (target) {
        recordHistoryEvent({
          type: "session_completed",
          title: `Session Updated: ${target.title}`,
          summary: `Toggled completion status from calendar for ${target.subject}.`,
          sessionTitle: target.title,
          subject: target.subject,
        });
      }
    },
    [acceptedPlan]
  );

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* ── Calendar Page Header & Controls ── */}
        <CalendarHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          periodTitle={periodTitle}
          onPrevPeriod={handlePrevPeriod}
          onNextPeriod={handleNextPeriod}
          onToday={handleToday}
          onAddTask={() => handleOpenAddTask(selectedDate)}
          activeFilterCount={activeFilterCount}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          warningCount={warnings.length}
          showWarnings={showWarnings}
          onToggleWarnings={() => setShowWarnings(!showWarnings)}
        />

        {/* ── Academic Scheduling Warnings ── */}
        {showWarnings && warnings.length > 0 && (
          <CalendarWarningsBanner
            warnings={warnings}
            onClose={() => setShowWarnings(false)}
          />
        )}

        {/* ── Filter Bar (Collapsible) ── */}
        {showFilters && (
          <CalendarFiltersBar
            filters={filters}
            onFilterChange={setFilters}
            subjects={availableSubjects}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            isFiltered={isFiltered}
          />
        )}

        {/* ── Main Calendar Views ── */}
        {viewMode === "month" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <MonthView
                days={monthGridDays}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onEventClick={(evt) => setSelectedEventForModal(evt)}
              />
            </div>

            <div className="lg:col-span-1">
              <SelectedDayDetails
                dayInfo={selectedDayInfo}
                onAddTask={() => handleOpenAddTask(selectedDate)}
                onEventClick={(evt) => setSelectedEventForModal(evt)}
                onToggleTaskComplete={handleToggleTaskComplete}
                onViewDayMode={() => setViewMode("day")}
              />
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <WeekView
                weekDays={weekDays}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onEventClick={(evt) => setSelectedEventForModal(evt)}
                onAddTaskForDate={(dateStr) => handleOpenAddTask(dateStr)}
              />
            </div>

            <div className="lg:col-span-1">
              <SelectedDayDetails
                dayInfo={selectedDayInfo}
                onAddTask={() => handleOpenAddTask(selectedDate)}
                onEventClick={(evt) => setSelectedEventForModal(evt)}
                onToggleTaskComplete={handleToggleTaskComplete}
                onViewDayMode={() => setViewMode("day")}
              />
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <DayView
            dayInfo={selectedDayInfo}
            onEventClick={(evt) => setSelectedEventForModal(evt)}
            onAddTask={() => handleOpenAddTask(selectedDate)}
            onToggleTaskComplete={handleToggleTaskComplete}
          />
        )}

        {/* ── Event Detail Modal ── */}
        <EventDetailModal
          isOpen={Boolean(selectedEventForModal)}
          event={selectedEventForModal}
          breakdown={
            selectedEventForModal?.task
              ? breakdowns[selectedEventForModal.task.id]
              : undefined
          }
          onClose={() => setSelectedEventForModal(null)}
          onEditTask={handleOpenEditTask}
          onToggleTaskComplete={handleToggleTaskComplete}
          onToggleSessionComplete={handleToggleSessionComplete}
        />

        {/* ── Task Creation & Editing Modal ── */}
        <TaskFormModal
          isOpen={isTaskFormOpen}
          onClose={() => {
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleTaskFormSubmit}
          initialTask={editingTask}
          defaultDeadline={taskFormDefaultDeadline}
        />
      </div>
    </DashboardShell>
  );
}
