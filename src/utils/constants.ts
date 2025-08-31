export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'inprogress',
  DONE: 'done'
} as const;

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export const ACTIVITY_TYPES = {
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_COMPLETED: 'task_completed',
  COMMENT_ADDED: 'comment_added',
  AI_SUGGESTION: 'ai_suggestion'
} as const;

export const DEMO_USERS = [
  'John Doe',
  'Jane Smith', 
  'Mike Johnson',
  'Sarah Wilson',
  'Alex Chen',
  'Current User'
];

export const COMMON_TAGS = [
  'frontend',
  'backend',
  'design',
  'urgent',
  'bug',
  'feature',
  'research',
  'testing',
  'documentation',
  'performance'
];

export const AI_PROMPTS = {
  TASK_SUMMARY: "Summarize today's tasks and their priorities",
  DEADLINE_SUGGESTIONS: "Suggest realistic deadlines for my incomplete tasks",
  SUBTASK_GENERATION: "Generate subtasks for my current project",
  PRODUCTIVITY_INSIGHTS: "Analyze my productivity and suggest improvements",
  FOCUS_PLAN: "Create a focus plan for today based on my tasks"
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme'
};