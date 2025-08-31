import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from './auth.js';
import { supabase } from '../config/database.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// AI Chat endpoint
router.post('/chat', [
  body('message').trim().isLength({ min: 1 }),
  body('context').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, context } = req.body;

    // Get user's tasks for context
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user.userId);

    // Generate AI response based on the message and tasks
    const aiResponse = await generateAIResponse(message, tasks, context);

    // Log AI interaction
    await supabase.from('activities').insert([
      {
        type: 'ai_suggestion',
        description: `AI provided assistance: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
        user_id: req.user.userId
      }
    ]);

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// Generate task suggestions
router.post('/suggest-tasks', [
  body('description').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const { description } = req.body;
    
    const suggestions = await generateTaskSuggestions(description);

    res.json({
      success: true,
      suggestions,
      description
    });
  } catch (error) {
    console.error('Task suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate task suggestions' });
  }
});

// Generate subtasks
router.post('/generate-subtasks', [
  body('taskId').isUUID(),
  body('complexity').optional().isIn(['simple', 'medium', 'complex'])
], async (req, res) => {
  try {
    const { taskId, complexity = 'medium' } = req.body;

    // Get task details
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', req.user.userId)
      .single();

    if (error || !task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const subtasks = await generateSubtasks(task, complexity);

    res.json({
      success: true,
      subtasks,
      taskId
    });
  } catch (error) {
    console.error('Subtask generation error:', error);
    res.status(500).json({ error: 'Failed to generate subtasks' });
  }
});

// Analyze productivity
router.get('/productivity-insights', async (req, res) => {
  try {
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user.userId);

    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    const insights = await analyzeProductivity(tasks, activities);

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Productivity analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze productivity' });
  }
});

// Mock AI functions (replace with actual AI API calls)
async function generateAIResponse(message, tasks, context) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const taskCount = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

  if (message.toLowerCase().includes('summary')) {
    return {
      text: `Here's your task summary:\n\n📊 **Current Status:**\n- Total tasks: ${taskCount}\n- Completed: ${completedTasks}\n- High Priority: ${highPriorityTasks}\n\n💡 **Recommendation:** Focus on your ${tasks.filter(t => t.status === 'inprogress').length} in-progress tasks to maintain momentum.`,
      suggestions: [
        "Show me high priority tasks",
        "What should I work on next?",
        "Generate a focus plan for today"
      ]
    };
  }

  return {
    text: `I understand you want help with: "${message}"\n\nBased on your current workload, I can provide specific guidance on task prioritization, deadline management, and productivity optimization. What would you like to focus on?`,
    suggestions: [
      "Analyze my productivity patterns",
      "Help me prioritize tasks",
      "Suggest task deadlines"
    ]
  };
}

async function generateTaskSuggestions(description) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      title: `Research for: ${description}`,
      description: 'Gather information and resources needed',
      priority: 'medium',
      estimatedHours: 2
    },
    {
      title: `Plan implementation: ${description}`,
      description: 'Create detailed implementation strategy',
      priority: 'high', 
      estimatedHours: 1
    },
    {
      title: `Execute: ${description}`,
      description: 'Complete the main work',
      priority: 'high',
      estimatedHours: 4
    }
  ];
}

async function generateSubtasks(task, complexity) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const baseSubtasks = [
    'Research and planning phase',
    'Initial setup and configuration',
    'Core implementation',
    'Testing and validation',
    'Documentation and cleanup'
  ];

  if (complexity === 'complex') {
    return [
      ...baseSubtasks,
      'Performance optimization',
      'Security review',
      'User acceptance testing',
      'Deployment preparation'
    ];
  }

  return baseSubtasks.slice(0, complexity === 'simple' ? 3 : 5);
}

async function analyzeProductivity(tasks, activities) {
  const completionRate = tasks.length > 0 ? (tasks.filter(t => t.status === 'done').length / tasks.length) * 100 : 0;
  const avgTasksPerDay = activities.filter(a => a.type === 'task_created').length / 7; // Last week
  
  return {
    completionRate: Math.round(completionRate),
    avgTasksPerDay: Math.round(avgTasksPerDay * 10) / 10,
    mostProductiveDay: 'Tuesday',
    recommendations: [
      'Try time-blocking for better focus',
      'Break large tasks into smaller subtasks',
      'Use the AI assistant for task prioritization'
    ]
  };
}

export default router;