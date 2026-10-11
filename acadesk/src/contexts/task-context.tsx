"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { Task, TaskFormData, TaskStatus } from "@/types/task";
import { Subtask, TaskBreakdown, SubtaskStatus } from "@/types/subtask";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  DEFAULT_TASKS,
} from "@/lib/task-storage";
import {
  loadBreakdownsFromStorage,
  saveBreakdownsToStorage,
  DEFAULT_BREAKDOWNS,
} from "@/lib/breakdown-storage";

interface TaskContextType {
  tasks: Task[];
  breakdowns: Record<string, TaskBreakdown>;
  isLoaded: boolean;
  addTask: (data: TaskFormData) => Task;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  resetToDefaults: () => void;
  // Subtask & Breakdown methods
  getBreakdown: (taskId: string) => TaskBreakdown | undefined;
  saveBreakdown: (
    taskId: string,
    subtasks: Subtask[],
    source?: "ai_suggestion" | "custom"
  ) => void;
  deleteBreakdown: (taskId: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
  updateSubtasks: (taskId: string, subtasks: Subtask[]) => void;
  importTasksAndBreakdowns: (
    importedTasks: Task[],
    importedBreakdowns: Record<string, TaskBreakdown>
  ) => void;
  clearAllTasksAndBreakdowns: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [breakdowns, setBreakdowns] =
    useState<Record<string, TaskBreakdown>>(DEFAULT_BREAKDOWNS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage safely after client hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedTasks = loadTasksFromStorage();
      const storedBreakdowns = loadBreakdownsFromStorage();
      setTasks(storedTasks);
      setBreakdowns(storedBreakdowns);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (isLoaded) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isLoaded]);

  // Save breakdowns to localStorage whenever breakdowns change
  useEffect(() => {
    if (isLoaded) {
      saveBreakdownsToStorage(breakdowns);
    }
  }, [breakdowns, isLoaded]);

  // Synchronize across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "acadesk.tasks.v1" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) setTasks(updated);
        } catch {
          // ignore parsing error
        }
      }
      if (e.key === "acadesk.breakdowns.v1" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated && typeof updated === "object") setBreakdowns(updated);
        } catch {
          // ignore parsing error
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addTask = useCallback((data: TaskFormData): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      subject: data.subject.trim(),
      deadline: data.deadline,
      estimatedDurationMinutes: Number(data.estimatedDurationMinutes) || 30,
      difficulty: data.difficulty,
      priority: data.priority,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, data: Partial<TaskFormData>) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        return {
          ...task,
          ...data,
          title: data.title !== undefined ? data.title.trim() : task.title,
          subject: data.subject !== undefined ? data.subject.trim() : task.subject,
          description:
            data.description !== undefined
              ? data.description.trim() || undefined
              : task.description,
          estimatedDurationMinutes:
            data.estimatedDurationMinutes !== undefined
              ? Number(data.estimatedDurationMinutes) || task.estimatedDurationMinutes
              : task.estimatedDurationMinutes,
          updatedAt: now,
        };
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    // Clean up associated breakdown
    setBreakdowns((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newStatus: TaskStatus = t.status === "completed" ? "pending" : "completed";
        return {
          ...t,
          status: newStatus,
          updatedAt: now,
        };
      })
    );
  }, []);

  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          status,
          updatedAt: now,
        };
      })
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setTasks(DEFAULT_TASKS);
    saveTasksToStorage(DEFAULT_TASKS);
    setBreakdowns(DEFAULT_BREAKDOWNS);
    saveBreakdownsToStorage(DEFAULT_BREAKDOWNS);
  }, []);

  const importTasksAndBreakdowns = useCallback(
    (importedTasks: Task[], importedBreakdowns: Record<string, TaskBreakdown>) => {
      setTasks(importedTasks);
      saveTasksToStorage(importedTasks);
      setBreakdowns(importedBreakdowns);
      saveBreakdownsToStorage(importedBreakdowns);
    },
    []
  );

  const clearAllTasksAndBreakdowns = useCallback(() => {
    setTasks([]);
    saveTasksToStorage([]);
    setBreakdowns({});
    saveBreakdownsToStorage({});
  }, []);

  // --- Subtask & Breakdown Methods ---

  const getBreakdown = useCallback(
    (taskId: string): TaskBreakdown | undefined => {
      return breakdowns[taskId];
    },
    [breakdowns]
  );

  const saveBreakdown = useCallback(
    (
      taskId: string,
      subtasks: Subtask[],
      source: "ai_suggestion" | "custom" = "ai_suggestion"
    ) => {
      const now = new Date().toISOString();
      setBreakdowns((prev) => {
        const existing = prev[taskId];
        return {
          ...prev,
          [taskId]: {
            taskId,
            subtasks,
            source,
            createdAt: existing ? existing.createdAt : now,
            updatedAt: now,
          },
        };
      });
    },
    []
  );

  const deleteBreakdown = useCallback((taskId: string) => {
    setBreakdowns((prev) => {
      if (!prev[taskId]) return prev;
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  }, []);

  const toggleSubtaskCompletion = useCallback(
    (taskId: string, subtaskId: string) => {
      const now = new Date().toISOString();
      setBreakdowns((prev) => {
        const breakdown = prev[taskId];
        if (!breakdown) return prev;

        const updatedSubtasks: Subtask[] = breakdown.subtasks.map((sub) => {
          if (sub.id !== subtaskId) return sub;
          const nextStatus: SubtaskStatus =
            sub.status === "completed" ? "pending" : "completed";
          return {
            ...sub,
            status: nextStatus,
            updatedAt: now,
          };
        });

        const nextBreakdown: TaskBreakdown = {
          ...breakdown,
          subtasks: updatedSubtasks,
          updatedAt: now,
        };

        return {
          ...prev,
          [taskId]: nextBreakdown,
        };
      });
    },
    []
  );

  const updateSubtasks = useCallback((taskId: string, subtasks: Subtask[]) => {
    const now = new Date().toISOString();
    setBreakdowns((prev) => {
      const breakdown = prev[taskId];
      if (!breakdown) return prev;
      return {
        ...prev,
        [taskId]: {
          ...breakdown,
          subtasks,
          updatedAt: now,
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      breakdowns,
      isLoaded,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      setTaskStatus,
      resetToDefaults,
      getBreakdown,
      saveBreakdown,
      deleteBreakdown,
      toggleSubtaskCompletion,
      updateSubtasks,
      importTasksAndBreakdowns,
      clearAllTasksAndBreakdowns,
    }),
    [
      tasks,
      breakdowns,
      isLoaded,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      setTaskStatus,
      resetToDefaults,
      getBreakdown,
      saveBreakdown,
      deleteBreakdown,
      toggleSubtaskCompletion,
      updateSubtasks,
      importTasksAndBreakdowns,
      clearAllTasksAndBreakdowns,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
