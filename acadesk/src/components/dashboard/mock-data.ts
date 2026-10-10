import { DemoTask, DemoDeadline, DemoScheduleBlock } from "./types";

/**
 * mock-data.ts
 *
 * Demonstrative mock data for Phase 4 student dashboard.
 * Explicitly marked as illustrative demo data.
 */

export const INITIAL_TASKS: DemoTask[] = [
  {
    id: "task-1",
    title: "Review Virtual Memory & Paging lecture notes",
    course: "Operating Systems",
    durationMinutes: 45,
    durationLabel: "45 min",
    priority: "high",
    completed: true,
  },
  {
    id: "task-2",
    title: "Draft Problem Set 4: Eigenvalues & Transformations",
    course: "Linear Algebra",
    durationMinutes: 75,
    durationLabel: "1 hr 15 min",
    priority: "high",
    completed: false,
  },
  {
    id: "task-3",
    title: "Binary Search Tree traversal implementation",
    course: "Data Structures",
    durationMinutes: 90,
    durationLabel: "1 hr 30 min",
    priority: "medium",
    completed: false,
  },
  {
    id: "task-4",
    title: "Source evaluation for term paper bibliography",
    course: "Academic Writing",
    durationMinutes: 30,
    durationLabel: "30 min",
    priority: "low",
    completed: true,
  },
  {
    id: "task-5",
    title: "Practice proof by induction exercise set",
    course: "Discrete Math",
    durationMinutes: 45,
    durationLabel: "45 min",
    priority: "medium",
    completed: false,
  },
];

export const INITIAL_DEADLINES: DemoDeadline[] = [
  {
    id: "dl-1",
    title: "CS 210 Research Paper — Final Submission",
    course: "Operating Systems",
    dueDate: "Monday, Oct 12",
    daysRemaining: 2,
    estimatedHours: 3.5,
    urgency: "urgent",
  },
  {
    id: "dl-2",
    title: "MATH 302 Midterm Exam (Units 1–4)",
    course: "Linear Algebra",
    dueDate: "Thursday, Oct 15",
    daysRemaining: 5,
    estimatedHours: 6.0,
    urgency: "moderate",
  },
  {
    id: "dl-3",
    title: "ENG 105 Project Milestone & Outline",
    course: "Academic Writing",
    dueDate: "Sunday, Oct 18",
    daysRemaining: 8,
    estimatedHours: 2.0,
    urgency: "normal",
  },
];

export const INITIAL_SCHEDULE: DemoScheduleBlock[] = [
  {
    id: "sched-1",
    timeSlot: "09:30 AM – 10:15 AM",
    activity: "Lecture Review & Concept Notes",
    course: "Operating Systems",
    duration: "45 min",
    status: "completed",
  },
  {
    id: "sched-2",
    timeSlot: "11:00 AM – 12:15 PM",
    activity: "Problem Set 4 Proofs Draft",
    course: "Linear Algebra",
    duration: "1 hr 15 min",
    status: "in-progress",
  },
  {
    id: "sched-3",
    timeSlot: "02:00 PM – 03:30 PM",
    activity: "Coding Traversal Algorithms",
    course: "Data Structures",
    duration: "1 hr 30 min",
    status: "scheduled",
  },
  {
    id: "sched-4",
    timeSlot: "04:15 PM – 04:45 PM",
    activity: "Quick Induction Drills",
    course: "Discrete Math",
    duration: "30 min",
    status: "scheduled",
  },
];
