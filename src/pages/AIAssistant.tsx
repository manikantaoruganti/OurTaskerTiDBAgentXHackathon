import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useTask } from '../contexts/TaskContext';
import { Bot, Send, Sparkles, CheckSquare, Clock, TrendingUp } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  suggestions?: string[];
}

const AIAssistant: React.FC = () => {
  const { tasks, addTask, addActivity } = useTask();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you summarize tasks, suggest deadlines, generate subtasks, and provide productivity insights. What would you like to know?",
      isUser: false,
      timestamp: new Date().toISOString(),
      suggestions: [
        "Summarize today's tasks",
        "Suggest deadlines for incomplete tasks",
        "Generate subtasks for my current project",
        "What should I focus on next?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickActions = [
    {
      icon: CheckSquare,
      title: 'Task Summary',
      description: 'Get an overview of your current tasks',
      prompt: "Summarize today's tasks and their priorities"
    },
    {
      icon: Clock,
      title: 'Deadline Suggestions',
      description: 'AI-suggested deadlines for your tasks',
      prompt: "Suggest realistic deadlines for my incomplete tasks"
    },
    {
      icon: TrendingUp,
      title: 'Productivity Insights',
      description: 'Analyze your productivity patterns',
      prompt: "Analyze my productivity and suggest improvements"
    }
  ];

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response based on the input
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);

      // Add activity log
      addActivity({
        type: 'ai_suggestion',
        description: `AI provided assistance: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
        user: 'AI Assistant'
      });
    }, 1500);
  };

  const generateAIResponse = (prompt: string): Message => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

    if (prompt.toLowerCase().includes('summary') || prompt.toLowerCase().includes('today')) {
      return {
        id: Date.now().toString(),
        text: `Here's your task summary:

📊 **Current Status:**
- Total tasks: ${totalTasks}
- Completed: ${completedTasks}
- In Progress: ${inProgressTasks}
- To Do: ${todoTasks}

🔥 **High Priority Tasks:** ${highPriorityTasks}

📈 **Recommendations:**
- Focus on completing your ${inProgressTasks} in-progress tasks first
- Consider breaking down complex tasks into smaller subtasks
- You're ${Math.round((completedTasks / totalTasks) * 100)}% complete with your current workload`,
        isUser: false,
        timestamp: new Date().toISOString(),
        suggestions: [
          "Show me high priority tasks",
          "Generate subtasks for my current project",
          "What should I work on next?"
        ]
      };
    }

    if (prompt.toLowerCase().includes('deadline') || prompt.toLowerCase().includes('suggest')) {
      const incompleteTasks = tasks.filter(t => t.status !== 'done');
      return {
        id: Date.now().toString(),
        text: `Based on your current workload, here are my deadline suggestions:

${incompleteTasks.slice(0, 3).map((task, index) => {
          const daysToAdd = task.priority === 'high' ? 2 : task.priority === 'medium' ? 5 : 7;
          const suggestedDate = new Date();
          suggestedDate.setDate(suggestedDate.getDate() + daysToAdd);
          
          return `${index + 1}. **${task.title}**
   Suggested deadline: ${suggestedDate.toLocaleDateString()}
   Reasoning: ${task.priority === 'high' ? 'High priority - needs immediate attention' : task.priority === 'medium' ? 'Medium priority - reasonable timeline' : 'Low priority - can be scheduled later'}`;
        }).join('\n\n')}

💡 **Tips:**
- Break large tasks into smaller, manageable pieces
- Buffer time for unexpected complexity
- Consider your other commitments and energy levels`,
        isUser: false,
        timestamp: new Date().toISOString(),
        suggestions: [
          "Generate subtasks for these deadlines",
          "How can I improve my time estimation?",
          "Show me productivity tips"
        ]
      };
    }

    if (prompt.toLowerCase().includes('subtask') || prompt.toLowerCase().includes('break down')) {
      return {
        id: Date.now().toString(),
        text: `I'll help you break down your tasks into manageable subtasks:

🎯 **For "Design landing page mockups":**
- Research competitor designs
- Create user flow wireframes
- Design hero section mockup
- Design features section
- Create mobile responsive layouts
- Get team feedback and iterate

🔧 **For "Set up database schema":**
- Plan database structure
- Create user tables
- Set up task and subtask relationships
- Configure authentication tables
- Add indexes for performance
- Test data migrations

✨ **Pro Tips:**
- Each subtask should take 1-3 hours max
- Make subtasks specific and actionable
- Include testing and review steps`,
        isUser: false,
        timestamp: new Date().toISOString(),
        suggestions: [
          "Create these subtasks automatically",
          "Estimate time for each subtask",
          "Prioritize these subtasks"
        ]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      text: `I understand you want help with: "${prompt}"

Based on your current tasks, I can help you with:

🤖 **Task Management:**
- Analyze your current workload and priorities
- Suggest optimal task ordering based on deadlines and dependencies
- Break down complex tasks into manageable subtasks

📊 **Productivity Insights:**
- Track your completion patterns and productivity trends
- Identify bottlenecks in your workflow
- Recommend focus time blocks for deep work

⚡ **Smart Suggestions:**
- Auto-generate task descriptions and acceptance criteria
- Suggest relevant tags and categorization
- Recommend team collaboration strategies

What specific area would you like me to focus on?`,
      isUser: false,
      timestamp: new Date().toISOString(),
      suggestions: [
        "Analyze my productivity patterns",
        "Help me prioritize tasks",
        "Generate a focus plan for today"
      ]
    };
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</h1>
              <p className="text-gray-500 dark:text-gray-400">Get intelligent help with your tasks</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <action.icon className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl ${message.isUser ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      message.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                  
                  {!message.isUser && message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSend(suggestion)}
                          className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          <Sparkles className="h-3 w-3 inline mr-1" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                <div className={`flex-shrink-0 ${message.isUser ? 'order-2 ml-3' : 'order-1 mr-3'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  }`}>
                    {message.isUser ? (
                      <span className="text-sm font-medium">U</span>
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your tasks..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;