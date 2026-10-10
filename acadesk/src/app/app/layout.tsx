import { TaskProvider } from "@/contexts/task-context";

/**
 * App Route Layout — /app/*
 *
 * Wraps all application routes (/app/dashboard, /app/tasks, etc.)
 * in the centralized TaskProvider so that task operations, filters,
 * and calculations share a single source of truth and persist seamlessly.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col">{children}</div>
    </TaskProvider>
  );
}
