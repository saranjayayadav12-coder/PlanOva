import { Task } from "@/types/task";
import { Subtask, SubtaskSuggestion } from "@/types/subtask";

/**
 * ai-breakdown-service.ts
 *
 * Architecture for AI-powered task decomposition.
 *
 * Current Mode: Development / Demo Adapter
 * Note: Because no external AI API key (e.g. OpenAI, Anthropic, Gemini) is configured
 * in the environment, this service uses an intelligent academic rule engine that
 * generates realistic, domain-specific subtask sequences tailored to the assignment's
 * subject, difficulty, and duration.
 *
 * To plug in a real LLM provider in the future:
 * 1. Set up a Next.js Server Route (e.g. /api/breakdown) to keep secret API keys off the client.
 * 2. Send the parent task metadata with a structured system prompt requesting JSON output.
 * 3. Validate the LLM output against the SubtaskSuggestion schema.
 */

export interface BreakdownServiceResponse {
  suggestions: Subtask[];
  isDemoAdapter: boolean;
  modelIdentifier: string;
}

/**
 * Domain-specific subtask generators based on academic subject matter.
 */
function generateAcademicSuggestions(task: Task): SubtaskSuggestion[] {
  const subjectLower = task.subject.toLowerCase();
  const titleLower = task.title.toLowerCase();
  const parentMins = Math.max(15, task.estimatedDurationMinutes);

  // 1. Math / Linear Algebra / Discrete Math
  if (
    subjectLower.includes("math") ||
    subjectLower.includes("algebra") ||
    subjectLower.includes("calculus") ||
    subjectLower.includes("statistic")
  ) {
    const p1 = Math.max(10, Math.round(parentMins * 0.25));
    const p2 = Math.max(15, Math.round(parentMins * 0.4));
    const p3 = Math.max(10, Math.round(parentMins * 0.25));
    const p4 = Math.max(5, parentMins - (p1 + p2 + p3));

    return [
      {
        order: 1,
        title: "Review relevant theorems and lecture formulas",
        description: `Review syllabus notes and textbook definitions related to "${task.title}".`,
        estimatedDurationMinutes: p1,
      },
      {
        order: 2,
        title: "Solve core practice problems and draft solutions",
        description: "Work through primary equations and problem set exercises step-by-step.",
        estimatedDurationMinutes: p2,
      },
      {
        order: 3,
        title: "Verify mathematical proofs and edge conditions",
        description: "Double check calculations, signs, and boundary values for consistency.",
        estimatedDurationMinutes: p3,
      },
      {
        order: 4,
        title: "Final review and write clean submission copy",
        description: "Format formulas clearly and prepare final answers for grading.",
        estimatedDurationMinutes: Math.max(5, p4),
      },
    ];
  }

  // 2. Computer Science / Programming / Systems
  if (
    subjectLower.includes("computer") ||
    subjectLower.includes("operating") ||
    subjectLower.includes("data structure") ||
    subjectLower.includes("software") ||
    subjectLower.includes("network") ||
    subjectLower.includes("algorithm") ||
    titleLower.includes("code") ||
    titleLower.includes("implement")
  ) {
    const p1 = Math.max(10, Math.round(parentMins * 0.2));
    const p2 = Math.max(15, Math.round(parentMins * 0.45));
    const p3 = Math.max(10, Math.round(parentMins * 0.25));
    const p4 = Math.max(5, parentMins - (p1 + p2 + p3));

    return [
      {
        order: 1,
        title: "Understand requirements & plan logic design",
        description: `Map out data structures, APIs, and pseudocode for "${task.title}".`,
        estimatedDurationMinutes: p1,
      },
      {
        order: 2,
        title: "Implement core algorithm and data logic",
        description: "Write clean, modular code implementing the primary functional requirements.",
        estimatedDurationMinutes: p2,
      },
      {
        order: 3,
        title: "Test with edge cases and debug errors",
        description: "Run sample test fixtures, memory checks, and boundary scenario evaluations.",
        estimatedDurationMinutes: p3,
      },
      {
        order: 4,
        title: "Refactor, document code, and prepare submission",
        description: "Add comments, clean up syntax warnings, and compile clean deliverable.",
        estimatedDurationMinutes: Math.max(5, p4),
      },
    ];
  }

  // 3. Writing / Humanities / Essays / Research
  if (
    subjectLower.includes("writing") ||
    subjectLower.includes("english") ||
    subjectLower.includes("history") ||
    subjectLower.includes("philosophy") ||
    titleLower.includes("paper") ||
    titleLower.includes("essay") ||
    titleLower.includes("draft")
  ) {
    const p1 = Math.max(10, Math.round(parentMins * 0.2));
    const p2 = Math.max(15, Math.round(parentMins * 0.3));
    const p3 = Math.max(15, Math.round(parentMins * 0.35));
    const p4 = Math.max(5, parentMins - (p1 + p2 + p3));

    return [
      {
        order: 1,
        title: "Brainstorm thesis and outline section headers",
        description: `Establish main argument, sub-points, and outline flow for "${task.title}".`,
        estimatedDurationMinutes: p1,
      },
      {
        order: 2,
        title: "Gather citations and evidence references",
        description: "Select peer-reviewed articles, direct quotes, and supporting data points.",
        estimatedDurationMinutes: p2,
      },
      {
        order: 3,
        title: "Draft body sections and connecting transitions",
        description: "Write focused paragraphs connecting evidence to your central thesis.",
        estimatedDurationMinutes: p3,
      },
      {
        order: 4,
        title: "Proofread flow, style, and bibliography",
        description: "Check citation style guidelines, grammar, and conclusion strength.",
        estimatedDurationMinutes: Math.max(5, p4),
      },
    ];
  }

  // 4. General Academic Fallback
  const p1 = Math.max(10, Math.round(parentMins * 0.25));
  const p2 = Math.max(15, Math.round(parentMins * 0.5));
  const p3 = Math.max(5, parentMins - (p1 + p2));

  return [
    {
      order: 1,
      title: "Preparation and study material setup",
      description: `Review instructions and gather all materials required for "${task.title}".`,
      estimatedDurationMinutes: p1,
    },
    {
      order: 2,
      title: "Execute primary deliverable work",
      description: "Focus on the core assignment components and milestone steps.",
      estimatedDurationMinutes: p2,
    },
    {
      order: 3,
      title: "Review work against grading rubric",
      description: "Confirm all assignment requirements have been satisfied before submission.",
      estimatedDurationMinutes: Math.max(5, p3),
    },
  ];
}

/**
 * Service method to request an AI task breakdown.
 * Emulates realistic asynchronous processing and formats the output
 * with unique IDs, ordering, and dependency linkages.
 */
export async function requestTaskBreakdown(
  task: Task
): Promise<BreakdownServiceResponse> {
  // Simulate network round-trip latency (600ms) for realistic UX state testing
  await new Promise((resolve) => setTimeout(resolve, 600));

  const suggestions = generateAcademicSuggestions(task);
  const now = new Date().toISOString();

  // Convert raw suggestions to full Subtask records with dependency linkage
  const subtasks: Subtask[] = [];

  for (let i = 0; i < suggestions.length; i++) {
    const s = suggestions[i];
    const subtaskId = `subtask-${Date.now()}-${i + 1}`;

    // Previous subtask acts as dependency if order > 1
    const dependencyIds: string[] = [];
    if (i > 0 && subtasks[i - 1]) {
      dependencyIds.push(subtasks[i - 1].id);
    }

    subtasks.push({
      id: subtaskId,
      title: s.title,
      description: s.description,
      estimatedDurationMinutes: s.estimatedDurationMinutes,
      order: i + 1,
      status: "pending",
      dependencyIds,
      createdAt: now,
      updatedAt: now,
    });
  }

  return {
    suggestions: subtasks,
    isDemoAdapter: true,
    modelIdentifier: "academic-heuristics-v1 (demo adapter)",
  };
}
