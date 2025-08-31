# 🚀 OurTasker - AI-Powered Task Management Platform

**Your tasks, simplified with AI.**

OurTasker is a modern, collaborative task management platform built for students and teams who want to boost productivity with the power of artificial intelligence. Built for hackathons and real-world use.

![OurTasker Preview](https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop Kanban Board** - Intuitive task organization with smooth animations
- **AI Task Assistant** - Get intelligent suggestions, summaries, and auto-generated subtasks
- **Real-time Collaboration** - Comments, mentions, and team activity tracking
- **Smart Search & Filtering** - Find tasks quickly with advanced search capabilities
- **Beautiful Dashboard** - Clean, modern interface with productivity insights

### 🤖 AI-Powered Features
- Task summarization and priority analysis
- Intelligent deadline suggestions based on workload
- Auto-generation of subtasks for complex projects
- Productivity insights and workflow optimization
- Natural language task queries

### 👥 Collaboration Tools
- Task comments and team mentions
- Real-time activity log with timeline view
- Team member assignment and tracking
- Visual progress indicators and status updates

### 🎨 Modern Design
- Responsive design optimized for all devices
- Dark/light mode with smooth transitions
- Apple-inspired design aesthetics with attention to detail
- Smooth animations and micro-interactions
- Professional yet student-friendly interface

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- @dnd-kit for drag and drop
- React Router for navigation
- @headlessui/react for accessible components

**Backend (Ready for Implementation):**
- Node.js with Express.js
- JWT authentication
- RESTful API design
- Database integration ready

**Database:**
- Supabase (PostgreSQL) with Row Level Security
- Vector search capabilities for intelligent task discovery
- Real-time subscriptions for live updates

**AI Integration:**
- OpenAI API / Anthropic Claude / Llama API support
- Configurable AI providers
- Smart prompt engineering for task management

**External Integrations:**
- Slack API for team notifications
- Google Sheets API for task logging
- Webhook support for custom integrations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for database)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ourtasker.git
   cd ourtasker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your API keys and database URLs
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the app in action!

### Demo Credentials
- **Email:** demo@ourtasker.com
- **Password:** demo123

## 📱 Pages & Features

### 🏠 Landing Page
- Clean hero section with project branding
- Feature highlights with smooth animations
- Call-to-action buttons for sign up and GitHub
- Responsive design with gradient backgrounds

### 🔐 Authentication
- Secure email/password registration and login
- JWT-based authentication system
- Form validation and error handling
- Password visibility toggle

### 📊 Dashboard
- Kanban board with drag-and-drop functionality
- Task statistics and progress visualization
- Filter and sort options
- Quick task creation modal

### 🤖 AI Assistant
- Chat interface for natural language queries
- Pre-built prompts for common tasks
- Smart suggestions based on current workload
- Integration with task creation workflow

### 🔍 Search & Filter
- Comprehensive search across tasks, comments, and tags
- Multiple filter options (status, priority, assignee)
- Grid view of search results
- Real-time search with debouncing

### 📈 Activity Log
- Timeline view of all team activities
- Filter by activity type and user
- Visual indicators for different action types
- Activity statistics dashboard

### ⚙️ Settings
- User profile management
- Notification preferences
- Theme switching (dark/light mode)
- External integration setup (Slack, Google Sheets)
- Security options

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── KanbanBoard.tsx
│   ├── TaskCard.tsx
│   ├── TaskModal.tsx
│   └── Layout.tsx
├── contexts/            # React context providers
│   ├── AuthContext.tsx
│   ├── TaskContext.tsx
│   └── ThemeContext.tsx
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── AIAssistant.tsx
│   └── Settings.tsx
├── utils/              # Utility functions
│   ├── mockApi.ts
│   └── constants.ts
└── types/              # TypeScript type definitions
```

### Key Components

- **AuthContext**: Manages user authentication state
- **TaskContext**: Handles all task-related operations and state
- **ThemeContext**: Controls dark/light mode switching
- **KanbanBoard**: Drag-and-drop task management interface
- **AIAssistant**: Chat interface for AI interactions

### Styling Guidelines
- Uses Tailwind CSS with custom color system
- Follows 8px spacing system
- Implements proper contrast ratios for accessibility
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting platform
3. Set environment variables in your hosting dashboard

### Backend Deployment (Render/Railway)
1. Create a new service on your hosting platform
2. Connect your GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Database Setup (Supabase)
1. Create a new Supabase project
2. Run the provided SQL migrations
3. Enable Row Level Security
4. Configure authentication settings

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
VITE_OPENAI_API_KEY=your_openai_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key

# External Integrations
VITE_SLACK_WEBHOOK_URL=your_slack_webhook
VITE_GOOGLE_SHEETS_API_KEY=your_google_api_key
```

## 📊 Database Schema

The application uses Supabase with the following main tables:
- **users** - User profiles and authentication
- **tasks** - Main task entities with status, priority, and metadata
- **subtasks** - Task breakdown and progress tracking
- **comments** - Team collaboration and communication
- **activities** - Audit trail and activity logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Built For Hackathons

This project was designed with hackathon participants in mind:
- **Quick Setup**: Get running in under 5 minutes
- **Modern Stack**: Uses current best practices and popular technologies
- **Extensible**: Easy to add new features and integrations
- **Production Ready**: Deployment-ready with proper error handling
- **Well Documented**: Clear code comments and comprehensive README

## 🙏 Acknowledgments

- Built with love for the student developer community
- Inspired by modern productivity tools like Notion, Linear, and Todoist
- Icons provided by Lucide React
- Images from Pexels
- Powered by React, Tailwind CSS, and Supabase

---

**Happy coding! 🚀**

*Made with ❤️ for hackathons and student developers*