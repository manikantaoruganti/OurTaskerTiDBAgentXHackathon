// Mock API utilities for demonstration purposes
// In a real application, these would be actual API calls

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const mockDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const mockApiCall = async <T>(data: T): Promise<ApiResponse<T>> => {
  await mockDelay();
  return {
    data,
    success: true,
    message: 'Operation completed successfully'
  };
};

export const generateAIResponse = async (prompt: string): Promise<string> => {
  await mockDelay(1500);
  
  // Simple mock responses based on prompt keywords
  if (prompt.toLowerCase().includes('summary')) {
    return 'Based on your tasks, you have 3 high-priority items due this week. Focus on completing the in-progress tasks first for better workflow.';
  }
  
  if (prompt.toLowerCase().includes('subtask')) {
    return 'I suggest breaking this down into: 1) Research phase (2 hours), 2) Planning phase (1 hour), 3) Implementation (4 hours), 4) Testing (1 hour), 5) Review (30 minutes).';
  }
  
  if (prompt.toLowerCase().includes('deadline')) {
    return 'Based on task complexity and your current workload, I recommend setting the deadline for 5 business days from now. This allows buffer time for unexpected challenges.';
  }
  
  return 'I understand your request. Let me analyze your tasks and provide relevant suggestions to help improve your productivity.';
};

export const searchTasks = async (query: string, filters: any) => {
  await mockDelay(500);
  // In a real app, this would use vector search with TiDB
  return mockApiCall([]);
};

export const sendSlackNotification = async (webhook: string, message: string) => {
  await mockDelay();
  // Mock Slack integration
  return mockApiCall({ sent: true });
};

export const updateGoogleSheet = async (sheetId: string, data: any) => {
  await mockDelay();
  // Mock Google Sheets integration
  return mockApiCall({ updated: true });
};