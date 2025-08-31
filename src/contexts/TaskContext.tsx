import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  comments: Comment[];
  tags: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  mentions: string[];
}

export interface Activity {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'comment_added' | 'ai_suggestion';
  description: string;
  user: string;
  timestamp: string;
  taskId?: string;
}

interface TaskContextType {
  tasks: Task[];
  activities: Activity[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  addComment: (taskId: string, comment: string, mentions?: string[]) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design landing page mockups',
      description: 'Create wireframes and high-fidelity designs for the homepage',
      status: 'inprogress',
      priority: 'high',
      dueDate: '2025-01-25',
      assignee: 'John Doe',
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T14:30:00Z',
      subtasks: [
        { id: 'st1', title: 'Create wireframes', completed: true, createdAt: '2025-01-20T10:15:00Z' },
        { id: 'st2', title: 'Design hero section', completed: false, createdAt: '2025-01-20T10:30:00Z' }
      ],
      comments: [
        { id: 'c1', text: 'Looking great so far! Can we add more CTAs?', author: 'Jane Smith', createdAt: '2025-01-20T11:00:00Z', mentions: [] }
      ],
      tags: ['design', 'frontend', 'urgent']
    },
    {
      id: '2',
      title: 'Set up database schema',
      description: 'Configure TiDB tables for users, tasks, and comments',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-01-26',
      assignee: 'Mike Johnson',
      createdAt: '2025-01-20T09:00:00Z',
      updatedAt: '2025-01-20T09:00:00Z',
      subtasks: [],
      comments: [],
      tags: ['backend', 'database']
    },
    {
      id: '3',
      title: 'Implement AI task suggestions',
      description: 'Integrate with OpenAI API to provide intelligent task recommendations',
      status: 'done',
      priority: 'high',
      assignee: 'Sarah Wilson',
      createdAt: '2025-01-19T08:00:00Z',
      updatedAt: '2025-01-20T16:00:00Z',
      subtasks: [
        { id: 'st3', title: 'Research OpenAI API', completed: true, createdAt: '2025-01-19T08:15:00Z' },
        { id: 'st4', title: 'Build prompt templates', completed: true, createdAt: '2025-01-19T10:00:00Z' }
      ],
      comments: [
        { id: 'c2', text: 'AI suggestions are working perfectly!', author: 'John Doe', createdAt: '2025-01-20T15:30:00Z', mentions: ['Sarah Wilson'] }
      ],
      tags: ['ai', 'backend', 'feature']
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'a1',
      type: 'task_created',
      description: 'Created task "Design landing page mockups"',
      user: 'John Doe',
      timestamp: '2025-01-20T10:00:00Z',
      taskId: '1'
    },
    {
      id: 'a2',
      type: 'ai_suggestion',
      description: 'AI suggested breaking down "Design landing page" into smaller subtasks',
      user: 'AI Assistant',
      timestamp: '2025-01-20T10:15:00Z',
      taskId: '1'
    },
    {
      id: 'a3',
      type: 'task_completed',
      description: 'Completed task "Implement AI task suggestions"',
      user: 'Sarah Wilson',
      timestamp: '2025-01-20T16:00:00Z',
      taskId: '3'
    }
  ]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    addActivity({
      type: 'task_created',
      description: `Created task "${newTask.title}"`,
      user: taskData.assignee,
      taskId: newTask.id
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
    addActivity({
      type: 'task_updated',
      description: `Updated task "${tasks.find(t => t.id === id)?.title}"`,
      user: 'Current User',
      taskId: id
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  const addComment = (taskId: string, comment: string, mentions: string[] = []) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text: comment,
      author: 'Current User',
      createdAt: new Date().toISOString(),
      mentions
    };

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...task.comments, newComment] }
        : task
    ));

    addActivity({
      type: 'comment_added',
      description: `Added comment to "${tasks.find(t => t.id === taskId)?.title}"`,
      user: 'Current User',
      taskId
    });
  };

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: [...task.subtasks, newSubtask] }
        : task
    ));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    ));
  };

  const addActivity = (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const value = {
    tasks,
    activities,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addComment,
    addSubtask,
    toggleSubtask,
    addActivity
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};