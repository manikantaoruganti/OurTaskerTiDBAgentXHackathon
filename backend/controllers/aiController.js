import { supabase } from '../config/database.js';

export class AIController {
  static async processTaskQuery(userId, query, context = {}) {
    try {
      // Get user's tasks for context
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      // Analyze query type and generate appropriate response
      const response = await this.generateContextualResponse(query, tasks, context);
      
      // Log AI interaction
      await supabase.from('activities').insert([
        {
          type: 'ai_suggestion',
          description: `AI provided assistance: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`,
          user_id: userId
        }
      ]);

      return response;
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process AI query');
    }
  }

  static async generateContextualResponse(query, tasks, context) {
    const lowerQuery = query.toLowerCase();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
    const overdueTasks = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    ).length;

    // Task summary queries
    if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
      return {
        text: `📊 **Task Summary**\n\n**Current Status:**\n- Total tasks: ${totalTasks}\n- Completed: ${completedTasks} (${Math.round((completedTasks / totalTasks) * 100)}%)\n- In Progress: ${inProgressTasks}\n- High Priority: ${highPriorityTasks}\n- Overdue: ${overdueTasks}\n\n**Insights:**\n${this.generateInsights(tasks)}`,
        suggestions: [
          "What should I focus on next?",
          "Show me overdue tasks",
          "Generate a daily plan"
        ]
      };
    }

    // Deadline and scheduling queries
    if (lowerQuery.includes('deadline') || lowerQuery.includes('schedule')) {
      const incompleteTasks = tasks.filter(t => t.status !== 'done').slice(0, 3);
      const deadlineText = incompleteTasks.map((task, index) => {
        const priority = task.priority;
        const daysToAdd = priority === 'high' ? 2 : priority === 'medium' ? 5 : 7;
        const suggestedDate = new Date();
        suggestedDate.setDate(suggestedDate.getDate() + daysToAdd);
        
        return `${index + 1}. **${task.title}**\n   Suggested: ${suggestedDate.toLocaleDateString()}\n   Reason: ${this.getDeadlineReason(priority)}`;
      }).join('\n\n');

      return {
        text: `🗓️ **Deadline Suggestions**\n\n${deadlineText}\n\n💡 **Tips:**\n- Add buffer time for complex tasks\n- Consider your energy levels throughout the week\n- Break large tasks into smaller milestones`,
        suggestions: [
          "Generate subtasks for these deadlines",
          "How can I improve time estimation?",
          "Create a weekly schedule"
        ]
      };
    }

    // Subtask generation queries
    if (lowerQuery.includes('subtask') || lowerQuery.includes('break down')) {
      const recentTasks = tasks.filter(t => t.status !== 'done').slice(0, 2);
      const subtaskText = recentTasks.map(task => {
        const subtasks = this.generateSubtasks(task);
        return `🎯 **${task.title}:**\n${subtasks.map((st, i) => `${i + 1}. ${st}`).join('\n')}`;
      }).join('\n\n');

      return {
        text: `🔧 **Task Breakdown Suggestions**\n\n${subtaskText}\n\n✨ **Best Practices:**\n- Keep subtasks under 3 hours each\n- Make them specific and actionable\n- Include testing and review steps`,
        suggestions: [
          "Create these subtasks automatically",
          "Estimate time for each subtask",
          "Prioritize these subtasks"
        ]
      };
    }

    // Productivity and focus queries
    if (lowerQuery.includes('focus') || lowerQuery.includes('productive') || lowerQuery.includes('next')) {
      const nextTasks = this.getNextTaskRecommendations(tasks);
      return {
        text: `🎯 **Focus Recommendations**\n\n**Next Actions:**\n${nextTasks.map((task, i) => `${i + 1}. ${task.title} (${task.priority} priority)`).join('\n')}\n\n**Productivity Tips:**\n- Start with your highest energy tasks\n- Use time-blocking for deep work\n- Take breaks between complex tasks`,
        suggestions: [
          "Create a time-blocked schedule",
          "Set up focus session timer",
          "Analyze my productivity patterns"
        ]
      };
    }

    // Default response
    return {
      text: `🤖 **AI Assistant Ready**\n\nI can help you with:\n\n📋 **Task Management:**\n- Summarize your workload and priorities\n- Suggest deadlines and time estimates\n- Break down complex tasks into manageable steps\n\n📊 **Productivity Insights:**\n- Analyze your completion patterns\n- Recommend optimal task ordering\n- Identify workflow bottlenecks\n\n⚡ **Smart Suggestions:**\n- Generate task descriptions\n- Suggest relevant tags and categories\n- Provide focus and energy management tips\n\nWhat would you like to explore?`,
      suggestions: [
        "Summarize today's tasks",
        "Suggest task deadlines",
        "Help me prioritize work",
        "Generate subtasks for my project"
      ]
    };
  }

  static generateInsights(tasks) {
    const insights = [];
    
    if (tasks.filter(t => t.status === 'inprogress').length > 3) {
      insights.push('- Consider focusing on fewer tasks at once for better completion rates');
    }
    
    const overdueTasks = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    );
    if (overdueTasks.length > 0) {
      insights.push(`- You have ${overdueTasks.length} overdue tasks that need immediate attention`);
    }
    
    const highPriorityPending = tasks.filter(t => t.priority === 'high' && t.status === 'todo');
    if (highPriorityPending.length > 0) {
      insights.push(`- ${highPriorityPending.length} high-priority tasks are waiting to be started`);
    }

    return insights.length > 0 ? insights.join('\n') : '- Your task management looks well organized!';
  }

  static getDeadlineReason(priority) {
    switch (priority) {
      case 'high':
        return 'High priority - needs immediate attention';
      case 'medium':
        return 'Reasonable timeline for medium complexity';
      case 'low':
        return 'Flexible deadline with buffer time';
      default:
        return 'Standard timeline recommendation';
    }
  }

  static generateSubtasks(task) {
    const baseSubtasks = [
      'Research and gather requirements',
      'Plan implementation approach',
      'Set up initial structure',
      'Core development work',
      'Testing and validation',
      'Documentation and review'
    ];

    // Customize based on task title/description
    if (task.title.toLowerCase().includes('design')) {
      return [
        'Research design inspiration',
        'Create wireframes and mockups',
        'Design system and components',
        'Create responsive layouts',
        'Get feedback and iterate',
        'Finalize designs and assets'
      ];
    }

    if (task.title.toLowerCase().includes('api') || task.title.toLowerCase().includes('backend')) {
      return [
        'Design API endpoints',
        'Set up database schema',
        'Implement core functionality',
        'Add authentication and security',
        'Write tests and documentation',
        'Deploy and monitor'
      ];
    }

    return baseSubtasks;
  }

  static getNextTaskRecommendations(tasks) {
    // Prioritize overdue tasks, then high priority, then by due date
    const sortedTasks = tasks
      .filter(t => t.status !== 'done')
      .sort((a, b) => {
        // Overdue tasks first
        const aOverdue = a.due_date && new Date(a.due_date) < new Date();
        const bOverdue = b.due_date && new Date(b.due_date) < new Date();
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        // Then by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // Then by due date
        if (a.due_date && b.due_date) {
          return new Date(a.due_date) - new Date(b.due_date);
        }

        return 0;
      });

    return sortedTasks.slice(0, 3);
  }
}