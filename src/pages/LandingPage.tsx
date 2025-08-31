import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Bot, Users, Zap, Github, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckSquare,
      title: 'Smart Task Management',
      description: 'Organize tasks with drag-and-drop Kanban boards and intelligent categorization'
    },
    {
      icon: Bot,
      title: 'AI-Powered Assistant',
      description: 'Get task suggestions, auto-generated subtasks, and productivity insights'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share tasks, add comments, mention teammates, and track activity'
    },
    {
      icon: Zap,
      title: 'Smart Integrations',
      description: 'Connect with Slack, Google Sheets, and other productivity tools'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10">
        <nav className="flex justify-between items-center px-6 py-4 md:px-12">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">OurTasker</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Bot className="h-4 w-4" />
            <span>AI-Powered Productivity</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your tasks,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"> simplified</span>
            <br />
            with AI.
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Collaborate with your team, get AI assistance, and boost productivity with our intelligent task management platform built for modern teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center space-x-2 font-semibold text-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="https://github.com/username/ourtasker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-8 py-4 border border-gray-300 rounded-lg hover:border-gray-400"
            >
              <Github className="h-5 w-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for students and teams who want to get things done efficiently with the power of AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-500 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to supercharge your productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and teams already using OurTasker
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
          >
            Start Building Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CheckSquare className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">OurTasker</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 OurTasker. Built with ❤️ for hackathons and student developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;