import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task } from '../contexts/TaskContext';
import TaskCard from './TaskCard';
import clsx from 'clsx';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, onTaskClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getColumnColor = () => {
    switch (status) {
      case 'todo':
        return 'border-gray-200 dark:border-gray-600';
      case 'inprogress':
        return 'border-yellow-200 dark:border-yellow-600';
      case 'done':
        return 'border-green-200 dark:border-green-600';
      default:
        return 'border-gray-200 dark:border-gray-600';
    }
  };

  const getHeaderColor = () => {
    switch (status) {
      case 'todo':
        return 'text-gray-700 dark:text-gray-300';
      case 'inprogress':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'done':
        return 'text-green-700 dark:text-green-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="flex flex-col w-80">
      <div className={clsx('flex items-center justify-between mb-4', getHeaderColor())}>
        <h3 className="font-semibold text-sm uppercase tracking-wide">{title}</h3>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 min-h-96 p-4 rounded-lg border-2 border-dashed transition-colors',
          getColumnColor(),
          isOver && 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-500'
        )}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs">Drag tasks here or create new ones</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;