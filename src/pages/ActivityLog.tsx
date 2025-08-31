import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useTask } from '../contexts/TaskContext';
import { Activity, Clock, CheckSquare, MessageCircle, Edit, Bot, Filter } from 'lucide-react';
import clsx from 'clsx';

const ActivityLog: React.FC = () => {
  const { activities } = useTask();
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created':
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'task_updated':
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'task_completed':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'comment_added':
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case 'ai_suggestion':
        return <Bot className="h-4 w-4 text-indigo-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_created':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'task_updated':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'task_completed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'comment_added':
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20';
      case 'ai_suggestion':
        return 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesUser = filterUser === 'all' || activity.user === filterUser;
    return matchesType && matchesUser;
  });

  const uniqueUsers = [...new Set(activities.map(a => a.user))];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h1>
                <p className="text-gray-500 dark:text-gray-400">Track all team activities and changes</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Activities</option>
                  <option value="task_created">Task Created</option>
                  <option value="task_updated">Task Updated</option>
                  <option value="task_completed">Task Completed</option>
                  <option value="comment_added">Comments</option>
                  <option value="ai_suggestion">AI Suggestions</option>
                </select>
              </div>

              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-4xl mx-auto">
            {filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={clsx(
                      'relative flex items-start space-x-4 p-4 rounded-lg border transition-all hover:shadow-sm',
                      getActivityColor(activity.type)
                    )}
                  >
                    {/* Timeline indicator */}
                    {index !== filteredActivities.length - 1 && (
                      <div className="absolute left-6 top-12 w-px h-full bg-gray-200 dark:bg-gray-600" />
                    )}

                    {/* Icon */}
                    <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-700 rounded-full border-2 border-current">
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{activity.user}</span>
                        </div>
                        
                        {activity.taskId && (
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3" />
                            <span>Task #{activity.taskId.slice(-4)}</span>
                          </div>
                        )}
                        
                        <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded-full text-xs font-medium capitalize">
                          {activity.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activities found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {filterType !== 'all' || filterUser !== 'all'
                    ? 'No activities match your current filters.'
                    : 'Start working on tasks to see activity here.'
                  }
                </p>
              </div>
            )}

            {/* Summary stats */}
            {filteredActivities.length > 0 && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activities.filter(a => a.type === 'task_created').length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {activities.filter(a => a.type === 'task_completed').length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {activities.filter(a => a.type === 'comment_added').length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {activities.filter(a => a.type === 'ai_suggestion').length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">AI Assists</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivityLog;