"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, BookOpen, Clock, Calendar } from "lucide-react";
import { Button, Input, Textarea, Select, Label, FormField, FormErrorMessage } from "@/components/ui";
import { Task, TaskFormData, TaskDifficulty, TaskPriority, TaskStatus } from "@/types/task";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialTask?: Task | null;
}

const COMMON_SUBJECTS = [
  "Operating Systems",
  "Linear Algebra",
  "Data Structures",
  "Academic Writing",
  "Discrete Math",
  "Computer Networks",
  "Software Engineering",
  "Database Systems",
];

interface FormErrors {
  title?: string;
  subject?: string;
  deadline?: string;
  estimatedDurationMinutes?: string;
}

function TaskFormDialogContent({
  initialTask,
  onClose,
  onSubmit,
}: {
  initialTask?: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
}) {
  const isEditing = Boolean(initialTask);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Initialized directly from props without needing an effect
  const [title, setTitle] = useState(initialTask ? initialTask.title : "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [subject, setSubject] = useState(initialTask ? initialTask.subject : "Operating Systems");
  const [deadline, setDeadline] = useState(initialTask ? initialTask.deadline : "2026-10-13");
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState<number>(
    initialTask ? initialTask.estimatedDurationMinutes : 45
  );
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(
    initialTask ? initialTask.difficulty : "medium"
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialTask ? initialTask.priority : "medium"
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialTask ? initialTask.status : "pending"
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-focus title input when mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }

    if (!subject.trim()) {
      newErrors.subject = "Subject or course name is required.";
    }

    if (!deadline) {
      newErrors.deadline = "Please select a target deadline date.";
    }

    if (!estimatedDurationMinutes || estimatedDurationMinutes <= 0) {
      newErrors.estimatedDurationMinutes = "Duration must be a positive number of minutes.";
    } else if (estimatedDurationMinutes > 1440) {
      newErrors.estimatedDurationMinutes = "Duration cannot exceed 24 hours (1440 minutes).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    onSubmit({
      title,
      description,
      subject,
      deadline,
      estimatedDurationMinutes: Number(estimatedDurationMinutes),
      difficulty,
      priority,
      status,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      <div
        className="w-full max-w-lg rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-2xl my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)]"
              style={{ backgroundColor: "var(--color-accent-lavender)" }}
            >
              <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2
                id="task-form-title"
                className="text-lg font-bold text-[var(--color-text)]"
              >
                {isEditing ? "Edit Academic Task" : "Add New Task"}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isEditing
                  ? "Update deadlines, duration estimates, or task details."
                  : "Record your coursework deliverable to schedule your week."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title Field */}
          <FormField id="task-title">
            <Label htmlFor="task-title" required>
              Task Title
            </Label>
            <Input
              id="task-title"
              ref={titleInputRef}
              placeholder="e.g. Chapter 4 Practice Problems or Essay Draft"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              error={Boolean(errors.title)}
            />
            {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
          </FormField>

          {/* Subject / Course Field */}
          <FormField id="task-subject">
            <Label htmlFor="task-subject" required>
              Subject / Course
            </Label>
            <div className="space-y-1.5">
              <Input
                id="task-subject"
                placeholder="e.g. Operating Systems, Linear Algebra"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                }}
                leftIcon={<BookOpen className="h-4 w-4" />}
                error={Boolean(errors.subject)}
              />
              {/* Quick subject pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_SUBJECTS.slice(0, 5).map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setSubject(subj);
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                    }}
                    className="rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-medium border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>
            {errors.subject && <FormErrorMessage>{errors.subject}</FormErrorMessage>}
          </FormField>

          {/* Deadline & Estimated Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="task-deadline">
              <Label htmlFor="task-deadline" required>
                Target Deadline
              </Label>
              <Input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                leftIcon={<Calendar className="h-4 w-4" />}
                error={Boolean(errors.deadline)}
              />
              {errors.deadline && <FormErrorMessage>{errors.deadline}</FormErrorMessage>}
            </FormField>

            <FormField id="task-duration">
              <Label htmlFor="task-duration" required>
                Estimated Duration (mins)
              </Label>
              <Input
                id="task-duration"
                type="number"
                min={5}
                max={1440}
                step={5}
                value={estimatedDurationMinutes || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setEstimatedDurationMinutes(isNaN(val) ? 0 : val);
                  if (errors.estimatedDurationMinutes) {
                    setErrors((prev) => ({ ...prev, estimatedDurationMinutes: undefined }));
                  }
                }}
                leftIcon={<Clock className="h-4 w-4" />}
                error={Boolean(errors.estimatedDurationMinutes)}
              />
              {errors.estimatedDurationMinutes && (
                <FormErrorMessage>{errors.estimatedDurationMinutes}</FormErrorMessage>
              )}
            </FormField>
          </div>

          {/* Priority & Difficulty & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField id="task-priority">
              <Label htmlFor="task-priority">Priority</Label>
              <Select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </Select>
            </FormField>

            <FormField id="task-difficulty">
              <Label htmlFor="task-difficulty">Difficulty</Label>
              <Select
                id="task-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </FormField>

            <FormField id="task-status">
              <Label htmlFor="task-status">Status</Label>
              <Select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </FormField>
          </div>

          {/* Description Field */}
          <FormField id="task-description">
            <Label htmlFor="task-description">
              Notes & Description <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
            </Label>
            <Textarea
              id="task-description"
              rows={2}
              placeholder="Add key milestones, page numbers, or submission guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}: TaskFormModalProps) {
  if (!isOpen) return null;

  return (
    <TaskFormDialogContent
      key={initialTask ? initialTask.id : "new-task-form"}
      initialTask={initialTask}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
